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
      // Fetch and process preowned cars
      const preownedResponse = await fetch(
        "https://finaltesting-tnim.onrender.com/productlist?condition=preowned&limit=4"
      );
      const preownedData = await preownedResponse.json();
      
      const processedPreowned = preownedData.map(car => ({
        ...car,
        images: (car.images || [])
          .filter(img => !!img)
          .map(img => {
            // Normalize Cloudinary URLs
            let url = img;
            if (url.includes('res.cloudinary.com')) {
              // Extract path after cloudinary domain
              const path = url.split('res.cloudinary.com').pop();
              url = `https://res.cloudinary.com${path}`;
            }
            // Force HTTPS and fix protocol issues
            return url
              .replace('http://', 'https://')
              .replace('https:/https://', 'https://')
              .replace('//res.cloudinary.com', 'https://res.cloudinary.com');
          })
      }));

      // Fetch and process unregistered cars
      const unregisteredResponse = await fetch(
        "https://finaltesting-tnim.onrender.com/productlist?registrationStatus=unregistered&limit=4"
      );
      const unregisteredData = await unregisteredResponse.json();

      const processedUnregistered = unregisteredData.map(car => ({
        ...car,
        images: (car.images || [])
          .filter(img => !!img)
          .map(img => {
            let url = img;
            if (url.includes('res.cloudinary.com')) {
              const path = url.split('res.cloudinary.com').pop();
              url = `https://res.cloudinary.com${path}`;
            }
            return url
              .replace('http://', 'https://')
              .replace('https:/https://', 'https://')
              .replace('//res.cloudinary.com', 'https://res.cloudinary.com');
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