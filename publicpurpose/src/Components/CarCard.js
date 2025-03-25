import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

const CarCard = ({ car }) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <Link to={`/product/${car._id}`} className="block">
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="flex-grow">
          <Slider {...sliderSettings}>
            {car.images?.map((image, idx) => (
              <div key={idx}>
                <img
                  src={`https://finaltesting-tnim.onrender.com${image}`}
                  alt={`${car.model} ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
          
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
