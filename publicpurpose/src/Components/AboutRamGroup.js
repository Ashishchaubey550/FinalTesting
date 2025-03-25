import React from "react";
import Contactusbg from "../images/ContactUsbg.JPG";

const AboutRamGroup = () => {
  return (
    <div className="min-h-[60vh] flex flex-col lg:flex-row justify-evenly p-8 lg:p-16">
      {/* Left side - Image */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-4 lg:px-14 gap-3">
        <div className="text-sm font-semibold text-gray-600">
          WE STAND FOR CUSTOMER SATISFACTION
        </div>
        <div className="text-3xl lg:text-5xl font-bold text-gray-800">
          About Value Drive
        </div>
        <div className="text-base lg:text-[1.1rem] font-medium text-gray-600">
        We are proud to be a sub-dealer of Ram Group since 2019, dedicated to delivering top-quality automotive solutions. With a commitment to excellence, we strive to provide the best products and services to our customers, ensuring satisfaction and reliability at every step.
        </div>
        <div className="text-base lg:text-[1.1rem] font-medium text-gray-600">
        Our team of 5000+ professionals at Value Drive is the backbone of our success. Their expertise, dedication, and customer-centric approach enable us to offer unparalleled support and seamless service. We take pride in being part of a brand that stands for trust and innovation.
        Whether it's Banjara or Value Drive I showroom, our commitment remains the same—providing an exceptional experience to our customers. Our showrooms are designed to offer a premium and hassle-free journey, ensuring that every customer finds the perfect solution tailored to their needs.
        </div>
      </div>


      {/* Right side - Text */}
      <div className="w-full lg:w-[55%] flex items-center justify-center mb-8 lg:mb-0">
        <img
          src={Contactusbg}
          alt="image"
          className="w-full h-auto lg:h-[95%] object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default AboutRamGroup;