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
  };

  const isMobile = windowWidth < 768;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="relative bg-white rounded-xl w-full max-w-4xl mx-4 overflow-hidden shadow-xl max-h-[80vh] flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 z-50 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all"
          style={{ width: "40px", height: "40px" }}
        >
          ✕
        </button>

        {/* Image Slider - Hidden on mobile */}
        {!isMobile && (
          <div className="flex-1 lg:max-w-[50%] p-0 h-full">
            <Slider {...sliderSettings} className="w-full h-full">
              {product.images
                ?.filter((img) => !!img)
                .map((image, idx) => {
                  const imageUrl = processImageUrl(image);
                  return (
                    imageUrl && (
                      <div key={idx} className="w-full h-full">
                        <img
                          loading="lazy"
                          className="w-full h-full object-cover"
                          src={imageUrl}
                          alt={`Product Image ${idx + 1}`}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/600x400?text=Image+Not+Available";
                          }}
                        />
                      </div>
                    )
                  );
                })}
            </Slider>
          </div>
        )}

        {/* Product Details */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center lg:text-left">
            {product.model || "Car Overview"}
          </h2>

          {/* Table-like layout */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <DetailBox label="Make Year" value={product.modelYear || "Feb 2016"} />
              <DetailBox label="Registration Year" value={product.registrationYear || "Aug 2016"} />
              <DetailBox label="Fuel Type" value={product.fuelType || "Petrol"} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <DetailBox label="Km driven" value={`${product.distanceCovered || "46"}K km`} />
              <DetailBox label="Transmission" value={product.transmissionType || "Manual (Regular) 💬"} />
              <DetailBox label="No. of Owner" value={product.owners || "1st Owner"} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <DetailBox label="Insurance Validity" value={product.insuranceValidity || "Aug 2025"} />
              <DetailBox label="Insurance Type" value={product.insuranceType || "Comprehensive"} />
              <DetailBox label="RTO" value={product.rto || "KA05"} />
            </div>

            <div className="pt-2">
              <DetailBox label="Car Location" value={product.location || "Whitefield Road, Bangalore"} fullWidth />
            </div>

            {!isMobile && (
              <button
                onClick={handleShare}
                className="mt-4 bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition-all w-full text-lg"
              >
                Share on WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// New DetailBox component for table-like layout
const DetailBox = ({ label, value, fullWidth = false }) => (
  <div className={`${fullWidth ? 'col-span-3' : ''} bg-gray-50 p-2 rounded`}>
    <span className="text-xs font-medium text-gray-500 block">{label}</span>
    <p className="text-sm font-semibold text-gray-800 mt-1">{value}</p>
  </div>
);

export default FullViewSlider;