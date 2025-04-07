import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetch("https://finaltesting-tnim.onrender.com/product");
      const result = await response.json();
      setProducts(result?.length ? result : []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const deleteCar = async (id) => {
    try {
      await fetch(`https://finaltesting-tnim.onrender.com/product/${id}`, { method: "DELETE" });
      getProducts();
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const searchHandle = async (event) => {
    const key = event.target.value;
    if (key) {
      try {
        const response = await fetch(`https://finaltesting-tnim.onrender.com/search/${key}`);
        const result = await response.json();
        setProducts(result || []);
      } catch (error) {
        console.error("Error searching cars:", error);
      }
    } else {
      getProducts();
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: false // Changed for consistent card height
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search cars..."
          onChange={searchHandle}
          className="w-full p-3 sm:p-4 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div 
              key={item._id} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-shadow duration-300"
            >
              {/* Image Slider */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                {item.images?.length ? (
                  <Slider {...sliderSettings}>
                    {item.images.map((image, idx) => (
                      <div key={idx} className="h-48 sm:h-56">
                        <img
                          src={image}
                          alt={`${item.company} ${item.model} - Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="w-full h-48 sm:h-56 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No images available</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 sm:p-5">
                <h3 className="text-xl font-bold mb-2 truncate">{item.model}</h3>
                
                <div className="space-y-2 text-gray-600 text-sm sm:text-base">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Company:</span>
                    <span className="text-right">{item.company}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Price:</span>
                    <span className="text-right">₹{item.price} Lakhs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Year:</span>
                    <span className="text-right">{item.modelYear}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Color:</span>
                    <span className="text-right capitalize">{item.color}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => deleteCar(item._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/update/${item._id}`}
                    className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Update
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg py-8">No cars found</p>
      )}
    </div>
  );
}

export default ProductList;