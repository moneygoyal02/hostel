// components/ImageSlider.tsx
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade, Keyboard, A11y } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/a11y';
import './ImageSlider.css';

interface SliderImage {
  _id: string;
  url: string;
  caption?: string;
  order: number;
}

interface ImageSliderProps {
  images: SliderImage[];
  height?: string;
  autoplayDelay?: number;
  fullScreen?: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  images, 
  height = "h-96", 
  autoplayDelay = 3000,
  fullScreen = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  
  // Get navbar height on component mount
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
    
    // Update on resize
    const handleResize = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Sort images by order property
  const sortedImages = images.sort((a, b) => a.order - b.order);
  
  // Handle image load complete
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Determine the height class based on fullScreen prop
  const heightClass = fullScreen ? 'h-screen' : height;
  
  // Calculate dynamic height and position for the slider
  const sliderStyle = fullScreen ? { 
    height: `calc(90vh - ${navbarHeight}px)`,
    marginTop: `${navbarHeight}px` // Add top margin equal to navbar height
  } : {};

  const swiperOptions: SwiperOptions = {
    modules: [Pagination, Autoplay, EffectFade, Keyboard, A11y],
    spaceBetween: 0,
    effect: "fade",
    navigation: false,
    pagination: { 
      clickable: true,
      type: 'bullets',
      renderBullet: function (index, className) {
        return `<span class="${className}" role="button" aria-label="Go to slide ${index + 1}"></span>`;
      }
    },
    autoplay: { 
      delay: autoplayDelay,
      disableOnInteraction: false 
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    a11y: {
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide',
    },
    loop: true,
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 1,
        spaceBetween: 0
      }
    },
    on: {
      slideChange: (swiper) => {
        setActiveIndex(swiper.realIndex);
      }
    }
  };

  if (images.length === 0) {
    return <div className={`${heightClass} flex items-center justify-center bg-gray-100 w-full`} style={sliderStyle}>No images available</div>;
  }

  return (
    <div className={`relative slider-container w-full ${fullScreen ? 'fullscreen' : ''}`} style={sliderStyle}>
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 z-10 w-full`} style={sliderStyle}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <Swiper {...swiperOptions} className={`mySwiper ${fullScreen ? 'fullscreen-swiper' : ''}`}>
        {sortedImages.map((image, index) => (
          <SwiperSlide key={image._id}>
            <div className="relative w-full h-full">
              <img
                src={image.url}
                alt={image.caption || `Slider Image ${index + 1}`}
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
                loading="lazy"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <h3 className="text-lg font-medium">{image.caption}</h3>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Image counter */}
      <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-md z-20">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageSlider;
