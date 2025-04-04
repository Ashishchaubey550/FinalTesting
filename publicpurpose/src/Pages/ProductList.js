import React, { useEffect, useState, useMemo, useCallback } from "react";
import Slider from "react-slick";
import FullViewSlider from "../Components/FullViewSlider";
import Modal from "react-modal";
import "../CSS/ProductList.css";
import contactbg from "../images/ContactUs.webp";
import PriceFilter from "../Components/PriceFilter";

Modal.setAppElement("#root");

// Helper function to normalize strings for consistent filtering
const normalizeString = (str) => {
  if (!str) return "";
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Specific normalization for brand names
const normalizeBrand = (brand) => {
  const normalized = normalizeString(brand);
  if (normalized === "lamborgini") return "lamborghini";
  if (normalized === "morris garages") return "mg";
  return normalized;
};

// Normalize color names
const normalizeColor = (color) => {
  const normalized = normalizeString(color);
  // Handle common color variations
  if (normalized.includes("aurora silver")) return "silver";
  if (normalized.includes("starry black")) return "black";
  return normalized;
};

// Normalize body types
const normalizeBodyType = (bodyType) => {
  const normalized = normalizeString(bodyType);
  // Standardize body type names
  if (normalized.includes("suv")) return "suv";
  if (normalized.includes("sedan")) return "sedan";
  if (normalized.includes("hatchback")) return "hatchback";
  return normalized;
};

// Normalize fuel types
const normalizeFuelType = (fuelType) => {
  const normalized = normalizeString(fuelType);
  if (normalized.includes("petrol")) return "petrol";
  if (normalized.includes("diesel")) return "diesel";
  if (normalized.includes("electric")) return "electric";
  return normalized;
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Default price range in rupees: 50,000 to 7,000,000
  const defaultPriceRange = [50000, 7000000];
  const [priceRange, setPriceRange] = useState(defaultPriceRange);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [selectedModelYears, setSelectedModelYears] = useState([]);
  const [selectedDistances, setSelectedDistances] = useState([]);
  const [showPreowned, setShowPreowned] = useState(false);
  const [showUnregistered, setShowUnregistered] = useState(false);

  // Slider settings
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch products
  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      let result = await fetch("https://finaltesting-tnim.onrender.com/product");
      result = await result.json();
      if (result && result.length > 0) {
        const normalizedProducts = result.map((p) => ({
          ...p,
          company: normalizeBrand(p.company),
          color: normalizeColor(p.color),
          bodyType: normalizeBodyType(p.bodyType),
          fuelType: normalizeFuelType(p.fuelType),
          // Ensure numeric values
          distanceCovered: Number(p.distanceCovered) || 0,
          modelYear: Number(p.modelYear) || 0,
          price: Number(p.price) || 0
        }));
        setProducts(normalizedProducts);
        setFilteredProducts(normalizedProducts);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  // Filter products
  const filterProducts = useCallback(
    (
      priceRange,
      brands,
      colors,
      bodyTypes,
      fuelTypes,
      modelYears,
      distances,
      preowned,
      unregistered,
      dataset = products
    ) => {
      const filtered = dataset.filter((p) => {
        const priceInRupees = p.price * 100000; // Convert lakhs to rupees
        const isPreowned = p.condition === "preowned";
        const isUnregistered = p.registrationStatus === "unregistered";

        return (
          priceInRupees >= priceRange[0] &&
          priceInRupees <= priceRange[1] &&
          (brands.length === 0 || brands.includes(p.company)) &&
          (colors.length === 0 || colors.includes(p.color)) &&
          (bodyTypes.length === 0 || bodyTypes.includes(p.bodyType)) &&
          (fuelTypes.length === 0 || fuelTypes.includes(p.fuelType)) &&
          (modelYears.length === 0 || modelYears.includes(p.modelYear)) &&
          (distances.length === 0 || distances.includes(p.distanceCovered)) &&
          (!preowned || isPreowned) &&
          (!unregistered || isUnregistered)
        );
      });
      setFilteredProducts(filtered.length ? filtered : []);
    },
    [products]
  );

  // Handle price change
  const handlePriceChange = useCallback(
    (range) => {
      setPriceRange(range);
      filterProducts(
        range,
        selectedBrands,
        selectedColors,
        selectedBodyTypes,
        selectedFuelTypes,
        selectedModelYears,
        selectedDistances,
        showPreowned,
        showUnregistered
      );
    },
    [
      selectedBrands,
      selectedColors,
      selectedBodyTypes,
      selectedFuelTypes,
      selectedModelYears,
      selectedDistances,
      showPreowned,
      showUnregistered,
      filterProducts,
    ]
  );

  // Handle brand change
  const handleBrandChange = useCallback(
    (event) => {
      const selectedBrand = normalizeBrand(event.target.value);
      const newSelectedBrands = selectedBrands.includes(selectedBrand)
        ? selectedBrands.filter((brand) => brand !== selectedBrand)
        : [...selectedBrands, selectedBrand];
      setSelectedBrands(newSelectedBrands);
      filterProducts(
        priceRange,
        newSelectedBrands,
        selectedColors,
        selectedBodyTypes,
        selectedFuelTypes,
        selectedModelYears,
        selectedDistances,
        showPreowned,
        showUnregistered
      );
    },
    [
      priceRange,
      selectedBrands,
      selectedColors,
      selectedBodyTypes,
      selectedFuelTypes,
      selectedModelYears,
      selectedDistances,
      showPreowned,
      showUnregistered,
      filterProducts,
    ]
  );

  // Handle color change
  const handleColorChange = useCallback(
    (event) => {
      const selectedColor = normalizeColor(event.target.value);
      const newSelectedColors = selectedColors.includes(selectedColor)
        ? selectedColors.filter((color) => color !== selectedColor)
        : [...selectedColors, selectedColor];
      setSelectedColors(newSelectedColors);
      filterProducts(
        priceRange,
        selectedBrands,
        newSelectedColors,
        selectedBodyTypes,
        selectedFuelTypes,
        selectedModelYears,
        selectedDistances,
        showPreowned,
        showUnregistered
      );
    },
    [
      priceRange,
      selectedBrands,
      selectedColors,
      selectedBodyTypes,
      selectedFuelTypes,
      selectedModelYears,
      selectedDistances,
      showPreowned,
      showUnregistered,
      filterProducts,
    ]
  );

  // Handle body type change
  const handleBodyTypeChange = useCallback(
    (event) => {
      const selectedBodyType = normalizeBodyType(event.target.value);
      const newSelectedBodyTypes = selectedBodyTypes.includes(selectedBodyType)
        ? selectedBodyTypes.filter((bodyType) => bodyType !== selectedBodyType)
        : [...selectedBodyTypes, selectedBodyType];
      setSelectedBodyTypes(newSelectedBodyTypes);
      filterProducts(
        priceRange,
        selectedBrands,
        selectedColors,
        newSelectedBodyTypes,
        selectedFuelTypes,
        selectedModelYears,
        selectedDistances,
        showPreowned,
        showUnregistered
      );
    },
    [
      priceRange,
      selectedBrands,
      selectedColors,
      selectedBodyTypes,
      selectedFuelTypes,
      selectedModelYears,
      selectedDistances,
      showPreowned,
      showUnregistered,
      filterProducts,
    ]
  );

  // Handle fuel type change
  const handleFuelTypeChange = useCallback(
    (event) => {
      const selectedFuelType = normalizeFuelType(event.target.value);
      const newSelectedFuelTypes = selectedFuelTypes.includes(selectedFuelType)
        ? selectedFuelTypes.filter((fuelType) => fuelType !== selectedFuelType)
        : [...selectedFuelTypes, selectedFuelType];
      setSelectedFuelTypes(newSelectedFuelTypes);
      filterProducts(
        priceRange,
        selectedBrands,
        selectedColors,
        selectedBodyTypes,
        newSelectedFuelTypes,
        selectedModelYears,
        selectedDistances,
        showPreowned,
        showUnregistered
      );
    },
    [
      priceRange,
      selectedBrands,
      selectedColors,
      selectedBodyTypes,
      selectedFuelTypes,
      selectedModelYears,
      selectedDistances,
      showPreowned,
      showUnregistered,
      filterProducts,
    ]
  );

  // Handle model year change
  const handleModelYearChange = useCallback(
    (event) => {
      const year = Number(event.target.value);
      const newSelectedModelYears = selectedModelYears.includes(year)
        ? selectedModelYears.filter((y) => y !== year)
        : [...selectedModelYears, year];
      setSelectedModelYears(newSelectedModelYears);
      filterProducts(
        priceRange,
        selectedBrands,
        selectedColors,
        selectedBodyTypes,
        selectedFuelTypes,
        newSelectedModelYears,
        selectedDistances,
        showPreowned,
        showUnregistered
      );
    },
    [
      priceRange,
      selectedBrands,
      selectedColors,
      selectedBodyTypes,
      selectedFuelTypes,
      selectedModelYears,
      selectedDistances,
      showPreowned,
      showUnregistered,
      filterProducts,
    ]
  );

  // Handle distance change
  const handleDistanceChange = useCallback(
    (event) => {
      const dist = Number(event.target.value);
      const newSelectedDistances = selectedDistances.includes(dist)
        ? selectedDistances.filter((d) => d !== dist)
        : [...selectedDistances, dist];
      setSelectedDistances(newSelectedDistances);
      filterProducts(
        priceRange,
        selectedBrands,
        selectedColors,
        selectedBodyTypes,
        selectedFuelTypes,
        selectedModelYears,
        newSelectedDistances,
        showPreowned,
        showUnregistered
      );
    },
    [
      priceRange,
      selectedBrands,
      selectedColors,
      selectedBodyTypes,
      selectedFuelTypes,
      selectedModelYears,
      selectedDistances,
      showPreowned,
      showUnregistered,
      filterProducts,
    ]
  );

  // Handle preowned toggle
  const handlePreownedToggle = useCallback(() => {
    const newValue = !showPreowned;
    setShowPreowned(newValue);
    filterProducts(
      priceRange,
      selectedBrands,
      selectedColors,
      selectedBodyTypes,
      selectedFuelTypes,
      selectedModelYears,
      selectedDistances,
      newValue,
      showUnregistered
    );
  }, [
    priceRange,
    selectedBrands,
    selectedColors,
    selectedBodyTypes,
    selectedFuelTypes,
    selectedModelYears,
    selectedDistances,
    showPreowned,
    showUnregistered,
    filterProducts,
  ]);

  // Handle unregistered toggle
  const handleUnregisteredToggle = useCallback(() => {
    const newValue = !showUnregistered;
    setShowUnregistered(newValue);
    filterProducts(
      priceRange,
      selectedBrands,
      selectedColors,
      selectedBodyTypes,
      selectedFuelTypes,
      selectedModelYears,
      selectedDistances,
      showPreowned,
      newValue
    );
  }, [
    priceRange,
    selectedBrands,
    selectedColors,
    selectedBodyTypes,
    selectedFuelTypes,
    selectedModelYears,
    selectedDistances,
    showPreowned,
    showUnregistered,
    filterProducts,
  ]);

  // Search handler
  const searchHandle = useCallback(
    async (event) => {
      const key = event.target.value;
      if (key) {
        try {
          let result = await fetch(`https://finaltesting-tnim.onrender.com/search/${key}`);
          result = await result.json();
          if (result) {
            const normalizedResult = result.map((p) => ({
              ...p,
              company: normalizeBrand(p.company),
              color: normalizeColor(p.color),
              bodyType: normalizeBodyType(p.bodyType),
              fuelType: normalizeFuelType(p.fuelType),
              distanceCovered: Number(p.distanceCovered) || 0,
              modelYear: Number(p.modelYear) || 0,
              price: Number(p.price) || 0
            }));
            filterProducts(
              priceRange,
              selectedBrands,
              selectedColors,
              selectedBodyTypes,
              selectedFuelTypes,
              selectedModelYears,
              selectedDistances,
              showPreowned,
              showUnregistered,
              normalizedResult
            );
          }
        } catch (error) {
          console.error("Error searching products:", error);
        }
      } else {
        filterProducts(
          priceRange,
          selectedBrands,
          selectedColors,
          selectedBodyTypes,
          selectedFuelTypes,
          selectedModelYears,
          selectedDistances,
          showPreowned,
          showUnregistered,
          products
        );
      }
    },
    [
      priceRange,
      selectedBrands,
      selectedColors,
      selectedBodyTypes,
      selectedFuelTypes,
      selectedModelYears,
      selectedDistances,
      showPreowned,
      showUnregistered,
      products,
      filterProducts,
    ]
  );

  // Open modal (only for desktop)
  const openModal = useCallback(
    (product) => {
      if (!isMobile) {
        setCurrentProduct(product);
        setIsModalOpen(true);
      }
    },
    [isMobile]
  );

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedBodyTypes([]);
    setSelectedFuelTypes([]);
    setSelectedModelYears([]);
    setSelectedDistances([]);
    setShowPreowned(false);
    setShowUnregistered(false);
    setPriceRange(defaultPriceRange);
    setFilteredProducts(products);
  }, [products]);

  // Compute unique filter options with normalized values
  const uniqueBrands = useMemo(
    () => [...new Set(products.map((p) => p.company))].filter(Boolean).sort(),
    [products]
  );
  
  const uniqueColors = useMemo(
    () => [...new Set(products.map((p) => p.color))].filter(Boolean).sort(),
    [products]
  );
  
  const uniqueBodyTypes = useMemo(
    () => [...new Set(products.map((p) => p.bodyType))].filter(Boolean).sort(),
    [products]
  );
  
  const uniqueFuelTypes = useMemo(
    () => [...new Set(products.map((p) => p.fuelType))].filter(Boolean).sort(),
    [products]
  );
  
  const uniqueModelYears = useMemo(
    () => [...new Set(products.map((p) => p.modelYear))]
      .filter(year => !isNaN(year) && year !== 0)
      .sort((a, b) => b - a), // Sort descending (newest first)
    [products]
  );
  
  const uniqueDistances = useMemo(
    () => {
      const distances = [...new Set(products.map((p) => p.distanceCovered))]
        .filter(dist => !isNaN(dist) && dist !== 0)
        .sort((a, b) => a - b);
      
      // Group distances into ranges for better filtering
      const distanceRanges = [
        { label: "0-10,000 km", min: 0, max: 10000 },
        { label: "10,001-30,000 km", min: 10001, max: 30000 },
        { label: "30,001-50,000 km", min: 30001, max: 50000 },
        { label: "50,001-80,000 km", min: 50001, max: 80000 },
        { label: "80,001+ km", min: 80001, max: Infinity }
      ];
      
      return distanceRanges.filter(range => 
        distances.some(dist => dist >= range.min && dist <= range.max)
      ).map(range => range.label);
    },
    [products]
  );

  // Display name formatting
  const formatDisplayName = (str) => {
    if (!str) return "";
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex flex-col">
      {/* Banner Section */}
      <div className="relative w-full">
        <img
          src={contactbg}
          alt="Contact Background"
          className="w-full h-[200px] sm:h-[450px] lg:h-[650px] object-cover blur-[3px]"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="border border-gray-300 w-48 sm:w-64 lg:w-96 mb-4"></span>
          <h1 className="text-center font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white">
            Product Page
          </h1>
          <span className="border border-gray-300 w-48 sm:w-64 lg:w-96 mt-4"></span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row mt-10">
        {/* Filters Section */}
        <div className="w-full lg:w-1/4 p-4 lg:p-10 bg-gray-50">
          <div className="mb-4">
            <button
              className="clear-filters-btn bg-red-500 text-sm text-white font-semibold px-2.5 py-3 rounded-lg hover:bg-black hover:text-white duration-300 transition-all ease-in-out w-full sm:w-auto"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>

          {/* Preowned and Unregistered filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              className={`filter-btn px-4 py-2 rounded-lg font-semibold ${
                showPreowned
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={handlePreownedToggle}
            >
              Preowned
            </button>
            <button
              className={`filter-btn px-4 py-2 rounded-lg font-semibold ${
                showUnregistered
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={handleUnregisteredToggle}
            >
              Unregistered
            </button>
          </div>

          <PriceFilter onPriceChange={handlePriceChange} />

          {/* Collapsible Filters for Mobile */}
          <div className="lg:hidden">
            <details className="mb-4">
              <summary className="font-bold text-xl cursor-pointer">Filters</summary>
              <div className="mt-2 space-y-4">
                {/* Brand Filter */}
                <div>
                  <h3 className="font-bold text-lg text-black">Brand</h3>
                  <div className="flex flex-col mt-2 gap-1">
                    {uniqueBrands.map((brand) => (
                      <label
                        key={brand}
                        title="Click to toggle filter"
                        className="flex items-center gap-2 text-black font-bold"
                      >
                        <input
                          type="checkbox"
                          value={brand}
                          checked={selectedBrands.includes(brand)}
                          onChange={handleBrandChange}
                          className="peer hidden"
                        />
                        <div
                          className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                          peer-checked:bg-red-300 peer-checked:border-red-500
                          peer-checked:before:content-['x'] peer-checked:before:text-xl"
                        ></div>
                        <span className="peer-checked:text-red-500">
                          {formatDisplayName(brand)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h3 className="font-bold text-lg text-black">Color</h3>
                  <div className="flex flex-col mt-2 gap-1">
                    {uniqueColors.map((color) => (
                      <label
                        key={color}
                        title="Click to toggle filter"
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          value={color}
                          checked={selectedColors.includes(color)}
                          onChange={handleColorChange}
                          className="peer hidden"
                        />
                        <div
                          className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                          peer-checked:bg-red-300 peer-checked:border-red-500
                          peer-checked:before:content-['x'] peer-checked:before:text-xl"
                        ></div>
                        {formatDisplayName(color)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Body Type Filter */}
                <div>
                  <h3 className="font-bold text-lg text-black">Body Type</h3>
                  <div className="flex flex-col mt-2 gap-1">
                    {uniqueBodyTypes.map((bodyType) => (
                      <label
                        key={bodyType}
                        title="Click to toggle filter"
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          value={bodyType}
                          checked={selectedBodyTypes.includes(bodyType)}
                          onChange={handleBodyTypeChange}
                          className="peer hidden"
                        />
                        <div
                          className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                          peer-checked:bg-red-300 peer-checked:border-red-500
                          peer-checked:before:content-['x'] peer-checked:before:text-xl"
                        ></div>
                        {formatDisplayName(bodyType)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <h3 className="font-bold text-lg text-black">Fuel Type</h3>
                  <div className="flex flex-col mt-2 gap-1">
                    {uniqueFuelTypes.map((fuelType) => (
                      <label
                        key={fuelType}
                        title="Click to toggle filter"
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          value={fuelType}
                          checked={selectedFuelTypes.includes(fuelType)}
                          onChange={handleFuelTypeChange}
                          className="peer hidden"
                        />
                        <div
                          className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                          peer-checked:bg-red-300 peer-checked:border-red-500
                          peer-checked:before:content-['x'] peer-checked:before:text-xl"
                        ></div>
                        {formatDisplayName(fuelType)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Model Year Filter */}
                <div>
                  <h3 className="font-bold text-lg text-black">Model Year</h3>
                  <div className="flex flex-col mt-2 gap-1">
                    {uniqueModelYears.map((year) => (
                      <label
                        key={year}
                        title="Click to toggle filter"
                        className="flex items-center gap-2 text-black font-bold"
                      >
                        <input
                          type="checkbox"
                          value={year}
                          checked={selectedModelYears.includes(year)}
                          onChange={handleModelYearChange}
                          className="peer hidden"
                        />
                        <div
                          className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                          peer-checked:bg-red-300 peer-checked:border-red-500
                          peer-checked:before:content-['x'] peer-checked:before:text-xl"
                        ></div>
                        <span className="peer-checked:text-red-500">{year}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Distance Covered Filter */}
                <div>
                  <h3 className="font-bold text-lg text-black">
                    Distance Covered
                  </h3>
                  <div className="flex flex-col mt-2 gap-1">
                    {uniqueDistances.map((dist) => (
                      <label
                        key={dist}
                        title="Click to toggle filter"
                        className="flex items-center gap-2 text-black font-bold"
                      >
                        <input
                          type="checkbox"
                          value={dist}
                          checked={selectedDistances.includes(dist)}
                          onChange={handleDistanceChange}
                          className="peer hidden"
                        />
                        <div
                          className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                          peer-checked:bg-red-300 peer-checked:border-red-500
                          peer-checked:before:content-['x'] peer-checked:before:text-xl"
                        ></div>
                        <span className="peer-checked:text-red-500">{dist}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block">
            {/* Brand Filter */}
            <div className="mt-4">
              <h3 className="font-bold text-xl sm:text-2xl text-black">Brand</h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueBrands.map((brand) => (
                  <label
                    key={brand}
                    title="Click to toggle filter"
                    className="flex items-center gap-2 text-black font-bold"
                  >
                    <input
                      type="checkbox"
                      value={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={handleBrandChange}
                      className="peer hidden"
                    />
                    <div
                      className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                      peer-checked:bg-red-300 peer-checked:border-red-500
                      peer-checked:before:content-['x'] peer-checked:before:text-xl"
                    ></div>
                    <span className="peer-checked:text-red-500">
                      {formatDisplayName(brand)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="mt-4">
              <h3 className="font-bold text-xl sm:text-2xl text-black">Color</h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueColors.map((color) => (
                  <label
                    key={color}
                    title="Click to toggle filter"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      value={color}
                      checked={selectedColors.includes(color)}
                      onChange={handleColorChange}
                      className="peer hidden"
                    />
                    <div
                      className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                      peer-checked:bg-red-300 peer-checked:border-red-500
                      peer-checked:before:content-['x'] peer-checked:before:text-xl"
                    ></div>
                    {formatDisplayName(color)}
                  </label>
                ))}
              </div>
            </div>

            {/* Body Type Filter */}
            <div className="mt-4">
              <h3 className="font-bold text-xl sm:text-2xl text-black">Body Type</h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueBodyTypes.map((bodyType) => (
                  <label
                    key={bodyType}
                    title="Click to toggle filter"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      value={bodyType}
                      checked={selectedBodyTypes.includes(bodyType)}
                      onChange={handleBodyTypeChange}
                      className="peer hidden"
                    />
                    <div
                      className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                      peer-checked:bg-red-300 peer-checked:border-red-500
                      peer-checked:before:content-['x'] peer-checked:before:text-xl"
                    ></div>
                    {formatDisplayName(bodyType)}
                  </label>
                ))}
              </div>
            </div>

            {/* Fuel Type Filter */}
            <div className="mt-4">
              <h3 className="font-bold text-xl sm:text-2xl text-black">Fuel Type</h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueFuelTypes.map((fuelType) => (
                  <label
                    key={fuelType}
                    title="Click to toggle filter"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      value={fuelType}
                      checked={selectedFuelTypes.includes(fuelType)}
                      onChange={handleFuelTypeChange}
                      className="peer hidden"
                    />
                    <div
                      className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                      peer-checked:bg-red-300 peer-checked:border-red-500
                      peer-checked:before:content-['x'] peer-checked:before:text-xl"
                    ></div>
                    {formatDisplayName(fuelType)}
                  </label>
                ))}
              </div>
            </div>

            {/* Model Year Filter */}
            <div className="mt-4">
              <h3 className="font-bold text-xl sm:text-2xl text-black">Model Year</h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueModelYears.map((year) => (
                  <label
                    key={year}
                    title="Click to toggle filter"
                    className="flex items-center gap-2 text-black font-bold"
                  >
                    <input
                      type="checkbox"
                      value={year}
                      checked={selectedModelYears.includes(year)}
                      onChange={handleModelYearChange}
                      className="peer hidden"
                    />
                    <div
                      className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                      peer-checked:bg-red-300 peer-checked:border-red-500
                      peer-checked:before:content-['x'] peer-checked:before:text-xl"
                    ></div>
                    <span className="peer-checked:text-red-500">{year}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Distance Covered Filter */}
            <div className="mt-4">
              <h3 className="font-bold text-xl sm:text-2xl text-black">
                Distance Covered
              </h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueDistances.map((dist) => (
                  <label
                    key={dist}
                    title="Click to toggle filter"
                    className="flex items-center gap-2 text-black font-bold"
                  >
                    <input
                      type="checkbox"
                      value={dist}
                      checked={selectedDistances.includes(dist)}
                      onChange={handleDistanceChange}
                      className="peer hidden"
                    />
                    <div
                      className="w-6 h-6 flex items-center justify-center border-2 border-red-500 rounded-sm
                      peer-checked:bg-red-300 peer-checked:border-red-500
                      peer-checked:before:content-['x'] peer-checked:before:text-xl"
                    ></div>
                    <span className="peer-checked:text-red-500">{dist}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product List Section */}
        <div className="w-full lg:w-3/4 p-4 lg:p-10">
          <input
            className="search-input w-full p-2 mb-4 border border-gray-300 rounded-lg"
            type="text"
            placeholder="Search Product"
            onChange={searchHandle}
          />
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((item) => (
                <div
                  key={item._id}
                  className="product-card p-4 border border-gray-200 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => openModal(item)}
                >
                  <Slider {...sliderSettings} className="product-slider">
                    {item.images &&
                      item.images.map((image, idx) => (
                        <div key={idx} className="slider-image-container">
                          <img
                            src={`https://finaltesting-tnim.onrender.com${image}`}
                            alt={`Product ${idx + 1}`}
                            className="product-image w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                  </Slider>
                  <h3 className="mt-4 text-xl font-bold">Model: {item.model}</h3>
                  <p className="text-gray-700">
                    Company: {formatDisplayName(item.company)}
                  </p>
                  <p className="text-gray-700">Color: {formatDisplayName(item.color)}</p>
                  <p className="text-gray-700">
                    Distance Covered: {item.distanceCovered.toLocaleString()} km
                  </p>
                  <p className="text-gray-700">
                    Model Year: {item.modelYear}
                  </p>
                  <p className="text-gray-700">Body Type: {formatDisplayName(item.bodyType)}</p>
                  <p className="text-gray-700">Fuel Type: {formatDisplayName(item.fuelType)}</p>
                  <p className="text-gray-700">Price: ₹{(item.price * 100000).toLocaleString()}</p>
                  <p className="text-gray-700">Variant: {item.variant}</p>
                  <p className="text-gray-700">
                    Registration Year: {item.registrationYear}
                  </p>
                  <p className="text-gray-700">
                    Transmission Type: {item.transmissionType}
                  </p>
                  <p className="text-gray-700">
                    Condition: {formatDisplayName(item.condition) || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    Registration Status: {formatDisplayName(item.registrationStatus) || "N/A"}
                  </p>

                  <div className="product-actions mt-4 flex flex-col sm:flex-row gap-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 sm:w-auto w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        const message =
                          `Hello! I'm interested in this car:\n\n` +
                          `- Model: ${item.model}\n` +
                          `- Company: ${formatDisplayName(item.company)}\n` +
                          `- Color: ${formatDisplayName(item.color)}\n` +
                          `- Distance Covered: ${item.distanceCovered.toLocaleString()} km\n` +
                          `- Model Year: ${item.modelYear}\n` +
                          `- Price: ₹${(item.price * 100000).toLocaleString()}\n` +
                          `- Variant: ${item.variant}\n` +
                          `- Registration Year: ${item.registrationYear}\n` +
                          `- Fuel Type: ${formatDisplayName(item.fuelType)}\n` +
                          `- Body Type: ${formatDisplayName(item.bodyType)}\n` +
                          `- Transmission Type: ${item.transmissionType}\n` +
                          `- Condition: ${formatDisplayName(item.condition) || "N/A"}\n` +
                          `- Registration Status: ${formatDisplayName(item.registrationStatus) || "N/A"}\n\n` +
                          `Can you provide more details?`;
                        window.open(
                          `https://wa.me/8121021135?text=${encodeURIComponent(
                            message
                          )}`,
                          "_blank"
                        );
                      }}
                    >
                      <i className="ri-whatsapp-line"></i> 
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 sm:w-auto w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://wa.me/8121021135?text=${encodeURIComponent(
                            "Hello! I'm interested in purchasing a car and would like to learn more about your available options. Could you assist me with the details?"
                          )}`,
                          "_blank"
                        );
                      }}
                    >
                      <i className="ri-phone-line"></i> 
                      <span className="hidden sm:inline">Call</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-96 flex justify-center items-center">
              <p className="text-gray-700">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Hidden on mobile */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={`full-view-modal mx-auto ${isMobile ? 'hidden' : ''}`}
        overlayClassName={isMobile ? 'hidden' : ''}
      >
        {currentProduct && !isMobile && (
          <FullViewSlider product={currentProduct} closeModal={closeModal} />
        )}
      </Modal>
    </div>
  );
}

export default ProductList;