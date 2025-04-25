import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "./CarCard";

const WhichCar = () => {
  const navigate = useNavigate();
  const [preownedCars, setPreownedCars] = useState([]);
  const [unregisteredCars, setUnregisteredCars] = useState([]);
  const [isLoadingPreowned, setIsLoadingPreowned] = useState(true);
  const [isLoadingUnregistered, setIsLoadingUnregistered] = useState(true);
  const [errorPreowned, setErrorPreowned] = useState(null);
  const [errorUnregistered, setErrorUnregistered] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    // Fetch preowned cars
    try {
      setIsLoadingPreowned(true);
      const preownedResponse = await fetch(
        "https://finaltesting-tnim.onrender.com/productlist?condition=preowned&registrationStatus=registered&limit=4"
      );
      const preownedData = await preownedResponse.json();
      setPreownedCars(processImageUrls(preownedData));
      setErrorPreowned(null);
    } catch (error) {
      console.error("Error fetching preowned cars:", error);
      setErrorPreowned("Failed to load preowned cars");
    } finally {
      setIsLoadingPreowned(false);
    }

    // Fetch unregistered cars
    try {
      setIsLoadingUnregistered(true);
      const unregisteredResponse = await fetch(
        "https://finaltesting-tnim.onrender.com/productlist?condition=new&registrationStatus=unregistered&limit=4"
      );
      const unregisteredData = await unregisteredResponse.json();
      setUnregisteredCars(processImageUrls(unregisteredData));
      setErrorUnregistered(null);
    } catch (error) {
      console.error("Error fetching unregistered cars:", error);
      setErrorUnregistered("Failed to load unregistered cars");
    } finally {
      setIsLoadingUnregistered(false);
    }
  };

  const processImageUrls = (cars) => {
    return cars.map(car => ({
      ...car,
      images: (car.images || [])
        .filter(img => !!img)
        .map(img => {
          if (img.startsWith('http')) return img.replace('http://', 'https://');
          if (img.startsWith('//')) return `https:${img}`;
          if (img.startsWith('res.cloudinary.com')) return `https://${img}`;
          return img;
        })
    }));
  };

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-neutral-100 py-12 px-4 sm:px-8 lg:px-16">
      {/* Preowned Cars Section */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 transition-all duration-300">
            Preowned Cars
          </h2>
          <button
            onClick={() => navigate("/productList?condition=preowned&registrationStatus=registered")}
            className="text-red-600 font-semibold hover:underline transition-opacity duration-200 hover:opacity-80"
          >
            View All →
          </button>
        </div>

        {isLoadingPreowned ? (
          <SkeletonLoader />
        ) : errorPreowned ? (
          <div className="text-center py-8 animate-fade-in">
            <p className="text-red-500 mb-4">{errorPreowned}</p>
            <button
              onClick={fetchCars}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        ) : preownedCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-500 ease-in-out">
            {preownedCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8 animate-fade-in">
            No preowned cars available
          </p>
        )}
      </div>

      {/* Unregistered Cars Section */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 transition-all duration-300">
            Unregistered Cars
          </h2>
          <button
            onClick={() => navigate("/productList?condition=new&registrationStatus=unregistered")}
            className="text-red-600 font-semibold hover:underline transition-opacity duration-200 hover:opacity-80"
          >
            View All →
          </button>
        </div>

        {isLoadingUnregistered ? (
          <SkeletonLoader />
        ) : errorUnregistered ? (
          <div className="text-center py-8 animate-fade-in">
            <p className="text-red-500 mb-4">{errorUnregistered}</p>
            <button
              onClick={fetchCars}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        ) : unregisteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-500 ease-in-out">
            {unregisteredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8 animate-fade-in">
            No unregistered cars available
          </p>
        )}
      </div>
    </div>
  );
};

export default WhichCar;