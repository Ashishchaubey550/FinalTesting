import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "../CSS/PrevButoon.css";

function FullViewSlider({ product, closeModal, imageHeight = 400 }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const isMobile = windowWidth < 768;
  const dynamicImageHeight = isMobile ? Math.min(windowWidth * 0.7, 300) : imageHeight;

  // Only change: Image URL handling
  const processImageUrl = (url) => {
    if (!url) return null;
    // Remove domain prefixes if present
    const cloudinaryIndex = url.indexOf('res.cloudinary.com');
    if (cloudinaryIndex > -1) {
      return `https://${url.slice(cloudinaryIndex)}`;
    }
    return url.replace('http://', 'https://');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="relative bg-red-100 rounded-xl w-full max-w-6xl mx-4 overflow-hidden shadow-xl max-h-[90vh] flex flex-col lg:flex-row">
        {/* Close Button - unchanged */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 z-50 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all"
          style={{ width: '40px', height: '40px' }}
        >
          ✕
        </button>

        {/* Image Slider with fixes */}
        <div className="flex-1 lg:max-w-[50%] p-4 min-h-[300px] lg:min-h-full">
          <Slider {...sliderSettings} className="h-full">
            {product.images
              ?.filter(img => !!img) // Filter out null/undefined
              .map((image, idx) => {
                const imgUrl = processImageUrl(image);
                return (
                  <div key={idx} className="h-full flex items-center">
                    <img
                      className="object-contain w-full rounded-lg"
                      src={imgUrl}
                      alt={`Product Image ${idx + 1}`}
                      style={{
                        maxHeight: `${dynamicImageHeight}px`,
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
                      }}
                    />
                  </div>
                );
              })}
          </Slider>
        </div>

        {/* Rest of the component remains EXACTLY the same */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 border-t lg:border-t-0 lg:border-l border-red-200">
          {/* ... existing product details ... */}
        </div>
      </div>
    </div>
  );
}

// DetailItem component remains unchanged
const DetailItem = ({ label, value, highlight }) => (
  <div className="space-y-1 p-3 bg-red-50 rounded-lg">
    <span className="text-sm md:text-base font-medium text-red-700">{label}:</span>
    <p className={`text-base md:text-lg ${highlight ? 'font-bold text-green-600' : 'text-gray-900'}`}>
      {value}
    </p>
  </div>
);

export default FullViewSlider;