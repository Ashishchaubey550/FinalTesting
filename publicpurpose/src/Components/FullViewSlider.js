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
      <div className="relative bg-white rounded-xl w-full max-w-6xl mx-4 overflow-hidden shadow-xl max-h-[70vh] flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 z-50 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all"
          style={{ width: "40px", height: "40px" }}
        >
          ✕
        </button>

        {/* Image Slider - Full container size without maintaining aspect ratio */}
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
                        className="w-full h-full object-fill"
                        src={imageUrl}
                        alt={`Product Image ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'fill' // This will stretch the image to fill container
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/600x400?text=Image+Not+Available";
                          e.target.className = "w-full h-full object-fill";
                        }}
                      />
                    </div>
                  )
                );
              })}
          </Slider>
        </div>

        {/* Product Details */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-4 border-t lg:border-t-0 lg:border-l border-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center lg:text-left hidden md:block">
            {product.model}
          </h2>

          <div
            className={`grid ${
              isMobile ? "grid-cols-1" : "grid-cols-2"
            } gap-3 md:gap-4`}
          >
            <DetailItem label="Car Number" value={product.car_number} />
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
            <button
              onClick={handleShare}
              className="mt-2 bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition-all w-full md:w-auto text-lg"
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
  <div className="space-y-1 p-3 bg-white rounded-lg">
    <span className="text-sm md:text-base font-medium text-black">
      {label}:
    </span>
    <p
      className={`text-base md:text-lg ${
        highlight ? "font-bold text-green-600" : "text-gray-500"
      }`}
    >
      {value}
    </p>
  </div>
);

export default FullViewSlider;