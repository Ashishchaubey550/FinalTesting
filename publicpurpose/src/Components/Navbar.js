import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LOGO from '../images/LOgo.png';
import { Button } from "@mantine/core";
import reasure from "../images/mgreasure.webp"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLink = [
    { name: "Home", path: "/" },
    { name: "Product List", path: "/productList" },
    { name: "About Us", path: "/AboutUs" },
    { name: "Contact Us", path: "/ContactUs" },
  ];

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 2);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu scroll lock
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => document.body.style.overflow = "auto";
  }, [isMenuOpen]);

  return (
    <div className={`w-full transition-all duration-300 ease-in justify-between px-10 py-2 z-10 fixed flex items-center ${isScrolled ? "bg-white shadow-md" : "bg-transparent text-white"}`}>
      
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <img src={LOGO} alt="Value Drive Logo" className="w-20 h-20 bg-white" />
      </div>

      {/* MG Reassure Logo */}
      <img src={reasure} alt="MG Reassure" className="w-56 h-28 bg-white hidden md:block" />

      {/* Mobile Menu Button */}
      <div className="md:hidden ml-auto">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`focus:outline-none ${isScrolled ? "text-red-500" : "text-white"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M3 4H21V6H3V4ZM9 11H21V13H9V11ZM3 18H21V20H3V18Z" />
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center gap-8">
        {navLink.map((elem, index) => (
          <Link
            key={index}
            to={elem.path}
            className={`font-semibold hover:text-red-500 text-lg ${isScrolled ? "text-gray-800" : "text-white"}`}
          >
            {elem.name}
          </Link>
        ))}
        <Button className="bg-red-500 hover:bg-black text-white font-semibold px-6 py-3">
          Book A Test Drive
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            {navLink.map((elem, index) => (
              <Link
                key={index}
                to={elem.path}
                className="text-2xl text-white hover:text-red-500 font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                {elem.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;