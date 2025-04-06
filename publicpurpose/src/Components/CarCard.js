import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

const CarCard = ({ car }) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  // Image URL normalization
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url.replace('http://', 'https://');
    if (url.includes('res.cloudinary.com')) return `https://${url}`;
    return url;
  };

  return (
    <Link to="/productList" className="block">
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="flex-grow">
          <Slider {...sliderSettings}>
            {car.images
              ?.filter(img => !!img) // Remove null/undefined
              .map((image, idx) => {
                const imageUrl = getImageUrl(image);
                return (
                  imageUrl && (
                    <div key={idx}>
                      <img
                       loading="lazy"
                        src={imageUrl}
                        alt={`${car.model} ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Car+Image';
                        }}
                      />
                    </div>
                  )
                );
              })}
          </Slider>
          
          {/* Rest of the UI remains unchanged */}
          <h3 className="font-bold text-lg mt-4 text-gray-800">{car.model}</h3>
          <p className="text-gray-600">{car.company}</p>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold text-gray-900">
              ₹{car.price} Lakh
            </p>
            <div className="flex gap-2">
              {car.condition === "preowned" && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Preowned
                </span>
              )}
              {car.registrationStatus === "unregistered" && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Unregistered
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;