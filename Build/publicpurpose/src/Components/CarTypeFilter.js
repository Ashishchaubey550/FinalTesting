import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const carTypes = ["Hatchback", "Sedan", "SUV"];

const CarTypeFilter = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("Hatchback");
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars(selectedType);
  }, [selectedType]);

  const fetchCars = async (type) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`https://finaltesting-tnim.onrender.com/productlist`);
      const data = await response.json();

      const normalizedType = type.toLowerCase().replace(/\s+/g, "");
      const filteredCars = data
        .filter((car) => car.bodyType?.toLowerCase().replace(/\s+/g, "") === normalizedType)
        .slice(0, 4)
        .map(car => ({
          ...car,
          images: (car.images || [])
            .filter(img => !!img)
            .map(img => img.startsWith('http') ? img : `https://${img}`)
        }));

      setCars(filteredCars);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setError("Failed to load cars. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
  };

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full sm:w-[90%] lg:w-[80%] mt-3">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-neutral-100 p-4 rounded-lg shadow-md w-full h-[22rem] border">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-48 sm:h-52 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center mt-10 sm:mt-20 min-h-[60vh] bg-neutral-100 p-4 sm:p-8 lg:p-16">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center animate-fade-in">
        Explore by Body Type
      </h2>

      <div className="flex flex-wrap justify-center gap-2 bg-red-100 p-2 sm:p-3 rounded-xl mb-4 sm:mb-6 shadow-md transition-all duration-300">
        {carTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 sm:px-5 py-2 w-28 sm:w-32 h-16 sm:h-20 rounded-lg flex items-center justify-center gap-2 flex-col 
              transition-all duration-300 ease-in-out font-medium text-sm sm:text-base ${
                selectedType === type
                  ? "bg-red-400 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-black hover:bg-red-200 hover:scale-[1.02]"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {isLoading ? (
        <SkeletonLoader />
      ) : error ? (
        <div className="text-center py-8 animate-fade-in">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchCars(selectedType)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full sm:w-[90%] lg:w-[80%] mt-3">
          {cars.map((car) => (
            <Link to="/productList" key={car._id} className="group">
              <div className="bg-neutral-100 p-4 rounded-lg shadow-md w-full h-[22rem] border hover:scale-105 
                transition-all duration-300 ease-in-out hover:shadow-lg">
                <Slider {...sliderSettings}>
                  {car.images?.map((image, idx) => (
                    <div key={idx} className="slider-image-container">
                      <img
                        loading="lazy"
                        src={image}
                        alt={`Car ${idx + 1}`}
                        className="w-full h-48 sm:h-52 object-cover rounded-lg transition-opacity duration-500"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=Car+Image";
                        }}
                      />
                    </div>
                  ))}
                </Slider>

                <h3 className="font-semibold text-base sm:text-lg mt-4 sm:mt-6 text-gray-900 group-hover:text-red-500 
                  transition-all duration-300 ease-in">
                  {car.model}
                </h3>
                <p className="text-black font-bold text-lg sm:text-xl">
                  ₹{car.price} Lakh{" "}
                  <span className="text-gray-500 font-normal">onwards</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate(`/productList?bodyType=${selectedType.toLowerCase()}`)}
        className="text-white font-semibold text-lg sm:text-xl bg-[#e23b3d] px-6 sm:px-8 py-2 mt-4 sm:mt-5 rounded-xl 
        hover:bg-[#a3282a] mb-6 sm:mb-10 transition-all duration-300 shadow-lg hover:scale-105"
      >
        See More
      </button>
    </div>
  );
};

export default CarTypeFilter;