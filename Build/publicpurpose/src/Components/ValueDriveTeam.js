import React from 'react';
import ceoImage from "../images/Team/AbhayDubey.png";
import cfoImage from "../images/Team/team2.jpeg";
import hrImage from "../images/Team/team3.jpeg";

const ValueDriveTeam = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Abhay Dubey',
      role: 'Business CEO',
      company: 'Raam Group',
      image: ceoImage
    },
    {
      id: 2,
      name: 'Sarthak',
      role: 'Business Head',
      company: 'Value Drive',
      image: cfoImage
    },
    {
      id: 3,
      name: 'Kiran',
      role: 'AGM of POC',
      company: 'Value Drive',
      image: hrImage
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-center items-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Value Driven Team
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div 
            key={member.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
          >
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <img 
                 loading="lazy"
                  src={member.image}
                  alt={`${member.name} - ${member.role}`}
                  className="w-40 h-40 rounded-full object-cover mb-6 border-4 border-blue-100 hover:border-blue-200 transition-colors duration-300"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 text-lg font-medium mb-1">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm font-medium">
                  {member.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValueDriveTeam;