import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import 'remixicon/fonts/remixicon.css';
import Footer from './Components/Footer';
import ScrollToTop from './Components/ScrollTop';
import '@mantine/carousel/styles.css';
import HeroSection from './Pages/HeroSection';
import ProductList from './Pages/ProductList';
import AboutUs from './Pages/AboutUs';
import ContactUs from './Pages/ContactUs';
import Services from './Pages/Services';
import BrandDetails from './Components/BrandDetails';
import { useEffect, useState, useRef } from 'react';
import { Analytics } from "@vercel/analytics/react";
import Preloader from './Components/Preloader';
import CustomCursor from './Components/CustomCursor'; // Import the new CustomCursor component

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Dynamically import LocomotiveScroll only when needed
      import('locomotive-scroll').then((LocomotiveScroll) => {
        const scroll = new LocomotiveScroll.default({
          el: scrollRef.current,
          smooth: true,
          // Add other options as needed
        });

        return () => {
          if (scroll) scroll.destroy();
        };
      });
    }
  }, [isLoading]);

  return (
    <div className="relative cursor-none" ref={scrollRef}>
      {isLoading && <Preloader />}
      <CustomCursor /> {/* Add the custom cursor component */}
      <div className={`relative ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/productList" element={<ProductList />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/products/:brand" element={<ProductList />} />
          <Route path="/brand/:brandName" element={<BrandDetails />} />
        </Routes>
        <ScrollToTop />
        <Footer />
        <Analytics />
      </div>
    </div>
  );
}

export default App;