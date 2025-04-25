import React from "react";

function ContactLocation() {
  const locationDetails = [
    {
      iframeSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.824856476871!2d78.42617557584332!3d17.46809500047378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb917445711053%3A0x88def353aa1d9ee9!2sThe%20Value%20Drive!5e0!3m2!1sen!2sin!4v1740823240863!5m2!1sen!2sin",
      heading: "The Value Drive",
      describe: "Bhavani Nagar, Moosapet, Kukatpally, Hyderabad, Telangana 500072",
    },
    {
      iframeSrc:
        "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3806.7444879572836!2d78.43002697516579!3d17.42404558346945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDI1JzI2LjYiTiA3OMKwMjUnNTcuNCJF!5e0!3m2!1sen!2sus!4v1742022203803!5m2!1sen!2sus",
      heading: "MG Motor Raam4Wheeler Showroom",
      describe: "Road Number 2, opposite Hotel Park Hyatt, BNR Colony, Venkat Nagar, Banjara Hills, Hyderabad, Telangana",
    },
    {
      iframeSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.689568074882!2d78.42193487599141!3d17.47456610028622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9186a4be3683%3A0x71dfbddd8b41752f!2sMG%20Motor%20Raam4Wheeler%20Showroom!5e0!3m2!1sen!2sus!4v1742940848153!5m2!1sen!2sus",
      heading: "MG Motor Raam4Wheeler Showroom",
      describe: "Metro Pillar No: A872, Y Junction, Plot No. 2 & 4, Block B MM Plaza, Kukatpally, Hyderabad, Telangana 500048, India",
    },
    // Add more locations as needed
  ];

  return (
    <div className="min-h-[60vh] bg-neutral-300 mt-14">
      <div className="flex gap-1 flex-col justify-center items-center">
        <h1 className="font-bold text-3xl sm:text-4xl">Our Locations</h1>
        <div className="justify-center items-center flex">
          <div className="flex gap-2 justify-center items-center mb-16">
            <span className="border-2 border-red-500 w-12"></span>
            <span className="border-2 border-black w-5"></span>
            <span className="border-2 border-red-500 w-12"></span>
          </div>
        </div>
      </div>
      <div className="locationCard grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 p-8 ">
        {locationDetails.map((location, index) => (
          <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
            <iframe
              src={location.iframeSrc}
              width="100%"
              height={window.innerWidth < 768 ? "200" : "300"}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Location ${index + 1}`}
              aria-label={`Google Maps location for ${location.heading}`}
            ></iframe>
            <h2 className="text-2xl font-bold mt-4">{location.heading}</h2>
            <p className="text-lg text-gray-700 mt-2">{location.describe}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactLocation;