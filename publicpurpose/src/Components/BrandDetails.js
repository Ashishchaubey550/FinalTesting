import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import contactbg from "../images/ContactUs.webp";
import { FaCar, FaGasPump, FaCalendarAlt, FaTachometerAlt, FaMoneyBillWave } from "react-icons/fa";
import { GiGearStickPattern, GiCarDoor } from "react-icons/gi";

const BrandDetails = () => {
  const { brandName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [brandName]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://finaltesting-tnim.onrender.com/productlist?company=${brandName}`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="brand-details min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full">
        <img
          loading="lazy"
          src={contactbg}
          alt="Car showcase background"
          className="w-full h-96 md:h-[500px] object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <h1 className="text-center font-bold text-3xl md:text-5xl text-white mb-4">
            {brandName} Vehicles
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl text-center px-4">
            Explore our premium selection of {brandName} automobiles
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-red-500 pb-2 inline-block">
          Available Models
        </h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Image Slider */}
                <div className="relative h-64">
                  {item.images?.filter(img => img).length > 0 ? (
                    <Slider {...sliderSettings}>
                      {item.images.filter(img => img).map((image, idx) => (
                        <div key={idx}>
                          <img
                           loading="lazy"
                            src={image}
                            alt={`${item.model} - ${idx + 1}`}
                            className="w-full h-64 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-car.jpg';
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <img 
                       loading="lazy"
                        src="/placeholder-car.jpg" 
                        alt="No images available"
                        className="h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{item.model}</h3>
                    <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {item.condition}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaCar className="text-gray-500 mr-2" />
                      <span className="font-medium">Company:</span>
                      <span className="ml-2">{item.company}</span>
                    </div>

                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-green-500 mr-2" />
                      <span className="font-medium">Price:</span>
                      <span className="ml-2 text-green-600 font-bold">₹{item.price} Lakhs</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-blue-500 mr-2" />
                        <span>{item.modelYear}</span>
                      </div>
                      <div className="flex items-center">
                        <FaTachometerAlt className="text-purple-500 mr-2" />
                        <span>{item.distanceCovered} km</span>
                      </div>
                      <div className="flex items-center">
                        <FaGasPump className="text-orange-500 mr-2" />
                        <span>{item.fuelType}</span>
                      </div>
                      <div className="flex items-center">
                        <GiGearStickPattern className="text-gray-600 mr-2" />
                        <span>{item.transmissionType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <FaCar className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No {brandName} vehicles available
            </h3>
            <p className="text-gray-500">
              Check back later or browse other brands
            </p>
            <h1>Hello22</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandDetails;