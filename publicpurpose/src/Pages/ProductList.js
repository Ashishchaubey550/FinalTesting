import React, { useEffect, useState, useMemo, useCallback } from "react";
import Slider from "react-slick";
import FullViewSlider from "../Components/FullViewSlider";
import Modal from "react-modal";
import "../CSS/ProductList.css";
import contactbg from "../images/ContactUs.webp";
import PriceFilter from "../Components/PriceFilter";

Modal.setAppElement("#root");

// Enhanced Normalization Functions
const normalizeString = (str) => {
  if (!str) return "";
  return str.toLowerCase().trim().replace(/\s+/g, " ");
};

const normalizeBrand = (brand) => {
  const normalized = normalizeString(brand);
  const brandMappings = {
    lamborgini: "lamborghini",
    "morris garages": "mg",
    "mg motors": "mg",
    maruti: "maruti suzuki",
    "mercedes-benz": "mercedes",
    benz: "mercedes",
    toyota: "toyota",
    hyundai: "hyundai",
    honda: "honda",
    ford: "ford",
    volkswagen: "volkswagen",
    tata: "tata",
    kia: "kia",
    renault: "renault",
    nissan: "nissan",
    bmw: "bmw",
  };
  return brandMappings[normalized] || normalized;
};

const normalizeColor = (color) => {
  const normalized = normalizeString(color);
  const colorMappings = {
    "aurora silver": "silver",
    "starry black": "black",
    "metallic grey": "gray",
    "pearl white": "white",
    "glacier white": "white",
    "midnight black": "black",
    "phantom black": "black",
    "deep blue": "blue",
    "fiery red": "red",
  };
  return colorMappings[normalized] || normalized;
};

const normalizeBodyType = (bodyType) => {
  const normalized = normalizeString(bodyType);
  const bodyTypeMappings = {
    suv: "suv",
    sedan: "sedan",
    hatchback: "hatchback",
    muv: "muv",
    crossover: "crossover",
    convertible: "convertible",
    coupe: "coupe",
    pickup: "pickup",
    van: "van",
  };
  return bodyTypeMappings[normalized] || normalized;
};

