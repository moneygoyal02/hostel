// components/ImageSlider.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import './ImageSlider.css'; // Import CSS

interface Image {
  _id: string;
  url: string;
  caption?: string;
  order: number;
}

interface ImageSliderProps {
  images: Image[];
  autoPlay?: boolean;
  interval?: number;
  fullScreen?: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  images, 
  autoPlay = true, 
  interval = 5000,
  fullScreen = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto play functionality
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, images.length, interval]);
  
  // If no images, show placeholder
  if (images.length === 0) {
    return (
      <div className="slider-container w-full bg-gray-200 flex items-center justify-center" style={{ height: '60vh' }}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }
  
  // If only one image, just show it without controls
  if (images.length === 1) {
    return (
      <div className="slider-container w-full relative" style={{ height: '60vh' }}>
        <img 
          src={images[0].url} 
          alt={images[0].caption || 'Slider image'} 
          className="w-full h-full object-cover"
        />
        {images[0].caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 text-center">
            {images[0].caption}
          </div>
        )}
      </div>
    );
  }
  
  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  
  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? sortedImages.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      (prevIndex + 1) % sortedImages.length
    );
  };
  
  return (
    <div className={`slider-container w-full relative ${fullScreen ? 'fullscreen' : ''}`} 
         style={{ height: fullScreen ? '60vh' : '400px' }}>
      {/* Main image */}
      <img 
        src={sortedImages[currentIndex].url} 
        alt={sortedImages[currentIndex].caption || `Slider image ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      
      {/* Caption */}
      {sortedImages[currentIndex].caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 text-center">
          {sortedImages[currentIndex].caption}
        </div>
      )}
      
      {/* Navigation buttons */}
      <button 
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-white focus:outline-none"
        aria-label="Previous image"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-white focus:outline-none"
        aria-label="Next image"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        {sortedImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full mx-1 focus:outline-none ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
