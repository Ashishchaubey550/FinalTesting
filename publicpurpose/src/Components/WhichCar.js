import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "./CarCard";

const WhichCar = () => {
  const navigate = useNavigate();
  const [preownedCars, setPreownedCars] = useState([]);
  const [unregisteredCars, setUnregisteredCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      // Fetch preowned cars
      const preownedResponse = await fetch(
        "https://finaltesting-tnim.onrender.com/productlist?condition=preowned&limit=4"
      );
      const preownedData = await preownedResponse.json();
      
      // Process images: Fix URL formatting
      const processedPreowned = preownedData.map(car => ({
        ...car,
        images: (car.images || [])
          .filter(img => !!img)
          .map(img => {
            // Handle different URL formats
            if (img.startsWith('http')) {
              return img.replace('http://', 'https://');
            }
            if (img.startsWith('//')) {
              return `https:${img}`;
            }
            if (img.startsWith('res.cloudinary.com')) {
              return `https://${img}`;
            }
            return img;
          })
      }));

      // Fetch unregistered cars
      const unregisteredResponse = await fetch(
        "https://finaltesting-tnim.onrender.com/productlist?registrationStatus=unregistered&limit=4"
      );
      const unregisteredData = await unregisteredResponse.json();

      const processedUnregistered = unregisteredData.map(car => ({
        ...car,
        images: (car.images || [])
          .filter(img => !!img)
          .map(img => {
            if (img.startsWith('http')) {
              return img.replace('http://', 'https://');
            }
            if (img.startsWith('//')) {
              return `https:${img}`;
            }
            if (img.startsWith('res.cloudinary.com')) {
              return `https://${img}`;
            }
            return img;
          })
      }));

      setPreownedCars(processedPreowned);
      setUnregisteredCars(processedUnregistered);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

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
              <CarCard key={car._id} car={car} />
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
              <CarCard key={car._id} car={car} />
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