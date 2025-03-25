import React, { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logo from "../images/logo.png"
const Navbar = () => {
    const auth = localStorage.getItem('user');
    const Navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        Navigate('/singup')
        console.warn("Apple")
    }
    return (
        <>
            <div>
                {
                    auth ? <ul className=" justify-evenly items-center flex px-14 h-[20%] w-[100%] bg-black">
                        {/* <li className=" text-white  p-5">
                            <Link to="/product">Product</Link>
                        </li> */}
                    <li>
                    </li>
                       <div>
                       <img className="h-[100px] w-[100px]" src={logo}/>
                       </div>
                       <div className="flex"> 
                       <li className=" text-green-400  text-white p-4 hover:text-white hover:border-b-4 hover:border-b-red-400">
                            <Link to="/add">Add Product</Link>
                        </li>
                        {/* <li className=" text-white  p-5">
                            <Link to="/update">Update Product</Link>
                        </li> */}
                        <li className=" text-white p-4 hover:text-white hover:border-b-4 hover:border-b-red-400">
                            <Link to="/">Product List</Link>
                        </li>
                        <li className=" text-white p-4 hover:text-white hover:border-b-4 hover:border-b-red-400">
                            <Link to="/profile">Abouts</Link>
                        </li>
                        <li className=" text-white p-4 hover:text-white hover:border-b-4 hover:border-b-red-400"> <Link onClick={logout} to="/singup">Log Out {JSON.parse(auth).name}</Link></li>
                       </div>
                    </ul>
                        :
                        <ul className=" flex p-2 m-0 bg-blue-500">
                            <li className=" text-white p-5 space-x-7">
                                <Link to="/singup">Register</Link>
                                <Link to="/login">Log In</Link>
                            </li>

                        </ul>
                }
            </div>
        </>
    );
}

export default Navbar;