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
    adaptiveHeight: true,
    arrows: false,
  };

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search cars..."
        onChange={searchHandle}
        className="w-full mb-8 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-56 overflow-hidden">
                {item.images?.length ? (
                  <Slider {...sliderSettings}>
                    {item.images.map((image, idx) => (
                      <div key={idx}>
                        <img
                          src={image}
                          alt={`${item.model} ${idx + 1}`}
                          className="w-full h-56 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-car.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No images available</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{item.model}</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex justify-between">
                    <span className="font-semibold">Company:</span>
                    {item.company}
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold">Price:</span>
                    ₹{item.price} Lakhs
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold">Year:</span>
                    {item.modelYear}
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold">Color:</span>
                    {item.color}
                  </p>
                </div>

                <div className="mt-4 flex justify-between gap-2">
                  <button
                    onClick={() => deleteCar(item._id)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/update/${item._id}`}
                    className="flex-1 text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
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
      <div>
        placeholder
      </div>
    </div>
    
  );
}

export default ProductList;