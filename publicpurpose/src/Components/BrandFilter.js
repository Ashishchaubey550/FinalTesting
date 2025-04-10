import { Button, Skeleton } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Brand normalization mapping
const BRAND_NORMALIZATION = {
  // MG
  "morris garages": "MG",
  "mg motors": "MG",
  "mg": "MG",
  "MG": "MG",
  "Mg": "MG",
  
  // Maruti Suzuki
  "maruti": "Maruti Suzuki",
  "maruti suzuki": "Maruti Suzuki",
  "suzuki": "Maruti Suzuki",
  "Maruti Suzuki": "Maruti Suzuki",
  
  // Mercedes
  "mercedes": "Mercedes",
  "mercedes-benz": "Mercedes",
  "benz": "Mercedes",
  
  // Honda
  "honda": "Honda",
  "Honda": "Honda",
  
  // Ford
  "ford": "Ford",
  "Ford": "Ford",
  
  // BMW
  "bmw": "BMW",
  "BMW": "BMW",
  "Bmw": "BMW",
  "bayerische motoren werke": "BMW",
  
  // Renault
  "renault": "Renault",
  "Renault": "Renault",
  
  // Hyundai
  "hyundai": "Hyundai",
  "Hyundai": "Hyundai",
  
  // Volkswagen
  "volkswagen": "Volkswagen",
  "vw": "Volkswagen",
  "Volkawagen": "Volkswagen",
  
  // Kia
  "kia": "Kia",
  
  // Tata
  "tata": "Tata",
  "tata motors": "Tata",
  
  // Toyota
  "toyota": "Toyota",
  
  // Mahindra
  "mahindra": "Mahindra",
  "mahindra and mahindra": "Mahindra",
  "mahindra & mahindra": "Mahindra",
  
  // Nissan
  "nissan": "Nissan",
  
  // Chevrolet
  "chevrolet": "Chevrolet",
  "chevy": "Chevrolet"
};

// Brand logo images - updated with reliable URLs
const BRAND_IMAGES = {
  "Maruti Suzuki": "https://www.carlogos.org/logo/Maruti-Suzuki-logo-2560x1440.png",
  "Honda": "https://www.carlogos.org/logo/Honda-logo-2560x1440.png",
  "Ford": "https://www.carlogos.org/logo/Ford-logo-2017-2560x1440.png",
  "BMW": "https://www.carlogos.org/logo/BMW-logo-2020-blue-2560x1440.png",
  "Mercedes": "https://www.carlogos.org/logo/Mercedes-Benz-logo-2011-2560x1440.png",
  "Renault": "https://www.carlogos.org/logo/Renault-logo-2015-2560x1440.png",
  "MG": "https://www.carlogos.org/logo/MG-Motor-logo-2560x1440.png",
  "Hyundai": "https://www.carlogos.org/logo/Hyundai-logo-silver-2560x1440.png",
  "Volkswagen": "https://www.carlogos.org/logo/Volkswagen-logo-2019-2560x1440.png",
  "Chevrolet": "https://www.carlogos.org/logo/Chevrolet-logo-2013-2560x1440.png",
  "Kia": "https://www.carlogos.org/logo/Kia-logo-2560x1440.png",
  "Tata": "https://www.carlogos.org/logo/Tata-Motors-logo-2560x1440.png",
  "Nissan": "https://www.carlogos.org/logo/Nissan-logo-2020-2560x1440.png",
  "Toyota": "https://www.carlogos.org/logo/Toyota-logo-1989-2560x1440.png",
  "Mahindra": "https://www.carlogos.org/logo/Mahindra-logo-2560x1440.png"
};

const normalizeBrand = (brandName) => {
  if (!brandName) return '';
  
  const lowerBrand = brandName.toLowerCase().trim();
  
  // Check if we have a normalization mapping
  for (const [key, value] of Object.entries(BRAND_NORMALIZATION)) {
    if (lowerBrand === key.toLowerCase()) {
      return value;
    }
  }
  
  // Default case - capitalize first letters of each word
  return lowerBrand
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const BrandFilter = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://finaltesting-tnim.onrender.com/productlist");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data?.length > 0) {
        const brandCounts = data.reduce((acc, item) => {
          if (item.company) {
            const normalizedBrand = normalizeBrand(item.company);
            if (normalizedBrand) {
              acc[normalizedBrand] = (acc[normalizedBrand] || 0) + 1;
            }
          }
          return acc;
        }, {});
        
        // Sort by count (descending) and take top 12
        const sortedBrands = Object.entries(brandCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);
        
        setBrands(sortedBrands);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = (brand) => {
    navigate(`/brand/${encodeURIComponent(brand.toLowerCase())}`);
  };

  if (loading) {
    return (
      <div className="brand-filter flex flex-col gap-6 justify-center items-center min-h-[40vh] p-8">
        <Skeleton height={40} width={300} mb={20} />
        <div className="flex flex-wrap gap-6 justify-center w-full">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} height={112} width={144} radius="md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brand-filter flex flex-col gap-6 justify-center items-center min-h-[40vh] p-8">
        <p className="text-red-500">Error loading brands: {error}</p>
        <Button 
          onClick={fetchBrands}
          color="red"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="brand-filter flex flex-col gap-6 sm:gap-10 justify-center items-center min-h-[40vh] p-4 sm:p-8 lg:p-16">
      <h2 className="font-semibold text-2xl sm:text-3xl text-center">
        Explore Popular Brands
      </h2>

      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center w-full max-w-6xl">
        {brands.map(([brand, count], index) => {
          const logoUrl = BRAND_IMAGES[brand] || "https://via.placeholder.com/64?text=Car";
          return (
            <button
              key={index}
              onClick={() => handleBrandClick(brand)}
              className="w-28 sm:w-36 h-24 sm:h-28 p-3 sm:p-4 hover:bg-red-50 hover:scale-105 transition-all duration-300 ease-in-out flex flex-col justify-center items-center bg-white rounded-lg shadow-md border border-gray-100"
              aria-label={`View ${brand} cars`}
            >
              <img
                loading="lazy"
                src={logoUrl}
                alt={brand}
                className="w-12 sm:w-16 h-12 sm:h-16 object-contain sm:mb-0"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/64?text=Car";
                }}
              />
              <p className="text-sm sm:text-base font-semibold text-center line-clamp-1">
                {brand}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 text-center">
                {count}+ cars
              </p>
            </button>
          );
        })}
      </div>

      <Link to="/productlist" className="mt-4 sm:mt-6">
        <Button 
          className="text-white font-semibold text-lg sm:text-xl bg-[#e23b3d] px-6 sm:px-8 py-1.5 rounded-xl hover:bg-[#a3282a] transition-all duration-300 shadow-lg"
          size="md"
        >
          View All Brands
        </Button>
      </Link>
    </div>
  );
};

export default BrandFilter;