import React from "react";

function ContactUsAddress() {
  return (
    <div className="max-w-screen-2xl mx-auto min-h-[80vh] flex flex-col lg:flex-row justify-around items-center p-4 lg:p-20">
      {/* Left Section */}
      <div className="w-full lg:w-[40%] p-4 lg:p-20 flex flex-col gap-5">
        <h1 className="text-black text-2xl sm:text-3xl lg:text-4xl font-extrabold">
          If Need Any Info Please <br /> Contact Us!
        </h1>
        <p className="text-black text-base sm:text-lg lg:text-xl">
          Completely synergize aid taxing relationships thru most excellent area
          of interest markets. Professionally domesticate one-to-one consumer
          service. Were usually right here that will help you on your car. We in
          reality respect you taking the time to get in touch.
        </p>
        <div className="flex items-center gap-5">
          <a href="/">
            <i className="ri-instagram-line text-white font-bold p-2 bg-red-500 text-2xl rounded-full hover:text-red-500 hover:bg-white transition-all duration-200 ease-in-out"></i>
          </a>
          <a href="/">
            <i className="ri-facebook-line text-white p-2 font-bold text-2xl rounded-full bg-red-500 hover:text-red-500 hover:bg-white transition-all duration-200 ease-in-out"></i>
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[40%] grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Address Card */}
        <div className="w-full h-48 sm:h-60 border border-gray-400 flex flex-col justify-center items-center p-4">
          <i className="ri-map-2-line text-4xl sm:text-5xl p-3 rounded-full bg-red-500 text-white"></i>
          <h1 className="font-bold text-lg sm:text-xl mt-2">Address</h1>
          <p className="text-sm sm:text-base font-semibold text-center">
          Bhavani Nagar, Moosapet, Kukatpally,<br></br>
           Hyderabad, Telangana 500072
          </p>
        </div>

        {/* Phone Card */}
        <div className="w-full h-48 sm:h-60 border border-gray-400 flex flex-col justify-center items-center p-4">
          <i className="ri-smartphone-line text-4xl sm:text-5xl p-3 rounded-full bg-red-500 text-white"></i>
          <h1 className="font-bold text-lg sm:text-xl mt-2">Phone</h1>
          <p className="text-sm sm:text-base font-semibold text-center">
          +91-8121021135<br />
          </p>
        </div>

        {/* Email Card */}
        <div className="w-full h-48 sm:h-60 border border-gray-400 flex flex-col justify-center items-center p-4">
          <i className="ri-mail-send-fill text-4xl sm:text-5xl p-3 rounded-full bg-red-500 text-white"></i>
          <h1 className="font-bold text-lg sm:text-xl mt-2">Email</h1>
          <p className="text-sm sm:text-base font-semibold text-center">
          sarthak@mghyderabad.com<br />
          kiran@mghyderabad.com
          </p>
        </div>

        {/* Opening Hours Card */}
        <div className="w-full h-48 sm:h-60 border border-gray-400 flex flex-col justify-center items-center p-4">
          <i className="ri-time-line text-4xl sm:text-5xl p-3 rounded-full bg-red-500 text-white"></i>
          <h1 className="font-bold text-lg sm:text-xl mt-2">Opening Hours</h1>
          <p className="text-sm sm:text-base font-semibold text-center">
            Mon - Sun: 10 AM - 7 PM<br />
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactUsAddress;