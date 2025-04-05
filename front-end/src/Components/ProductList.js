import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://finaltesting-tnim.onrender.com/product"
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const result = await response.json();
      setProducts(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id) => {
    try {
      const response = await fetch(
        `https://finaltesting-tnim.onrender.com/product/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Delete failed");

      getProducts(); // Refresh list after deletion
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Debounced search with 300ms delay
  const searchHandle = (event) => {
    const key = event.target.value.trim();
    clearTimeout(searchTimeout);

    setSearchTimeout(
      setTimeout(async () => {
        try {
          if (!key) return getProducts();

          const response = await fetch(
            `https://finaltesting-tnim.onrender.com/search/${encodeURIComponent(
              key
            )}`
          );

          if (!response.ok) throw new Error("Search failed");

          const result = await response.json();
          setProducts(Array.isArray(result) ? result : []);
        } catch (error) {
          console.error("Search error:", error);
        }
      }, 300)
    );
  };

  // Slider configuration
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Search Input */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search cars by model, brand, or features..."
          onChange={searchHandle}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image Slider */}
              <div className="relative aspect-w-16 aspect-h-9">
                {/* In your image slider */}
                {item.images?.filter((url) => url).length > 0 ? (
                  <Slider {...sliderSettings}>
                    {item.images
                      .filter((url) => url)
                      .map((image, idx) => (
                        <div key={idx}>
                          <img
                            src={image}
                            alt={`${item.model} ${idx + 1}`}
                            className="w-full h-64 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/fallback-image.jpg";
                            }}
                          />
                        </div>
                      ))}
                  </Slider>
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <span>No valid images</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {item.model}
                </h2>

                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-semibold">Brand:</span>
                    <span className="text-gray-800">{item.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Price:</span>
                    <span className="text-blue-600 font-medium">
                      ₹{(item.price || 0).toLocaleString("en-IN")} Lakhs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Year:</span>
                    <span>{item.modelYear || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Color:</span>
                    <span>{item.color || "N/A"}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => deleteCar(item._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/update/${item._id}`}
                    className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Update
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No cars found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductList;
