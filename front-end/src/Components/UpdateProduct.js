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
            const response = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`);
            if (!response.ok) throw new Error('Failed to fetch product');
            const result = await response.json();
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
            if (result.images) setExistingImages(result.images);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to load product details');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const toggleImageSelection = (imageUrl) => {
        setSelectedImages(prev => 
            prev.includes(imageUrl) 
                ? prev.filter(img => img !== imageUrl) 
                : [...prev, imageUrl]
        );
    };

    const UpdateProd = async () => {
        setIsUpdating(true);
        setError('');

        try {
            const formData = new FormData();
            
            // Append all product data
            Object.entries(product).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            // Append new image if exists
            if (image) formData.append('image', image);

            // Append images to keep
            existingImages
                .filter(img => !selectedImages.includes(img))
                .forEach(img => formData.append('images', img));

            const response = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`, {
                method: 'PUT',
                body: formData
            });

            const result = await response.json();
            
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Update failed on server');
            }

            setUpdateSuccess(true);
            setTimeout(() => navigate("/"), 1500);
        } catch (error) {
            console.error('Update error:', error);
            setError(error.message || 'Failed to update product');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Update Product</h1>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {updateSuccess && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">Product updated successfully!</div>}

            {/* Existing Images */}
            {existingImages.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Existing Images</h3>
                    <div className="flex flex-wrap gap-2">
                        {existingImages.map((img, i) => (
                            <div key={i} className="relative">
                                <img src={img} alt="" className="w-24 h-24 object-cover rounded border" />
                                <button 
                                    onClick={() => toggleImageSelection(img)}
                                    className={`absolute top-1 right-1 p-1 rounded-full text-xs ${
                                        selectedImages.includes(img) ? 'bg-red-500 text-white' : 'bg-gray-200'
                                    }`}
                                >
                                    {selectedImages.includes(img) ? 'Remove' : 'Delete'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { name: 'company', label: 'Company', type: 'text' },
                    { name: 'model', label: 'Model', type: 'text' },
                    { name: 'color', label: 'Color', type: 'text' },
                    { name: 'distanceCovered', label: 'Distance Covered', type: 'number' },
                    { name: 'modelYear', label: 'Model Year', type: 'number' },
                    { name: 'price', label: 'Price', type: 'number' },
                    { name: 'bodyType', label: 'Body Type', type: 'text' },
                    { name: 'condition', label: 'Condition', type: 'text' },
                    { name: 'fuelType', label: 'Fuel Type', type: 'text' },
                    { name: 'registrationStatus', label: 'Registration Status', type: 'text' },
                    { name: 'registrationYear', label: 'Registration Year', type: 'number' },
                    { name: 'transmissionType', label: 'Transmission', type: 'text' },
                    { name: 'variant', label: 'Variant', type: 'text' },
                ].map(field => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium mb-1">{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={product[field.name]}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                ))}
            </div>

            {/* New Image Upload */}
            <div className="mt-4">
                <label className="block text-sm font-medium mb-1">New Image</label>
                <input 
                    type="file" 
                    onChange={(e) => setImage(e.target.files[0])} 
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
                {image && (
                    <div className="mt-2">
                        <img 
                            src={URL.createObjectURL(image)} 
                            alt="Preview" 
                            className="h-24 object-cover rounded border"
                        />
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
                onClick={UpdateProd}
                disabled={isUpdating}
                className={`mt-6 px-4 py-2 rounded text-white ${
                    isUpdating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {isUpdating ? 'Updating...' : 'Update Product'}
            </button>
        </div>
    );
}

export default UpdateProduct;