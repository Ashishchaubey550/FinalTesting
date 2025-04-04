import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
    const [company, setCompany] = useState('');
    const [model, setModel] = useState('');
    const [variant, setVariant] = useState('');
    const [color, setColor] = useState('');
    const [distanceCovered, setDistanceCovered] = useState('');
    const [modelYear, setModelYear] = useState('');
    const [registrationYear, setRegistrationYear] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [transmissionType, setTransmissionType] = useState('');
    const [price, setPrice] = useState('');
    const [bodyType, setBodyType] = useState('');
    const [condition, setCondition] = useState('new');
    const [registrationStatus, setRegistrationStatus] = useState('registered');

    const [images, setImages] = useState([]); 
    const [previewImages, setPreviewImages] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const addProduct = async () => {
        try {
          setError('');
          
          // Validate required fields
          const requiredFields = [
            company, model, variant, color, distanceCovered,
            modelYear, registrationYear, fuelType, transmissionType,
            price, bodyType, condition, registrationStatus
          ];
          
          if (requiredFields.some(field => !field) || images.length === 0) {
            setError("All fields are required with at least one image");
            return;
          }
      
          // Create FormData with AbortController for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000); // 1 minute timeout
      
          const formData = new FormData();
          const numericFields = {
            distanceCovered,
            modelYear,
            price,
            registrationYear
          };
      
          // Append text fields
          Object.entries({
            company, model, variant, color, 
            fuelType, transmissionType, bodyType,
            condition, registrationStatus,
            ...numericFields
          }).forEach(([key, value]) => formData.append(key, String(value)));
      
          // Append image files
          images.forEach((image) => formData.append("images", image));
      
          const response = await fetch("https://finaltesting-tnim.onrender.com/add", {
            method: "POST",
            body: formData,
            signal: controller.signal
          });
      
          clearTimeout(timeoutId);
      
          // Handle response
          const contentType = response.headers.get('content-type');
          const data = contentType?.includes('application/json') 
            ? await response.json()
            : await response.text();
      
          if (!response.ok) {
            throw new Error(data.error || data || 'Failed to add car');
          }
      
          navigate("/");
        } catch (error) {
          console.error("Error:", error);
          setError(error.name === 'AbortError' 
            ? "Request timed out - please try again" 
            : error.message
          );
        }
      };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...selectedFiles]);
        
        const imagePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages((prevPreviews) => [...prevPreviews, ...imagePreviews]);
    };

    const handleDeselect = (index) => {
        const updatedImages = [...images];
        const updatedPreviews = [...previewImages];
        updatedImages.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setImages(updatedImages);
        setPreviewImages(updatedPreviews);
    };

    return (
        <div className="flex justify-center items-center flex-wrap bg-gradient-to-r from-green-400 to-blue-500 w-screen min-h-screen p-6">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">Add Car</h1>

                {/* First Row */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Car Company</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Car Company"
                            onChange={(e) => setCompany(e.target.value)}
                            value={company}
                        />
                        {error && !company && <span className="text-red-600 text-sm">Enter valid company</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Car Model</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Car Model"
                            onChange={(e) => setModel(e.target.value)}
                            value={model}
                        />
                        {error && !model && <span className="text-red-600 text-sm">Enter valid model</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Car Variant</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Car Variant"
                            onChange={(e) => setVariant(e.target.value)}
                            value={variant}
                        />
                        {error && !variant && <span className="text-red-600 text-sm">Enter valid variant</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Car Body Type</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Car Body Type"
                            onChange={(e) => setBodyType(e.target.value)}
                            value={bodyType}
                        />
                        {error && !bodyType && <span className="text-red-600 text-sm">Enter valid body type</span>}
                    </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Car Color</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Car Color"
                            onChange={(e) => setColor(e.target.value)}
                            value={color}
                        />
                        {error && !color && <span className="text-red-600 text-sm">Enter valid color</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Distance Covered (in km)</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Distance Covered"
                            onChange={(e) => setDistanceCovered(e.target.value)}
                            value={distanceCovered}
                        />
                        {error && !distanceCovered && <span className="text-red-600 text-sm">Enter valid distance</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Model Year</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Model Year"
                            onChange={(e) => setModelYear(e.target.value)}
                            value={modelYear}
                        />
                        {error && !modelYear && <span className="text-red-600 text-sm">Enter valid model year</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Registration Year</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Registration Year"
                            onChange={(e) => setRegistrationYear(e.target.value)}
                            value={registrationYear}
                        />
                        {error && !registrationYear && <span className="text-red-600 text-sm">Enter valid registration year</span>}
                    </div>
                </div>

                {/* Third Row */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Fuel Type</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Fuel Type"
                            onChange={(e) => setFuelType(e.target.value)}
                            value={fuelType}
                        />
                        {error && !fuelType && <span className="text-red-600 text-sm">Enter valid fuel type</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Transmission Type</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Transmission Type"
                            onChange={(e) => setTransmissionType(e.target.value)}
                            value={transmissionType}
                        />
                        {error && !transmissionType && <span className="text-red-600 text-sm">Enter valid transmission type</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Car Price (in Lakhs)</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Car Price"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
                        {error && !price && <span className="text-red-600 text-sm">Enter price in Lakhs</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Upload Car Images</label>
                        <input
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="file"
                            multiple
                            onChange={handleImageChange}
                        />
                        {error && images.length === 0 && <span className="text-red-600 text-sm">Please upload at least one image</span>}
                    </div>
                </div>

                {/* Fourth Row - New Fields */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Car Condition</label>
                        <select
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setCondition(e.target.value)}
                            value={condition}
                        >
                            <option value="new">New</option>
                            <option value="preowned">Preowned</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Registration Status</label>
                        <select
                            className="block w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setRegistrationStatus(e.target.value)}
                            value={registrationStatus}
                        >
                            <option value="registered">Registered</option>
                            <option value="unregistered">Unregistered</option>
                        </select>
                    </div>
                </div>

                {/* Preview Section */}
                {previewImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {previewImages.map((src, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={src}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-40 object-cover border-2 border-blue-300 rounded-lg"
                                />
                                <button
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-sm"
                                    onClick={() => handleDeselect(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={addProduct}
                    className="mt-6 w-full py-3 text-white bg-blue-600 rounded-lg text-xl hover:bg-blue-700 transition-all"
                >
                    Add Car
                </button>
            </div>
        </div>
    );
}

export default AddProduct;