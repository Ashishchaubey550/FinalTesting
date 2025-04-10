import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateProduct() {
    const [company, setCompany] = useState('');
    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const [distanceCovered, setDistanceCovered] = useState('');
    const [modelYear, setModelYear] = useState('');
    const [price, setPrice] = useState('');
    const [bodyType, setbodyType] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [deleteCurrentImage, setDeleteCurrentImage] = useState(false);
    const [error, setError] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getProductDetails();
    }, []);

    const getProductDetails = async () => {
        try {
            let result = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`);
            if (!result.ok) {
                throw new Error('Failed to fetch product details');
            }
            result = await result.json();
            setCompany(result.company);
            setModel(result.model);
            setColor(result.color);
            setDistanceCovered(result.distanceCovered);
            setModelYear(result.modelYear);
            setPrice(result.price);
            setbodyType(result.bodyType);
            setImageUrl(result.image || '');
        } catch (error) {
            setError('Failed to load product details');
            console.error(error);
        }
    };

    const UpdateProd = async () => {
        if (!company || !model || !color || !distanceCovered || !modelYear || !price || !bodyType) {
            setError('Please fill all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('company', company);
        formData.append('model', model);
        formData.append('color', color);
        formData.append('distanceCovered', distanceCovered);
        formData.append('modelYear', modelYear);
        formData.append('price', price);
        formData.append('bodyType', bodyType);
        formData.append('deleteImage', deleteCurrentImage.toString()); // Convert boolean to string
        
        if (image) {
            formData.append('image', image);
        }

        try {
            const result = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`, {
                method: 'PUT',
                body: formData,
                // Don't set Content-Type header when using FormData
                // The browser will set it automatically with the correct boundary
            });

            const response = await result.json();
            
            if (result.ok) {
                setIsUpdated(true);
                setTimeout(() => navigate("/"), 1500);
            } else {
                setError(response.message || 'Update failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    const handleImageDelete = () => {
        setDeleteCurrentImage(true);
        setImageUrl('');
        setImage(null); // Also clear any newly selected image
    };

    return (
        <div className="flex justify-center items-center flex-col m-[25px]">
            <h1 className="font-bold text-4xl mb-8">Update Product</h1>

            <div className="w-full max-w-md">
                {/* Current Image Preview */}
                {imageUrl && !deleteCurrentImage && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
                        <div className="relative">
                            <img src={imageUrl} alt="Current" className="w-32 h-32 object-cover rounded" />
                            <button
                                type="button"
                                onClick={handleImageDelete}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Company Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                        className="w-full p-2 border border-blue-400 rounded"
                        type='text'
                        onChange={(e) => setCompany(e.target.value)}
                        value={company}
                    />
                    {error && !company && <span className='text-red-600 text-sm'>Enter valid company name</span>}
                </div>

                {/* Model Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Model</label>
                    <input
                        className="w-full p-2 border border-blue-400 rounded"
                        type='text'
                        onChange={(e) => setModel(e.target.value)}
                        value={model}
                    />
                    {error && !model && <span className='text-red-600 text-sm'>Enter model</span>}
                </div>

                {/* Color Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                        className="w-full p-2 border border-blue-400 rounded"
                        type='text'
                        onChange={(e) => setColor(e.target.value)}
                        value={color}
                    />
                    {error && !color && <span className='text-red-600 text-sm'>Enter color</span>}
                </div>

                {/* Distance Covered Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Distance Covered (km)</label>
                    <input
                        className="w-full p-2 border border-blue-400 rounded"
                        type='number'
                        onChange={(e) => setDistanceCovered(e.target.value)}
                        value={distanceCovered}
                    />
                    {error && !distanceCovered && <span className='text-red-600 text-sm'>Enter distance</span>}
                </div>

                {/* Model Year Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Year</label>
                    <input
                        className="w-full p-2 border border-blue-400 rounded"
                        type='number'
                        onChange={(e) => setModelYear(e.target.value)}
                        value={modelYear}
                    />
                    {error && !modelYear && <span className='text-red-600 text-sm'>Enter model year</span>}
                </div>

                {/* Body Type Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                    <input
                        className="w-full p-2 border border-blue-400 rounded"
                        type="text"
                        onChange={(e) => setbodyType(e.target.value)}
                        value={bodyType}
                    />
                    {error && !bodyType && <span className="text-red-600 text-sm">Enter body type</span>}
                </div>

                {/* Price Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (Lakhs)</label>
                    <input
                        className="w-full p-2 border border-blue-400 rounded"
                        type='number'
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                    />
                    {error && !price && <span className='text-red-600 text-sm'>Enter price</span>}
                </div>

                {/* New Image Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Image</label>
                    <input
                        className="w-full p-2 border border-blue-400 rounded"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                {/* Update Button */}
                <button
                    onClick={UpdateProd}
                    className={`w-full py-2 px-4 rounded ${isUpdated ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
                    disabled={isUpdated}
                >
                    {isUpdated ? '✓ Updated Successfully!' : 'Update Product'}
                </button>

                {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
            </div>
        </div>
    );
}

export default UpdateProduct;