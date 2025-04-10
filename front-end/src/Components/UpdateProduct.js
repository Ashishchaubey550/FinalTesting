import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateProduct() {
    const [product, setProduct] = useState({
        company: '',
        model: '',
        color: '',
        distanceCovered: '',
        modelYear: '',
        price: '',
        bodyType: '',
        condition: '',
        fuelType: '',
        registrationStatus: '',
        registrationYear: '',
        transmissionType: '',
        variant: ''
    });
    const [image, setImage] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [error, setError] = useState('');
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getProductDetails();
    }, []);

    const getProductDetails = async () => {
        try {
            console.log('Fetching product details for ID:', params.id);
            let response = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let result = await response.json();
            console.log('Product details received:', result);
            
            setProduct({
                company: result.company || '',
                model: result.model || '',
                color: result.color || '',
                distanceCovered: result.distanceCovered || '',
                modelYear: result.modelYear || '',
                price: result.price || '',
                bodyType: result.bodyType || '',
                condition: result.condition || '',
                fuelType: result.fuelType || '',
                registrationStatus: result.registrationStatus || '',
                registrationYear: result.registrationYear || '',
                transmissionType: result.transmissionType || '',
                variant: result.variant || ''
            });
            
            if (result.images && Array.isArray(result.images)) {
                setExistingImages(result.images);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Failed to load product details. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleImageSelection = (imageUrl) => {
        setSelectedImages(prev => 
            prev.includes(imageUrl) 
                ? prev.filter(img => img !== imageUrl) 
                : [...prev, imageUrl]
        );
    };

    const UpdateProd = async () => {
        // Validate required fields
        const requiredFields = [
            'company', 'model', 'color', 'distanceCovered', 
            'modelYear', 'price', 'bodyType', 'condition',
            'fuelType', 'registrationStatus', 'transmissionType'
        ];
        const missingFields = requiredFields.filter(field => !product[field]);
        
        if (missingFields.length > 0) {
            setError(`Please fill all required fields: ${missingFields.join(', ')}`);
            return;
        }

        setIsUpdating(true);
        setUpdateSuccess(false);
        setError('');

        try {
            const formData = new FormData();
            
            // Add all product data
            Object.entries(product).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            
            // Add new image if selected
            if (image) {
                formData.append('image', image);
            }
            
            // Add images to keep (filter out selected images to delete)
            const imagesToKeep = existingImages.filter(img => !selectedImages.includes(img));
            imagesToKeep.forEach(img => formData.append('images', img));

            console.log('Submitting update with form data:', {
                ...product,
                newImage: image ? image.name : 'none',
                imagesToKeep,
                imagesToDelete: selectedImages
            });

            const response = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`, {
                method: 'PUT',
                body: formData,
                // Don't set Content-Type header when using FormData
            });

            console.log('Update response status:', response.status);
            
            const result = await response.json();
            console.log('Update response:', result);
            
            if (!response.ok || (result.acknowledged !== undefined && !result.acknowledged)) {
                throw new Error(result.message || 'Update failed on server');
            }

            setUpdateSuccess(true);
            setTimeout(() => navigate("/"), 1500);
        } catch (error) {
            console.error('Update error:', error);
            setError(error.message || 'Failed to update product. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex justify-center items-center flex-col m-[25px]">
            <h1 className="font-bold text-4xl mb-6">Update Product</h1>

            {/* Error message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded w-full max-w-md">
                    {error}
                </div>
            )}

            {/* Success message */}
            {updateSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded w-full max-w-md">
                    Product updated successfully! Redirecting...
                </div>
            )}

            {/* Existing Images Preview */}
            {existingImages.length > 0 && (
                <div className="mb-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-2">Existing Images</h3>
                    <div className="flex flex-wrap gap-3">
                        {existingImages.map((imgUrl, index) => (
                            <div key={index} className="relative group">
                                <img 
                                    src={imgUrl} 
                                    alt={`Product ${index}`} 
                                    className={`w-24 h-24 object-cover rounded border-2 ${
                                        selectedImages.includes(imgUrl) 
                                            ? 'border-red-500 opacity-70' 
                                            : 'border-gray-300 hover:border-blue-400'
                                    } transition-all`}
                                />
                                <button
                                    onClick={() => toggleImageSelection(imgUrl)}
                                    className={`absolute top-1 right-1 p-1 rounded-full ${
                                        selectedImages.includes(imgUrl) 
                                            ? 'bg-red-500 text-white' 
                                            : 'bg-white/90 text-gray-700 hover:bg-gray-200'
                                    } text-xs shadow transition-all`}
                                >
                                    {selectedImages.includes(imgUrl) ? '✕' : '✕'}
                                </button>
                                {selectedImages.includes(imgUrl) && (
                                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                        <span className="text-white font-bold">REMOVE</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {selectedImages.length > 0 && (
                        <p className="text-sm text-red-600 mt-2">
                            {selectedImages.length} image(s) marked for removal
                        </p>
                    )}
                </div>
            )}

            {/* Form Fields */}
            <div className="w-full max-w-md space-y-4">
                {[
                    { name: 'company', label: 'Company Name', placeholder: 'Enter Company Name' },
                    { name: 'model', label: 'Car Model', placeholder: 'Enter Car Model' },
                    { name: 'color', label: 'Color', placeholder: 'Enter Color' },
                    { name: 'distanceCovered', label: 'Distance Covered', placeholder: 'Enter Distance Covered', type: 'number' },
                    { name: 'modelYear', label: 'Model Year', placeholder: 'Enter Model Year', type: 'number' },
                    { name: 'bodyType', label: 'Car Body Type', placeholder: 'Enter Car Body Type' },
                    { name: 'price', label: 'Price (in Lakhs)', placeholder: 'Enter Price in Lakhs', type: 'number' },
                    { name: 'condition', label: 'Condition', placeholder: 'Enter Condition (new/preowned)' },
                    { name: 'fuelType', label: 'Fuel Type', placeholder: 'Enter Fuel Type' },
                    { name: 'registrationStatus', label: 'Registration Status', placeholder: 'Enter Registration Status' },
                    { name: 'registrationYear', label: 'Registration Year', placeholder: 'Enter Registration Year', type: 'number' },
                    { name: 'transmissionType', label: 'Transmission Type', placeholder: 'Enter Transmission Type' },
                    { name: 'variant', label: 'Variant', placeholder: 'Enter Variant' }
                ].map((field) => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                        </label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            type={field.type || 'text'}
                            name={field.name}
                            placeholder={field.placeholder}
                            onChange={handleInputChange}
                            value={product[field.name]}
                        />
                    </div>
                ))}

                {/* New Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Add New Image
                    </label>
                    <input
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    {image && (
                        <div className="mt-3">
                            <p className="text-sm text-gray-600">Selected: {image.name}</p>
                            <img 
                                src={URL.createObjectURL(image)} 
                                alt="Preview" 
                                className="mt-2 w-24 h-24 object-cover rounded border border-gray-300"
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    onClick={UpdateProd}
                    disabled={isUpdating}
                    className={`w-full mt-6 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                        isUpdating 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : updateSuccess 
                                ? 'bg-green-600' 
                                : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                    {isUpdating ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                        </div>
                    ) : updateSuccess ? (
                        <span>✓ Updated Successfully!</span>
                    ) : (
                        'Update Product'
                    )}
                </button>
            </div>
        </div>
    );
}

export default UpdateProduct;