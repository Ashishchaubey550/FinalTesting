import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateProduct() {
    const [formData, setFormData] = useState({
        company: '',
        model: '',
        color: '',
        distanceCovered: '',
        modelYear: '',
        price: '',
        bodyType: '',
        images: []  // Changed to array for multiple images
    });
    const [newImages, setNewImages] = useState([]);
    const [error, setError] = useState('');
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getProductDetails();
    }, []);

    const getProductDetails = async () => {
        try {
            const response = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`);
            const result = await response.json();
            setFormData({
                company: result.company,
                model: result.model,
                color: result.color,
                distanceCovered: result.distanceCovered,
                modelYear: result.modelYear,
                price: result.price,
                bodyType: result.bodyType,
                images: result.images || []
            });
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const handleImageChange = (e) => {
        setNewImages([...e.target.files]);
    };

    const UpdateProd = async () => {
        try {
            const formDataToSend = new FormData();
            
            // Append existing form data
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'images') formDataToSend.append(key, value);
            });

            // Append new images
            newImages.forEach((image) => {
                formDataToSend.append('images', image);
            });

            const response = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`, {
                method: 'PUT',
                body: formDataToSend
            });

            if (!response.ok) throw new Error('Update failed');
            
            navigate("/");
        } catch (error) {
            console.error("Update error:", error);
            setError('Failed to update product. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="flex justify-center items-center flex-col m-[25px]">
            <h1 className="font-bold text-4xl mb-8">Update Product</h1>

            {/* Existing Images Preview */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Current Images:</h3>
                <div className="flex flex-wrap gap-4">
                    {formData.images.map((img, index) => (
                        <img 
                            key={index}
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                    ))}
                </div>
            </div>

            {/* Form Fields */}
            {['company', 'model', 'color', 'distanceCovered', 'modelYear', 'price', 'bodyType'].map((field) => (
                <input
                    key={field}
                    className="block m-2 p-2 w-[300px] border border-blue-400 rounded"
                    type="text"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                />
            ))}

            {/* Image Upload */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                    Upload New Images
                </label>
                <input
                    className="mt-1 block w-full p-2 border rounded"
                    type="file"
                    multiple
                    onChange={handleImageChange}
                />
                <p className="mt-1 text-sm text-gray-500">
                    Select one or multiple images
                </p>
            </div>

            {error && <div className="text-red-600 mt-2">{error}</div>}

            <button
                onClick={UpdateProd}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
                Update Product
            </button>
        </div>
    );
}

export default UpdateProduct;