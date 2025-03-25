import React from 'react'
import { Navigate , Outlet } from 'react-router-dom'
import Signup from './Singup';
const PrivateComponents=()=>{
    const auth = localStorage.getItem('user');
    return auth? <Outlet/> : <Navigate to="/singup"/>
}

export default PrivateComponents