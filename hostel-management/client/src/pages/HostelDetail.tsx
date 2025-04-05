import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ImageSlider from '../components/ImageSlider';
import { FaBed, FaUtensils, FaWifi, FaBook, FaShower, FaUsers } from 'react-icons/fa';

// Define interfaces for the hostel data
interface HostelImage {
  _id: string;
  url: string;
  caption?: string;
  order: number;
}

interface HostelStaff {
  _id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  photo?: string;
}

interface MessMenu {
  _id: string;
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

interface Facility {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface Hostel {
  _id: string;
  name: string;
  type: 'boys' | 'girls';
  code: string;
  about: string;
  wardenMessage: string;
  wardenName: string;
  wardenEmail: string;
  wardenPhoto?: string;
  facilities: Facility[];
  images: HostelImage[];
  sliderImages: HostelImage[];
  messImages: HostelImage[];
  galleryImages: HostelImage[];
  messMenu: MessMenu[];
  staff: HostelStaff[];
}

const HostelDetail: React.FC = () => {
  const { hostelType, hostelId } = useParams<{ hostelType: string; hostelId: string }>();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('about');
  const [activeDay, setActiveDay] = useState('Monday');

  useEffect(() => {
    const fetchHostelData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/hostels/${hostelType}/${hostelId}`);
        setHostel(response.data.hostel);
        setError(null);
      } catch (err) {
        console.error('Error fetching hostel data:', err);
        setError('Failed to load hostel details');
      } finally {
        setLoading(false);
      }
    };

    fetchHostelData();
  }, [hostelType, hostelId]);

  const getFacilityIcon = (name: string) => {
    const nameLC = name.toLowerCase();
    if (nameLC.includes('bed') || nameLC.includes('room')) return <FaBed />;
    if (nameLC.includes('mess') || nameLC.includes('food')) return <FaUtensils />;
    if (nameLC.includes('wifi') || nameLC.includes('internet')) return <FaWifi />;
    if (nameLC.includes('study') || nameLC.includes('library')) return <FaBook />;
    if (nameLC.includes('bath') || nameLC.includes('shower')) return <FaShower />;
    return <FaUsers />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h1 className="text-2xl font-bold text-red-500">Error</h1>
            <p className="mt-4">{error || 'Hostel not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentDayMenu = hostel.messMenu.find(menu => menu.day === activeDay) || {
    day: activeDay,
    breakfast: 'Not available',
    lunch: 'Not available',
    snacks: 'Not available',
    dinner: 'Not available'
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-8 pt-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">{hostel.name}</h1>
          <p className="text-white text-opacity-80">Code: {hostel.code}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-t-lg shadow-md overflow-hidden">
          <div className="h-80">
            {hostel.sliderImages.length > 0 ? (
              <ImageSlider images={hostel.sliderImages} />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">No slider images available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white shadow-md rounded-b-lg">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                activeTab === 'about'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                activeTab === 'warden'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('warden')}
            >
              Warden Message
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                activeTab === 'mess'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('mess')}
            >
              Mess
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                activeTab === 'facilities'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('facilities')}
            >
              Facilities
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                activeTab === 'gallery'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                activeTab === 'staff'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('staff')}
            >
              Staff
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'about' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">About {hostel.name}</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{hostel.about}</p>
                </div>
              </div>
            )}

            {activeTab === 'warden' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Message from the Warden</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    <div className="rounded-lg overflow-hidden shadow-md bg-gray-50 p-4 text-center">
                      {hostel.wardenPhoto ? (
                        <img
                          src={hostel.wardenPhoto}
                          alt={hostel.wardenName}
                          className="w-40 h-40 object-cover rounded-full mx-auto"
                        />
                      ) : (
                        <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center mx-auto">
                          <span className="text-gray-500">No photo</span>
                        </div>
                      )}
                      <h3 className="font-bold mt-4">{hostel.wardenName}</h3>
                      <p className="text-sm text-gray-600">Warden</p>
                      <p className="text-sm text-blue-500 mt-2">{hostel.wardenEmail}</p>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{hostel.wardenMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mess' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Mess Facilities</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Mess Images</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {hostel.messImages.length > 0 ? (
                      hostel.messImages.map(image => (
                        <div key={image._id} className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                          <img 
                            src={image.url} 
                            alt={image.caption || 'Mess image'} 
                            className="w-full h-48 object-cover"
                          />
                          {image.caption && (
                            <div className="p-2 text-center text-sm text-gray-600">
                              {image.caption}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No mess images available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Mess Menu</h3>
                  
                  <div className="flex flex-wrap mb-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <button
                        key={day}
                        className={`px-4 py-2 text-sm mr-2 mb-2 rounded-lg ${
                          activeDay === day
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveDay(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800">Breakfast</h4>
                        <p className="mt-1 text-gray-600">{currentDayMenu.breakfast}</p>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800">Lunch</h4>
                        <p className="mt-1 text-gray-600">{currentDayMenu.lunch}</p>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800">Snacks</h4>
                        <p className="mt-1 text-gray-600">{currentDayMenu.snacks}</p>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800">Dinner</h4>
                        <p className="mt-1 text-gray-600">{currentDayMenu.dinner}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'facilities' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Facilities</h2>
                
                {hostel.facilities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {hostel.facilities.map(facility => (
                      <div key={facility._id} className="bg-white rounded-lg shadow-md p-4 flex">
                        <div className="mr-4 text-blue-500 text-2xl">
                          {facility.icon ? (
                            <img 
                              src={facility.icon} 
                              alt={facility.name} 
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            getFacilityIcon(facility.name)
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{facility.name}</h3>
                          {facility.description && (
                            <p className="text-gray-600 text-sm mt-1">{facility.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No facilities information available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                
                {hostel.galleryImages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {hostel.galleryImages.map(image => (
                      <div key={image._id} className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={image.url} 
                          alt={image.caption || 'Gallery image'} 
                          className="w-full h-48 object-cover"
                        />
                        {image.caption && (
                          <div className="p-2 text-center text-sm text-gray-600">
                            {image.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No gallery images available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'staff' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Hostel Staff</h2>
                
                {hostel.staff.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {hostel.staff.map(member => (
                      <div key={member._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 bg-gray-200">
                          {member.photo ? (
                            <img 
                              src={member.photo} 
                              alt={member.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-500">No photo</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800">{member.name}</h3>
                          <p className="text-gray-600 text-sm">{member.role}</p>
                          {member.email && (
                            <p className="text-blue-500 text-sm mt-2">{member.email}</p>
                          )}
                          {member.phone && (
                            <p className="text-gray-600 text-sm">{member.phone}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No staff information available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="mt-12 bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">{hostel.name}</h3>
              <p>Contact: {hostel.wardenEmail}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-300 hover:text-white">Home</a></li>
                <li><a href="#" className="text-blue-300 hover:text-white">Login</a></li>
                <li><a href="#" className="text-blue-300 hover:text-white">Dashboard</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Hostel Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HostelDetail; 