import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LOGO from "../images/logowithoutbg.png";
import { Button } from "@mantine/core";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLink = [
    { name: "Home", path: "/" },
    { name: "Product List", path: "/productList" },
    { name: "About Us", path: "/AboutUs" },
    { name: "Contact Us", path: "/ContactUs" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 2);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

  return (
    <div
      className={`w-full transition-all duration-300 fixed z-10
        ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}
        px-4 md:px-10 py-2 flex justify-between items-center h-[80px] md:h-auto`}
    >
      {/* Logo */}
      <img
        src={LOGO}
        alt="Brand Logo"
        className="w-32 h-12 md:w-80 md:h-28 bg-white block"
      />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`md:hidden z-50 absolute right-4 top-6 text-2xl
          ${isScrolled ? "text-gray-800 bg-white/20" : "text-white bg-black/20"}
          p-2 rounded-lg backdrop-blur-sm transition-all`}
      >
        {isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path d="M3 4H21V6H3V4ZM9 11H21V13H9V11ZM3 18H21V20H3V18Z" />
          </svg>
        )}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        {navLink.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`font-semibold hover:text-red-500 transition-colors
              ${isScrolled ? "text-gray-800" : "text-white"}`}
          >
            {item.name}
          </Link>
        ))}
        <Button
          component="a"
          href="https://wa.me/7987200339?text=Hello,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20test%20drive%20for%20your%20vehicle.%20Could%20you%20please%20provide%20me%20with%20more%20details?"
          target="_blank"
          className="bg-red-500 hover:bg-black text-white font-semibold"
        >
          Book A Test Drive
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-40 flex flex-col items-center justify-center">
          <div className="space-y-8 text-center">
            {navLink.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="block text-2xl text-white hover:text-red-500 font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button
              component="a"
              href="https://wa.me/7987200339?text=Hello,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20test%20drive"
              target="_blank"
              className="bg-red-500 hover:bg-black text-white font-semibold w-full text-lg py-4"
              fullWidth
            >
              Book A Test Drive
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;