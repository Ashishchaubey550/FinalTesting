import React, { useEffect, useState } from 'react';
import { useParams , useNavigate  } from 'react-router-dom';

function UpdateProduct() {
    const [company, setCompany] = useState('');
    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const [distanceCovered, setDistanceCovered] = useState('');
    const [modelYear, setModelYear] = useState('');
    const [price, setPrice] = useState('');
    const [bodyType, setbodyType] = useState('');
    const [image, setImage] = useState(null); // State for image
    const [error, setError] = useState('');
    const params = useParams();
    const navigate = useNavigate();


    useEffect(()=>{
        console.warn(params)
        getProductDetails();
    },[])

    const getProductDetails = async() =>{
        console.log(params)
        let result = await fetch(`http://localhost:9000/product/${params.id}`)
        result = await result.json();
        setCompany(result.company)
        setModel(result.model)
        setColor(result.color)
        setDistanceCovered(result.distanceCovered)
        setModelYear(result.modelYear)
        setPrice(result.price)
        setbodyType(result.bodyType)
    }

    const UpdateProd = async () => {
        console.warn(company,model,color,distanceCovered , modelYear , price)
        let result = await fetch(`http://localhost:9000/product/${params.id}`,{
            method:'Put',
            body:JSON.stringify({company,model,color,distanceCovered , modelYear , price ,bodyType
            }),
            headers:{
                'Content-Type':"application/json"
            }
        });
        result = await result.json
        navigate("/")
    };

    return (
        <div className="flex justify-center items-center flex-col m-[25px]">
            <h1 className="font-bold text-4xl">Update</h1>

            {/* Product Name Input */}
            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type='text'
                placeholder='Enter Company Name'
                onChange={(e) => { setCompany(e.target.value) }}
                value={company}
            />
            {error && !company && <span className=' text-red-600 block mt-[-20px] ml-[-170px]'>Enter Valid Company Name</span>}

            {/* Product Price Input */}
            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type='text'
                placeholder='Enter Car Model'
                onChange={(e) => { setModel(e.target.value) }}
                value={model}
            />
            {error && !model && <span className=' text-red-600 block mt-[-20px] ml-[-170px]'>Enter Model </span>}

            {/* Product Category Input */}
            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type='text'
                placeholder='Enter Color'
                onChange={(e) => { setColor(e.target.value) }}
                value={color}
            />
            {error && !color && <span className=' text-red-600 block mt-[-20px] ml-[-170px]'>Enter CAR Color</span>}

            {/* Product Company Input */}
            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type='text'
                placeholder='Enter Distance Covered'
                onChange={(e) => { setDistanceCovered(e.target.value) }}
                value={distanceCovered}
            />
            {error && !distanceCovered && <span className=' text-red-600 block mt-[-20px] ml-[-170px]'>Enter distanceCovered</span>}

                {/* Product Company Input */}
            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type='text'
                placeholder='Enter Model Year'
                onChange={(e) => { setModelYear(e.target.value) }}
                value={modelYear}
            />
            {error && !modelYear && <span className=' text-red-600 block mt-[-20px] ml-[-170px]'>Enter modelYear</span>}

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
            {error && !price && <span className=' text-red-600 block mt-[-20px] ml-[-170px]'>Enter Price</span>}



            {/* Image Upload Input */}
            <input
                className="block m-[25px] p-2 w-[300px] border-solid border-blue-400 border-[1px]"
                type="file"
                onChange={(e) => setImage(e.target.files[0])} // Update the image state
            />
            {error && !image && <span className=' text-red-600 block mt-[-20px] ml-[-170px]'>Please upload an image</span>}

            {/* Submit Button */}
            <button
                onClick={UpdateProd}
                className="m-[25px] p-[10px] w-[150px] bg-blue-300 border-black border-solid border-2"
            >
                Update
            </button>
        </div>
    );
}

export default UpdateProduct;
