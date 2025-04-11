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
        variant: '',
        car_number: '',
    });
    const [newImages, setNewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`);
                if (!response.ok) throw new Error('Failed to fetch product');
                const data = await response.json();
                setProduct({
                    company: data.company || '',
                    model: data.model || '',
                    color: data.color || '',
                    distanceCovered: data.distanceCovered || '',
                    modelYear: data.modelYear || '',
                    price: data.price || '',
                    bodyType: data.bodyType || '',
                    condition: data.condition || 'new',
                    fuelType: data.fuelType || '',
                    registrationStatus: data.registrationStatus || 'registered',
                    registrationYear: data.registrationYear || '',
                    transmissionType: data.transmissionType || '',
                    variant: data.variant || '',
                    car_number: data.car_number || ''
                });
                if (data.images) setExistingImages(data.images);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchProduct();
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setNewImages([...e.target.files]);
    };

    const toggleImageDelete = (imageUrl) => {
        setImagesToDelete(prev => 
            prev.includes(imageUrl) 
                ? prev.filter(img => img !== imageUrl) 
                : [...prev, imageUrl]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError('');
        setSuccess(false);

        try {
            // Validate car number format
            const carNumberRegex = /^[A-Z]{2}[0-9]{2}$/i;
            if (!carNumberRegex.test(product.car_number)) {
                throw new Error("Please enter a valid car number (e.g. MH12)");
            }

            const formData = new FormData();
            
            // Append all product data
            Object.entries(product).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Append images to delete
            if (imagesToDelete.length > 0) {
                formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
            }

            // Append new images
            Array.from(newImages).forEach((file) => {
                formData.append('images', file);
            });

            const response = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`, {
                method: 'PUT',
                body: formData
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Update failed');
            }

            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Update Product</h1>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">Product updated successfully!</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Car Number Field - Placed first */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium">Car Number Plate</label>
                        <input
                            type="text"
                            name="car_number"
                            value={product.car_number}
                            onChange={handleChange}
                            placeholder="e.g. MH12AB1234"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* Other fields */}
                    {[
                        { name: 'company', label: 'Company', type: 'text' },
                        { name: 'model', label: 'Model', type: 'text' },
                        { name: 'variant', label: 'Variant', type: 'text' },
                        { name: 'color', label: 'Color', type: 'text' },
                        { name: 'distanceCovered', label: 'Distance Covered (km)', type: 'number' },
                        { name: 'modelYear', label: 'Model Year', type: 'number' },
                        { name: 'registrationYear', label: 'Registration Year', type: 'number' },
                        { name: 'price', label: 'Price (₹)', type: 'number' },
                        { name: 'bodyType', label: 'Body Type', type: 'text' },
                        { name: 'fuelType', label: 'Fuel Type', type: 'text' },
                        { name: 'transmissionType', label: 'Transmission', type: 'text' },
                    ].map(field => (
                        <div key={field.name} className="space-y-1">
                            <label className="block text-sm font-medium">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={product[field.name]}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    ))}

                    {/* Condition Dropdown */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium">Condition</label>
                        <select
                            name="condition"
                            value={product.condition}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="new">New</option>
                            <option value="preowned">Preowned</option>
                        </select>
                    </div>

                    {/* Registration Status Dropdown */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium">Registration Status</label>
                        <select
                            name="registrationStatus"
                            value={product.registrationStatus}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="registered">Registered</option>
                            <option value="unregistered">Unregistered</option>
                        </select>
                    </div>
                </div>

                {/* Existing Images */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Existing Images</h3>
                    <div className="flex flex-wrap gap-2">
                        {existingImages.map((img, i) => (
                            <div key={i} className="relative group">
                                <img 
                                    src={img} 
                                    alt="" 
                                    className={`w-24 h-24 object-cover rounded border ${
                                        imagesToDelete.includes(img) ? 'opacity-50 border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleImageDelete(img)}
                                    className={`absolute top-1 right-1 p-1 rounded-full text-xs ${
                                        imagesToDelete.includes(img) ? 'bg-red-500 text-white' : 'bg-gray-200'
                                    }`}
                                >
                                    {imagesToDelete.includes(img) ? '✓' : '✕'}
                                </button>
                                {imagesToDelete.includes(img) && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                            Will be deleted
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {imagesToDelete.length > 0 && (
                        <p className="text-sm text-red-500">
                            {imagesToDelete.length} image(s) marked for deletion
                        </p>
                    )}
                </div>

                {/* New Images */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Add New Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {newImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {Array.from(newImages).map((file, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                        className="w-24 h-24 object-cover rounded border border-blue-300"
                                    />
                                    <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                        New
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isUpdating}
                    className={`px-4 py-2 rounded text-white ${isUpdating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {isUpdating ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
}

export default UpdateProduct;