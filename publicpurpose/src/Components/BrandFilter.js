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
    "maruti": "MARUTI SUZUKI",
    "maruti suzuki": "MARUTI SUZUKI",
    "suzuki": "MARUTI SUZUKI",
    "Maruti Suzuki": "MARUTI SUZUKI",

    
    // Mercedes
    "mercedes": "MERCEDES",
    "mercedes-benz": "MERCEDES",
    "benz": "MERCEDES",
    
    // Honda
    "honda": "HONDA",
    "Honda": "HONDA",
    "HONDA": "HONDA",


    
    // Ford
    "ford": "FORD",
    "Ford": "FORD",
    "FORD": "FORD",


    
    // BMW
    "bmw": "BMW",
    "BMW": "BMW",
    "Bmw": "BMW",
    "bayerische motoren werke": "BMW",
    
    // Renault
    "renault": "RENAULT",
    "Renault": "RENAULT",
    "RENAULT": "RENAULT",


    
    // Hyundai
    "hyundai": "HYUNDAI",
    "Hyundai": "HYUNDAI",
    "hyundai": "HYUNDAI",


    
    // Volkswagen
    "volkswagen": "VOLKSWAGEN",
    "vw": "VOLKSWAGEN",
    "Volkawagen": "VOLKSWAGEN",
    "VOLKSWAGEN": "VOLKSWAGEN",


    
    // Kia
    "kia": "KIA",
    
    // Tata
    "tata": "TATA",
    "tata motors": "TATA",
    
    // Toyota
    "toyota": "TOYOTA",
    
    // Mahindra
    "mahindra": "MAHINDRA",
    "mahindra and mahindra": "MAHINDRA",
    "mahindra & mahindra": "MAHINDRA",
    
    // Nissan
    "nissan": "NISSAN",
    
    // Chevrolet
    "chevrolet": "CHEVROLET",
    "chevy": "CHEVROLET"
  };

  // Add other brand variations as needed

// Brand logo images
const BRAND_IMAGES = {
  "MARUTI SUZUKI": "https://mda.spinny.com/spinny-web/media/cars/makes/maruti-suzuki/logos/maruti-suzuki.webp",
  "HONDA": "https://mda.spinny.com/spinny-web/media/cars/makes/honda/logos/honda.webp",
  "FORD": "https://spn-sta.spinny.com/spinny-web/oth/raMicD2JTFa1JOLFZewdpg/raw/file.webp",
  "BMW": "https://mda.spinny.com/spinny-web/media/cars/makes/bmw/logos/v1.png",
  "MERCEDES": "https://mda.spinny.com/spinny-web/media/cars/makes/mercedes-benz/logos/v1.png",
  "RENAULT": "https://mda.spinny.com/spinny-web/media/cars/makes/renault/logos/renault.webp",
  "MG": "https://spinny-images.gumlet.io/images/cars/new/makes/mg-motors/logos/197x71.png?q=85&w=100&dpr=1.0",
  "HYUNDAI": "https://mda.spinny.com/spinny-web/media/cars/makes/hyundai/logos/hyundai.webp",
  "VOLKSWAGEN": "https://mda.spinny.com/spinny-web/media/cars/makes/volkswagen/logos/volkswagen.webp",
  "CHEVROLET": "https://www.carlogos.org/logo/Chevrolet-logo-2013-1920x1080.png",
  "KIA": "https://mda.spinny.com/spinny-web/media/cars/makes/kia/logos/v1.webp",
  "TATA": "https://mda.spinny.com/spinny-web/media/cars/makes/tata/logos/tata.webp",
  "NISSAN": "https://e7.pngegg.com/pngimages/132/969/png-clipart-nissan-car-logo-automotive-industry-brand-nissan-emblem-trademark.png",
  "TOYOTA": "https://www.carlogos.org/logo/Toyota-logo-1989-1920x1080.png",
  "MAHINDRA": "https://www.carlogos.org/logo/Mahindra-logo-2000x2500.png"
};

const normalizeBrand = (brandName) => {
  if (!brandName) return '';
  
  const lowerBrand = brandName.toLowerCase().trim();
  
  // Check if we have a normalization mapping
  for (const [key, value] of Object.entries(BRAND_NORMALIZATION)) {
    if (lowerBrand.includes(key)) {
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
          .slice(0, 12);
        
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
        {brands.map(([brand, count], index) => (
          <button
            key={index}
            onClick={() => handleBrandClick(brand)}
            className="w-28 sm:w-36 h-24 sm:h-28 p-3 sm:p-4 hover:bg-red-50 hover:scale-105 transition-all duration-300 ease-in-out flex flex-col justify-center items-center bg-white rounded-lg shadow-md border border-gray-100"
            aria-label={`View ${brand} cars`}
          >
            <img
             loading="lazy"
              src={BRAND_IMAGES[brand] || "https://via.placeholder.com/64?text=Car"}
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
        ))}
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