const normalizeFuelType = (fuelType) => {
  const normalized = normalizeString(fuelType);
  const fuelTypeMappings = {
    petrol: "petrol",
    diesel: "diesel",
    electric: "electric",
    hybrid: "hybrid",
    cng: "cng",
    lpg: "lpg",
  };
  return fuelTypeMappings[normalized] || normalized;
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const [searchQuery, setSearchQuery] = useState("");

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
      setLoading(true);
      const response = await fetch(
        "https://finaltesting-tnim.onrender.com/product"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const result = await response.json();

      if (result?.length > 0) {
        const normalizedProducts = result.map((p) => ({
          ...p,
          company: normalizeBrand(p.company),
          color: normalizeColor(p.color),
          bodyType: normalizeBodyType(p.bodyType),
          fuelType: normalizeFuelType(p.fuelType),
          distanceCovered: Number(p.distanceCovered) || 0,
          modelYear: Number(p.modelYear) || 0,
          price: Number(p.price) || 0,
          condition: p.condition ? normalizeString(p.condition) : "",
          registrationStatus: p.registrationStatus
            ? normalizeString(p.registrationStatus)
            : "",
          searchText:
            `${p.model} ${p.company} ${p.color} ${p.bodyType} ${p.fuelType}`.toLowerCase(),
        }));

        setProducts(normalizedProducts);
        setFilteredProducts(normalizedProducts);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filter function
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
      search = "",
      dataset = products
    ) => {
      const filtered = dataset.filter((p) => {
        const priceInRupees = p.price * 100000;
        const isPreowned = p.condition === "preowned";
        const isUnregistered = p.registrationStatus === "unregistered";

        // Check if distance falls within selected ranges
        const distanceMatch =
          distances.length === 0 ||
          distances.some((range) => {
            if (range === "0-10,000 km") return p.distanceCovered <= 10000;
            if (range === "10,001-30,000 km")
              return p.distanceCovered > 10000 && p.distanceCovered <= 30000;
            if (range === "30,001-50,000 km")
              return p.distanceCovered > 30000 && p.distanceCovered <= 50000;
            if (range === "50,001-80,000 km")
              return p.distanceCovered > 50000 && p.distanceCovered <= 80000;
            if (range === "80,001+ km") return p.distanceCovered > 80000;
            return false;
          });

        // Search filter
        const searchMatch =
          !search || p.searchText.includes(search.toLowerCase());

        return (
          priceInRupees >= priceRange[0] &&
          priceInRupees <= priceRange[1] &&
          (brands.length === 0 || brands.some((b) => p.company.includes(b))) &&
          (colors.length === 0 || colors.some((c) => p.color.includes(c))) &&
          (bodyTypes.length === 0 ||
            bodyTypes.some((bt) => p.bodyType.includes(bt))) &&
          (fuelTypes.length === 0 ||
            fuelTypes.some((ft) => p.fuelType.includes(ft))) &&
          (modelYears.length === 0 || modelYears.includes(p.modelYear)) &&
          distanceMatch &&
          (!preowned || isPreowned) &&
          (!unregistered || isUnregistered) &&
          searchMatch
        );
      });

      setFilteredProducts(filtered.length ? filtered : []);
    },
    [products]
  );

  // Handler functions
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
        showUnregistered,
        searchQuery
      );
    },
    [
      filterProducts,
      selectedBrands,
      selectedColors,
      selectedBodyTypes,
      selectedFuelTypes,
      selectedModelYears,
      selectedDistances,
      showPreowned,
      showUnregistered,
      searchQuery,
    ]
  );

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
        showUnregistered,
        searchQuery
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
      searchQuery,
    ]
  );

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
        showUnregistered,
        searchQuery
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
      searchQuery,
    ]
  );

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
        showUnregistered,
        searchQuery
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
      searchQuery,
    ]
  );

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
        showUnregistered,
        searchQuery
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
      searchQuery,
    ]
  );

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
        showUnregistered,
        searchQuery
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
      searchQuery,
    ]
  );

  const handleDistanceChange = useCallback(
    (event) => {
      const dist = event.target.value;
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
        showUnregistered,
        searchQuery
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
      searchQuery,
    ]
  );

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
      showUnregistered,
      searchQuery
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
    searchQuery,
  ]);

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
      newValue,
      searchQuery
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
    searchQuery,
  ]);

  const handleSearch = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);
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
        query
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

  const openModal = useCallback(
    (product) => {
      if (!isMobile) {
        setCurrentProduct(product);
        setIsModalOpen(true);
      }
    },
    [isMobile]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  }, []);

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
    setSearchQuery("");
    setFilteredProducts(products);
  }, [products]);

  // Enhanced unique values calculation
  const uniqueBrands = useMemo(() => {
    const brands = [...new Set(products.map((p) => p.company))].filter(Boolean);
    return brands.sort((a, b) => a.localeCompare(b));
  }, [products]);

  const uniqueColors = useMemo(() => {
    const colors = [...new Set(products.map((p) => p.color))].filter(Boolean);
    return colors.sort((a, b) => a.localeCompare(b));
  }, [products]);

  const uniqueBodyTypes = useMemo(() => {
    const types = [...new Set(products.map((p) => p.bodyType))].filter(Boolean);
    return types.sort((a, b) => a.localeCompare(b));
  }, [products]);

  const uniqueFuelTypes = useMemo(() => {
    const types = [...new Set(products.map((p) => p.fuelType))].filter(Boolean);
    return types.sort((a, b) => a.localeCompare(b));
  }, [products]);

  const uniqueModelYears = useMemo(() => {
    const years = [...new Set(products.map((p) => p.modelYear))].filter(
      (year) => !isNaN(year) && year !== 0
    );
    return years.sort((a, b) => b - a); // Newest first
  }, [products]);

  const uniqueDistances = useMemo(() => {
    const distanceRanges = [
      "0-10,000 km",
      "10,001-30,000 km",
      "30,001-50,000 km",
      "50,001-80,000 km",
      "80,001+ km",
    ];
    return distanceRanges;
  }, []);

  const formatDisplayName = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-xl text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={getProducts}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

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

          <PriceFilter
            onPriceChange={handlePriceChange}
            defaultRange={defaultPriceRange}
            currentRange={priceRange}
          />

          {/* Collapsible Filters for Mobile */}
          <div className="lg:hidden">
            <details className="mb-4" open>
              <summary className="font-bold text-xl cursor-pointer">
                Filters
              </summary>
              <div className="mt-2 space-y-4">
                {/* Brand Filter */}
                <div>
                  <h3 className="font-bold text-lg text-black">Brand</h3>
                  <div className="flex flex-col mt-2 gap-1">
                    {uniqueBrands.map((brand) => (
                      <label
                        key={brand}
                        title={`Filter by ${brand}`}
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
                          peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
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
                        title={`Filter by ${color}`}
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
                          peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
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
                        title={`Filter by ${bodyType}`}
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
                          peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
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
                        title={`Filter by ${fuelType}`}
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
                          peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
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
                        title={`Filter by ${year}`}
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
                          peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
                        ></div>
                        <span className="peer-checked:text-red-500">
                          {year}
                        </span>
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
                        title={`Filter by ${dist}`}
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
                          peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
                        ></div>
                        <span className="peer-checked:text-red-500">
                          {dist}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block space-y-6">
            {/* Brand Filter */}
            <div>
              <h3 className="font-bold text-xl text-black">Brand</h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueBrands.map((brand) => (
                  <label
                    key={brand}
                    title={`Filter by ${brand}`}
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
                      peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
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
              <h3 className="font-bold text-xl text-black">Color</h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueColors.map((color) => (
                  <label
                    key={color}
                    title={`Filter by ${color}`}
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
                      peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
                    ></div>
                    {formatDisplayName(color)}
                  </label>
                ))}
              </div>
            </div>

            {/* Body Type Filter */}
            <div>
              <h3 className="font-bold text-xl text-black">Body Type</h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueBodyTypes.map((bodyType) => (
                  <label
                    key={bodyType}
                    title={`Filter by ${bodyType}`}
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
                      peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
                    ></div>
                    {formatDisplayName(bodyType)}
                  </label>
                ))}
              </div>
            </div>

            {/* Fuel Type Filter */}
            <div>
              <h3 className="font-bold text-xl text-black">Fuel Type</h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueFuelTypes.map((fuelType) => (
                  <label
                    key={fuelType}
                    title={`Filter by ${fuelType}`}
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
                      peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
                    ></div>
                    {formatDisplayName(fuelType)}
                  </label>
                ))}
              </div>
            </div>

            {/* Model Year Filter */}
            <div>
              <h3 className="font-bold text-xl text-black">Model Year</h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueModelYears.map((year) => (
                  <label
                    key={year}
                    title={`Filter by ${year}`}
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
                      peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
                    ></div>
                    <span className="peer-checked:text-red-500">{year}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Distance Covered Filter */}
            <div>
              <h3 className="font-bold text-xl text-black">Distance Covered</h3>
              <div className="flex flex-col mt-2 gap-1">
                {uniqueDistances.map((dist) => (
                  <label
                    key={dist}
                    title={`Filter by ${dist}`}
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
                      peer-checked:before:content-['✓'] peer-checked:before:text-white peer-checked:before:text-sm"
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
          <div className="relative mb-6">
            <input
              className="search-input w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              type="text"
              placeholder="Search by model, brand, color, etc."
              value={searchQuery}
              onChange={handleSearch}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((item) => (
                <div
                  key={item._id}
                  className="product-card p-4 border border-gray-200 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow bg-white"
                  onClick={() => openModal(item)}
                >
                  <Slider {...sliderSettings} className="product-slider">
                    {item.images?.map(
                      (image, idx) =>
                        image && ( // Key change here
                          <div key={idx} className="slider-image-container">
                            <img
                              src={image} // Key change here
                              alt={`${item.model} ${idx + 1}`}
                              className="product-image w-full h-48 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/300x200?text=Car+Image";
                              }}
                            />
                          </div>
                        )
                    )}
                  </Slider>

                  <div className="mt-4 space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.model}
                    </h3>
                    <p className="text-gray-700">
                      <span className="font-semibold">Brand:</span>{" "}
                      {formatDisplayName(item.company)}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Color:</span>{" "}
                      {formatDisplayName(item.color)}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Distance:</span>{" "}
                      {item.distanceCovered.toLocaleString()} km
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Year:</span>{" "}
                      {item.modelYear}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Body:</span>{" "}
                      {formatDisplayName(item.bodyType)}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Fuel:</span>{" "}
                      {formatDisplayName(item.fuelType)}
                    </p>
                    <p className="text-gray-700 font-bold text-lg">
                      <span className="font-semibold">Price:</span> ₹
                      {(item.price * 100000).toLocaleString()}
                    </p>
                  </div>

                  <div className="product-actions mt-4 flex flex-col sm:flex-row gap-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const message = `I'm interested in this car:\n\n*Model:* ${
                          item.model
                        }\n*Brand:* ${formatDisplayName(
                          item.company
                        )}\n*Price:* ₹${(
                          item.price * 100000
                        ).toLocaleString()}\n*Year:* ${
                          item.modelYear
                        }\n*Color:* ${formatDisplayName(
                          item.color
                        )}\n\nCan you provide more details?`;
                        window.open(
                          `https://wa.me/8121021135?text=${encodeURIComponent(
                            message
                          )}`,
                          "_blank"
                        );
                      }}
                    >
                      <i className="ri-whatsapp-line"></i>
                      <span>WhatsApp</span>
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = "tel:+918121021135";
                      }}
                    >
                      <i className="ri-phone-line"></i>
                      <span>Call</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-96 flex flex-col justify-center items-center">
              <p className="text-gray-700 text-xl mb-4">
                No products match your filters
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Hidden on mobile */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={`full-view-modal mx-auto ${isMobile ? "hidden" : ""}`}
        overlayClassName={isMobile ? "hidden" : ""}
        style={{
          content: {
            maxWidth: "900px",
            margin: "auto",
            borderRadius: "12px",
            padding: "0",
            border: "none",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 1000,
          },
        }}
      >
        {currentProduct && !isMobile && (
          <FullViewSlider product={currentProduct} closeModal={closeModal} />
        )}
      </Modal>
    </div>
  );
}

export default ProductList;
