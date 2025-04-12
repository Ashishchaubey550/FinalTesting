import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "../CSS/PrevButoon.css";

function FullViewSlider({ product, closeModal }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Image URL normalization function
  const processImageUrl = (url) => {
    if (!url) return null;
    if (url.includes("res.cloudinary.com")) {
      const cloudinaryPath = url.split("res.cloudinary.com")[1];
      return `https://res.cloudinary.com${cloudinaryPath}`;
    }
    return url.replace("http://", "https://");
  };

  const handleShare = () => {
    const shareText =
      `Check out this ${product.model} from ${product.company}!\n\n` +
      `- Color: ${product.color}\n` +
      `- Distance Covered: ${product.distanceCovered} km\n` +
      `- Model Year: ${product.modelYear}\n` +
      `- Price: ₹${product.price} Lakhs\n` +
      `- Variant: ${product.variant}\n` +
      `- Registration Year: ${product.registrationYear}\n` +
      `- Fuel Type: ${product.fuelType}\n` +
      `- Body Type: ${product.bodyType}\n` +
      `- Car Number: ${product.car_number}\n` +
      `- Transmission Type: ${product.transmissionType}\n\n` +
      `Check it out here: ${window.location.href}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Calculate image container dimensions based on screen size
  const getImageContainerDimensions = () => {
    if (isMobile) {
      return {
        width: windowWidth * 0.9,
        height: windowWidth * 0.7, // More square aspect ratio for mobile
      };
    }
    if (isTablet) {
      return {
        width: 500,
        height: 400
      };
    }
    return {
      width: 600,
      height: 500
    };
  };

  const { width: containerWidth, height: containerHeight } = getImageContainerDimensions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="relative bg-white rounded-xl w-full max-w-6xl mx-4 shadow-xl flex flex-col lg:flex-row" 
           style={{ maxHeight: isMobile ? '90vh' : '80vh' }}>
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 z-50 bg-red-500 text-white rounded-full p-1 sm:p-2 hover:bg-red-600 transition-all"
          style={{ width: "32px", height: "32px" }}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Image Slider */}
        <div className="flex-1 lg:max-w-[50%] p-2 sm:p-4 md:p-6 flex justify-center items-center bg-white">
          <div 
            className="relative"
            style={{ 
              width: `${containerWidth}px`,
              height: `${containerHeight}px`,
              minWidth: isMobile ? 'auto' : `${containerWidth}px`
            }}
          >
            <Slider {...sliderSettings} className="w-full h-full">
              {product.images
                ?.filter((img) => !!img)
                .map((image, idx) => {
                  const imageUrl = processImageUrl(image);
                  return (
                    imageUrl && (
                      <div
                        key={idx}
                        className="w-full h-full flex justify-center items-center overflow-hidden bg-gray-100"
                      >
                        <img
                          loading="lazy"
                          className="object-contain w-full h-full p-1 sm:p-2 rounded-lg"
                          src={imageUrl}
                          alt={`${product.model} - Image ${idx + 1}`}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/600x500?text=Image+Not+Available";
                            e.target.className = "object-cover";
                          }}
                        />
                      </div>
                    )
                  );
                })}
            </Slider>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-200">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-center lg:text-left">
            {product.model}
          </h2>

          <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-2 sm:gap-3 md:gap-4`}>
            <DetailItem label="Registration Number" value={product.car_number} />
            <DetailItem label="Company" value={product.company} />
            <DetailItem label="Color" value={product.color} />
            <DetailItem
              label="Distance Covered"
              value={`${product.distanceCovered} km`}
            />
            <DetailItem label="Model Year" value={product.modelYear} />
            <DetailItem
              label="Price"
              value={`₹${product.price} Lakhs`}
              highlight
            />
            <DetailItem label="Variant" value={product.variant} />
            <DetailItem
              label="Registration Year"
              value={product.registrationYear}
            />
            <DetailItem label="Fuel Type" value={product.fuelType} />
            <DetailItem label="Body Type" value={product.bodyType} />
            <DetailItem label="Transmission" value={product.transmissionType} />
          </div>

          <div className="mt-4 sm:mt-6 flex justify-center lg:justify-start">
            <button
              onClick={handleShare}
              className="bg-green-500 text-white py-2 px-4 sm:px-6 rounded-full hover:bg-green-600 transition-all w-full sm:w-auto text-sm sm:text-base"
            >
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailItem = ({ label, value, highlight }) => (
  <div className="space-y-1 p-2 sm:p-3 bg-gray-50 rounded-lg">
    <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
      {label}:
    </span>
    <p
      className={`text-sm sm:text-base md:text-lg ${
        highlight ? "font-bold text-green-600" : "text-gray-800"
      }`}
    >
      {value || "N/A"}
    </p>
    <p>Hello</p>
  </div>
);

export default FullViewSlider;