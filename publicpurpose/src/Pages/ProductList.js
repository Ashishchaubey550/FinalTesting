import React, { useEffect, useState, useMemo, useCallback } from "react";
import Slider from "react-slick";
import FullViewSlider from "../Components/FullViewSlider";
import Modal from "react-modal";
import "../CSS/ProductList.css";
import contactbg from "../images/ContactUs.webp";
import PriceFilter from "../Components/PriceFilter";

Modal.setAppElement("#root");

const normalizeString = (str) => {
  if (!str) return "";
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => { getProducts(); }, []);

  const getProducts = async () => {
    try {
      const response = await fetch("https://finaltesting-tnim.onrender.com/product");
      const result = await response.json();
      if (result?.length) {
        const normalizedProducts = result.map(p => ({
          ...p,
          company: normalizeString(p.company),
          color: normalizeString(p.color),
          bodyType: normalizeString(p.bodyType),
          fuelType: normalizeString(p.fuelType)
        }));
        setProducts(normalizedProducts);
        setFilteredProducts(normalizedProducts);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  const filterProducts = useCallback((
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
    const filtered = dataset.filter(p => {
      const priceInRupees = p.price * 100000;
      return (
        priceInRupees >= priceRange[0] &&
        priceInRupees <= priceRange[1] &&
        (!brands.length || brands.includes(p.company)) &&
        (!colors.length || colors.includes(p.color)) &&
        (!bodyTypes.length || bodyTypes.includes(p.bodyType)) &&
        (!fuelTypes.length || fuelTypes.includes(p.fuelType)) &&
        (!modelYears.length || modelYears.includes(p.modelYear)) &&
        (!distances.length || distances.includes(p.distanceCovered)) &&
        (!preowned || p.condition === "preowned") &&
        (!unregistered || p.registrationStatus === "unregistered")
      );
    });
    setFilteredProducts(filtered);
  }, [products]);

  const createFilterHandler = (state, setState, filterType) => 
    useCallback(({ target: { value } }) => {
      const normalizedValue = normalizeString(value);
      const newState = state.includes(normalizedValue)
        ? state.filter(item => item !== normalizedValue)
        : [...state, normalizedValue];
      setState(newState);
      filterProducts(
        priceRange,
        filterType === 'brand' ? newState : selectedBrands,
        filterType === 'color' ? newState : selectedColors,
        filterType === 'bodyType' ? newState : selectedBodyTypes,
        filterType === 'fuelType' ? newState : selectedFuelTypes,
        selectedModelYears,
        selectedDistances,
        showPreowned,
        showUnregistered
      );
    }, [state, priceRange, selectedBrands, selectedColors, selectedBodyTypes, 
       selectedFuelTypes, selectedModelYears, selectedDistances, 
       showPreowned, showUnregistered, filterProducts]);

  const handleBrandChange = createFilterHandler(selectedBrands, setSelectedBrands, 'brand');
  const handleColorChange = createFilterHandler(selectedColors, setSelectedColors, 'color');
  const handleBodyTypeChange = createFilterHandler(selectedBodyTypes, setSelectedBodyTypes, 'bodyType');
  const handleFuelTypeChange = createFilterHandler(selectedFuelTypes, setSelectedFuelTypes, 'fuelType');

  const handleNumericFilter = (state, setState, filterProp) => 
    useCallback(({ target: { value } }) => {
      const numericValue = Number(value);
      const newState = state.includes(numericValue)
        ? state.filter(item => item !== numericValue)
        : [...state, numericValue];
      setState(newState);
      filterProducts(
        priceRange,
        selectedBrands,
        selectedColors,
        selectedBodyTypes,
        selectedFuelTypes,
        filterProp === 'modelYear' ? newState : selectedModelYears,
        filterProp === 'distance' ? newState : selectedDistances,
        showPreowned,
        showUnregistered
      );
    }, [state, priceRange, selectedBrands, selectedColors, selectedBodyTypes, 
       selectedFuelTypes, selectedModelYears, selectedDistances, 
       showPreowned, showUnregistered, filterProducts]);

  const handleModelYearChange = handleNumericFilter(selectedModelYears, setSelectedModelYears, 'modelYear');
  const handleDistanceChange = handleNumericFilter(selectedDistances, setSelectedDistances, 'distance');

  const createToggleHandler = (state, setState, filterProp) => 
    useCallback(() => {
      const newValue = !state;
      setState(newValue);
      filterProducts(
        priceRange,
        selectedBrands,
        selectedColors,
        selectedBodyTypes,
        selectedFuelTypes,
        selectedModelYears,
        selectedDistances,
        filterProp === 'preowned' ? newValue : showPreowned,
        filterProp === 'unregistered' ? newValue : showUnregistered
      );
    }, [state, priceRange, selectedBrands, selectedColors, selectedBodyTypes, 
       selectedFuelTypes, selectedModelYears, selectedDistances, 
       showPreowned, showUnregistered, filterProducts]);

  const handlePreownedToggle = createToggleHandler(showPreowned, setShowPreowned, 'preowned');
  const handleUnregisteredToggle = createToggleHandler(showUnregistered, setShowUnregistered, 'unregistered');

  const searchHandle = useCallback(async ({ target: { value } }) => {
    if (!value) {
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
      return;
    }

    try {
      const response = await fetch(`https://finaltesting-tnim.onrender.com/search/${value}`);
      const result = await response.json();
      if (result) {
        const normalizedResults = result.map(p => ({
          ...p,
          company: normalizeString(p.company),
          color: normalizeString(p.color),
          bodyType: normalizeString(p.bodyType),
          fuelType: normalizeString(p.fuelType)
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
          normalizedResults
        );
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  }, [priceRange, selectedBrands, selectedColors, selectedBodyTypes, 
     selectedFuelTypes, selectedModelYears, selectedDistances, 
     showPreowned, showUnregistered, products, filterProducts]);

  const uniqueValues = (prop, sortFn) => 
    [...new Set(products.map(p => p[prop]))]
      .filter(Boolean)
      .sort(sortFn || ((a, b) => a.localeCompare(b)));

  const uniqueBrands = useMemo(() => uniqueValues('company'), [products]);
  const uniqueColors = useMemo(() => uniqueValues('color'), [products]);
  const uniqueBodyTypes = useMemo(() => uniqueValues('bodyType'), [products]);
  const uniqueFuelTypes = useMemo(() => uniqueValues('fuelType'), [products]);
  const uniqueModelYears = useMemo(() => 
    uniqueValues('modelYear', (a, b) => b - a).slice(0, 5), 
  [products]);
  const uniqueDistances = useMemo(() => 
    uniqueValues('distanceCovered').slice(0, 5), 
  [products]);

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

  const renderFilterCheckbox = (items, handler, transform = (v) => v) => (
    items.map(item => (
      <label key={item} className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          value={item}
          checked={selectedBrands.includes(item) || selectedColors.includes(item) || 
                   selectedBodyTypes.includes(item) || selectedFuelTypes.includes(item)}
          onChange={handler}
          className="peer hidden"
        />
        <div className="w-6 h-6 border-2 border-red-500 rounded-sm flex items-center justify-center
          peer-checked:bg-red-300 peer-checked:border-red-500">
          {(selectedBrands.includes(item) || selectedColors.includes(item) || 
           selectedBodyTypes.includes(item) || selectedFuelTypes.includes(item)) && '✓'}
        </div>
        <span className="capitalize">{transform(item)}</span>
      </label>
    ))
  );

  return (
    <div className="flex flex-col">
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

      <div className="flex flex-col lg:flex-row mt-10">
        <div className="w-full lg:w-1/4 p-4 lg:p-10 bg-gray-50">
          <div className="mb-4">
            <button
              className="clear-filters-btn bg-red-500 text-white font-semibold px-2.5 py-3 rounded-lg hover:bg-black transition-all w-full"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <button
              className={`filter-btn px-4 py-2 rounded-lg font-semibold ${
                showPreowned ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={handlePreownedToggle}
            >
              Preowned
            </button>
            <button
              className={`filter-btn px-4 py-2 rounded-lg font-semibold ${
                showUnregistered ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={handleUnregisteredToggle}
            >
              Unregistered
            </button>
          </div>

          <PriceFilter onPriceChange={setPriceRange} />

          <div className="lg:hidden">
            <details className="mb-4">
              <summary className="font-bold text-xl cursor-pointer">Filters</summary>
              <div className="mt-2 space-y-4">
                <FilterSection title="Brand" items={uniqueBrands} handler={handleBrandChange} />
                <FilterSection title="Color" items={uniqueColors} handler={handleColorChange} />
                <FilterSection title="Body Type" items={uniqueBodyTypes} handler={handleBodyTypeChange} />
                <FilterSection title="Fuel Type" items={uniqueFuelTypes} handler={handleFuelTypeChange} />
                <FilterSection 
                  title="Model Year" 
                  items={uniqueModelYears} 
                  handler={handleModelYearChange}
                  transform={v => v}
                />
                <FilterSection 
                  title="Distance (km)" 
                  items={uniqueDistances} 
                  handler={handleDistanceChange}
                  transform={v => `${v} km`}
                />
              </div>
            </details>
          </div>

          <div className="hidden lg:block space-y-6 mt-6">
            <FilterSection title="Brand" items={uniqueBrands} handler={handleBrandChange} />
            <FilterSection title="Color" items={uniqueColors} handler={handleColorChange} />
            <FilterSection title="Body Type" items={uniqueBodyTypes} handler={handleBodyTypeChange} />
            <FilterSection title="Fuel Type" items={uniqueFuelTypes} handler={handleFuelTypeChange} />
            <FilterSection 
              title="Model Year" 
              items={uniqueModelYears} 
              handler={handleModelYearChange}
              transform={v => v}
            />
            <FilterSection 
              title="Distance (km)" 
              items={uniqueDistances} 
              handler={handleDistanceChange}
              transform={v => `${v} km`}
            />
          </div>
        </div>

        <div className="w-full lg:w-3/4 p-4 lg:p-10">
          <input
            className="search-input w-full p-2 mb-4 border border-gray-300 rounded-lg"
            type="text"
            placeholder="Search Product"
            onChange={searchHandle}
          />
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(item => (
                <ProductCard 
                  key={item._id}
                  item={item}
                  openModal={openModal}
                  sliderSettings={sliderSettings}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ) : (
            <div className="h-96 flex justify-center items-center">
              <p className="text-gray-700">No products found</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="mx-auto max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        {currentProduct && <FullViewSlider product={currentProduct} closeModal={closeModal} />}
      </Modal>
    </div>
  );
}

const FilterSection = ({ title, items, handler, transform = (v) => v }) => (
  <div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <div className="space-y-2">
      {items.map(item => (
        <label key={item} className="flex items-center gap-2">
          <input
            type="checkbox"
            value={item}
            checked={handler === handleBrandChange ? selectedBrands.includes(item) :
                    handler === handleColorChange ? selectedColors.includes(item) :
                    handler === handleBodyTypeChange ? selectedBodyTypes.includes(item) :
                    handler === handleFuelTypeChange ? selectedFuelTypes.includes(item) :
                    false}
            onChange={handler}
            className="form-checkbox h-5 w-5 text-red-500"
          />
          <span className="capitalize">{transform(item)}</span>
        </label>
      ))}
    </div>
  </div>
);

const ProductCard = ({ item, openModal, sliderSettings, isMobile }) => (
  <div
    className="product-card p-4 border border-gray-200 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
    onClick={() => !isMobile && openModal(item)}
  >
    <Slider {...sliderSettings}>
      {item.images?.map((image, idx) => (
        <div key={idx}>
          <img
            src={`https://finaltesting-tnim.onrender.com${image}`}
            alt={`Product ${idx + 1}`}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      ))}
    </Slider>
    <ProductInfo item={item} />
    <ProductActions item={item} />
  </div>
);

const ProductInfo = ({ item }) => (
  <div className="mt-4">
    <h3 className="text-xl font-bold">Model: {item.model}</h3>
    <InfoItem label="Company" value={item.company} />
    <InfoItem label="Color" value={item.color} />
    <InfoItem label="Distance" value={`${item.distanceCovered} km`} />
    <InfoItem label="Year" value={item.modelYear} />
    <InfoItem label="Body Type" value={item.bodyType} />
    <InfoItem label="Fuel Type" value={item.fuelType} />
    <InfoItem label="Price" value={`₹${item.price} Lakhs`} />
    <InfoItem label="Variant" value={item.variant} />
    <InfoItem label="Reg. Year" value={item.registrationYear} />
    <InfoItem label="Transmission" value={item.transmissionType} />
    <InfoItem label="Condition" value={item.condition || "N/A"} />
    <InfoItem label="Reg. Status" value={item.registrationStatus || "N/A"} />
  </div>
);

const InfoItem = ({ label, value }) => (
  <p className="text-gray-700">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

const ProductActions = ({ item }) => {
  const message = `Hello! I'm interested in this car:\n${Object.entries(item)
    .map(([key, val]) => `- ${key}: ${val}`)
    .join('\n')}\n\nCan you provide more details?`;

  return (
    <div className="product-actions mt-4 flex gap-2">
      <ActionButton
        color="bg-green-500"
        icon="ri-whatsapp-line"
        label="WhatsApp"
        onClick={() => window.open(`https://wa.me/8121021135?text=${encodeURIComponent(message)}`, '_blank')}
      />
      <ActionButton
        color="bg-blue-500"
        icon="ri-phone-line"
        label="Call"
        onClick={() => window.open('tel:+918121021135', '_blank')}
      />
    </div>
  );
};

const ActionButton = ({ color, icon, label, onClick }) => (
  <button
    className={`${color} text-white px-4 py-2 rounded-lg hover:${color.replace('500', '600')} flex items-center gap-2 w-full justify-center`}
    onClick={onClick}
  >
    <i className={icon}></i>
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default ProductList;