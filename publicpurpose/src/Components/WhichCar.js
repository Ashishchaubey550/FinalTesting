import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "./CarCard";
import Slider from "react-slick";

const WhichCar = () => {
  const navigate = useNavigate();
  const [preownedCars, setPreownedCars] = useState([]);
  const [unregisteredCars, setUnregisteredCars] = useState([]);

  // Add slider settings
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const [preownedRes, unregisteredRes] = await Promise.all([
        fetch("https://finaltesting-tnim.onrender.com/productlist?condition=preowned&limit=4"),
        fetch("https://finaltesting-tnim.onrender.com/productlist?registrationStatus=unregistered&limit=4")
      ]);
      
      const [preownedData, unregisteredData] = await Promise.all([
        preownedRes.json(),
        unregisteredRes.json()
      ]);

      // Normalize image URLs
      const normalizeImages = (cars) => cars.map(car => ({
        ...car,
        images: car.images.filter(img => img !== null) // Remove null images
      }));

      setPreownedCars(normalizeImages(preownedData));
      setUnregisteredCars(normalizeImages(unregisteredData));
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Modified CarCardWrapper with image handling
  const CarCardWrapper = ({ car }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Slider {...sliderSettings} className="h-48">
        {car.images?.map((image, idx) => (
          image && (
            <div key={idx}>
              <img
                src={image}
                alt={`${car.model} ${idx + 1}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200?text=Car+Image";
                }}
              />
            </div>
          )
        ))}
      </Slider>
      <div className="p-4">
        <h3 className="text-lg font-bold">{car.model}</h3>
        <p className="text-gray-600">₹{(car.price * 100000).toLocaleString()}</p>
        <button 
          onClick={() => navigate(`/product/${car._id}`)}
          className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-neutral-100 py-12 px-4 sm:px-8 lg:px-16">
      {/* Preowned Cars Section */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Preowned Cars
          </h2>
          <button
            onClick={() => navigate("/productList")}
            className="text-red-600 font-semibold hover:underline"
          >
            View All →
          </button>
        </div>

        {preownedCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {preownedCars.map((car) => (
              <CarCardWrapper key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No preowned cars available
          </p>
        )}
      </div>

      {/* Unregistered Cars Section */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Unregistered Cars
          </h2>
          <button
            onClick={() => navigate("/productList")}
            className="text-red-600 font-semibold hover:underline"
          >
            View All →
          </button>
        </div>

        {unregisteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {unregisteredCars.map((car) => (
              <CarCardWrapper key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No unregistered cars available
          </p>
        )}
      </div>
    </div>
  );
};

export default WhichCar;