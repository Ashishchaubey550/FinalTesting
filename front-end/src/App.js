import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Singup from './Components/Singup';
import PrivateComponents from './Components/PrivateComponents';
import Login from './Components/Login';
import AddProduct from './Components/AddProduct';
import ProductList from './Components/ProductList';
import UpdateProduct from './Components/UpdateProduct';
import HeroSection from './Components/HeroSection';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
function App() {
  return (
    <div className=' h-full w-[100%]'>
      <BrowserRouter>
      <Navbar/>
      <Routes>
      <Route  element={<PrivateComponents/>}>
      <Route path="/" element={<HeroSection />} />

        <Route path="/" element={<ProductList/>} />
        <Route path="/add" element={<AddProduct/>} />
        {/* <Route path="/product" element={<h1>Product</h1>} /> */}
        <Route path="/update/:id" element={<UpdateProduct/>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
        <Route path="/logout" element={<h1>Log Out</h1>} />
        </Route>
        <Route path="/singup" element={<Singup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='reset-password/:token' element={<ResetPassword/>}/>
      </Routes>
      </BrowserRouter>
      {/* <Footer/> */}
    </div>
  );
}

export default App;
