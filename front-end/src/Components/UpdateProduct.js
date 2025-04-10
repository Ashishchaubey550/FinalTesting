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
        let result = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`);
        result = await result.json();
        setCompany(result.company);
        setModel(result.model);
        setColor(result.color);
        setDistanceCovered(result.distanceCovered);
        setModelYear(result.modelYear);
        setPrice(result.price);
        setbodyType(result.bodyType);
        if (result.images) {
            setExistingImages(result.images);
        }
    };

    const toggleImageSelection = (imageUrl) => {
        if (selectedImages.includes(imageUrl)) {
            setSelectedImages(selectedImages.filter(img => img !== imageUrl));
        } else {
            setSelectedImages([...selectedImages, imageUrl]);
        }
    };

    const UpdateProd = async () => {
        if (!company || !model || !color || !distanceCovered || !modelYear || !price || !bodyType) {
            setError('Please fill all required fields');
            return;
        }

        setIsUpdating(true);
        setUpdateSuccess(false);
        setError('');

        try {
            const formData = new FormData();
            formData.append('company', company);
            formData.append('model', model);
            formData.append('color', color);
            formData.append('distanceCovered', distanceCovered);
            formData.append('modelYear', modelYear);
            formData.append('price', price);
            formData.append('bodyType', bodyType);
            
            // Append new image if selected
            if (image) {
                formData.append('image', image);
            }
            
            // Append images to keep (filter out selected images to delete)
            const imagesToKeep = existingImages.filter(img => !selectedImages.includes(img));
            imagesToKeep.forEach(img => formData.append('existingImages', img));

            let result = await fetch(`https://finaltesting-tnim.onrender.com/product/${params.id}`, {
                method: 'PUT',
                body: formData,
                // Don't set Content-Type header when using FormData, browser will set it automatically
            });

            if (result.ok) {
                setUpdateSuccess(true);
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            setError('Failed to update product. Please try again.');
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex justify-center items-center flex-col m-[25px]">
            <h1 className="font-bold text-4xl">Update Product</h1>

            {/* Existing Images Preview */}
            {existingImages.length > 0 && (
                <div className="my-4">
                    <h3 className="text-lg font-semibold mb-2">Existing Images</h3>
                    <div className="flex flex-wrap gap-2">
                        {existingImages.map((imgUrl, index) => (
                            <div key={index} className="relative">
                                <img 
                                    src={imgUrl} 
                                    alt={`Product ${index}`} 
                                    className={`w-24 h-24 object-cover border-2 ${selectedImages.includes(imgUrl) ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <button
                                    onClick={() => toggleImageSelection(imgUrl)}
                                    className={`absolute top-0 right-0 p-1 text-xs ${selectedImages.includes(imgUrl) ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                                >
                                    {selectedImages.includes(imgUrl) ? 'Remove' : 'Delete'}
                                </button>
                            </div>
                        ))}
                    </div>
                    {selectedImages.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            {selectedImages.length} image(s) marked for deletion
                        </p>
                    )}
                </div>
            )}

            {/* Form Fields */}
            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type='text'
                placeholder='Enter Company Name'
                onChange={(e) => { setCompany(e.target.value) }}
                value={company}
            />
            {error && !company && <span className='text-red-600 block mt-[-20px] ml-[-170px]'>Enter Valid Company Name</span>}

            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type='text'
                placeholder='Enter Car Model'
                onChange={(e) => { setModel(e.target.value) }}
                value={model}
            />
            {error && !model && <span className='text-red-600 block mt-[-20px] ml-[-170px]'>Enter Model</span>}

            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type='text'
                placeholder='Enter Color'
                onChange={(e) => { setColor(e.target.value) }}
                value={color}
            />
            {error && !color && <span className='text-red-600 block mt-[-20px] ml-[-170px]'>Enter CAR Color</span>}

            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type='text'
                placeholder='Enter Distance Covered'
                onChange={(e) => { setDistanceCovered(e.target.value) }}
                value={distanceCovered}
            />
            {error && !distanceCovered && <span className='text-red-600 block mt-[-20px] ml-[-170px]'>Enter distanceCovered</span>}

            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type='text'
                placeholder='Enter Model Year'
                onChange={(e) => { setModelYear(e.target.value) }}
                value={modelYear}
            />
            {error && !modelYear && <span className='text-red-600 block mt-[-20px] ml-[-170px]'>Enter modelYear</span>}

            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type="text"
                placeholder="Enter Car body"
                onChange={(e) => setbodyType(e.target.value)}
                value={bodyType}
            />
            {error && !bodyType && <span className="text-red-600 block mt-[-20px] ml-[-170px]">Enter valid bodyType</span>}

            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type='text'
                placeholder='Enter Price in Lakhs'
                onChange={(e) => { setPrice(e.target.value) }}
                value={price}
            />
            {error && !price && <span className='text-red-600 block mt-[-20px] ml-[-170px]'>Enter Price</span>}

            {/* New Image Upload */}
            <div className="my-4">
                <h3 className="text-lg font-semibold mb-2">Add New Image</h3>
                <input
                    className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                {image && (
                    <div className="mt-2">
                        <p className="text-sm">Selected: {image.name}</p>
                        <img 
                            src={URL.createObjectURL(image)} 
                            alt="Preview" 
                            className="w-24 h-24 object-cover mt-2 border border-gray-300"
                        />
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
                onClick={UpdateProd}
                disabled={isUpdating}
                className={`m-[25px] p-[10px] w-[150px] border-black border-solid border-2 
                    ${isUpdating ? 'bg-gray-400' : updateSuccess ? 'bg-green-500' : 'bg-blue-300'}`}
            >
                {isUpdating ? (
                    <div className="flex justify-center items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                    </div>
                ) : updateSuccess ? (
                    <span className="text-white">✓ Updated!</span>
                ) : (
                    'Update'
                )}
            </button>

            {error && <div className="text-red-600 mb-4">{error}</div>}
        </div>
    );
}

export default UpdateProduct;