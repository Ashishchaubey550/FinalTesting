import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProductList from './ProductList';
import { CustomNextArrow, CustomPrevArrow } from './SlidderButton';

// Import images
import image1 from '../images/image1.webp';
import image2 from '../images/image2.webp';
import image3 from '../images/image3.webp';
import image4 from '../images/image4.webp';
import image5 from '../images/image5.webp';
import image6 from '../images/image6.webp';
import image7 from '../images/image7.webp';

function HeroSection() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // More reasonable auto-play duration
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    adaptiveHeight: true // Better for different image aspect ratios
  };

  const images = [image1, image2, image3, image4, image5, image6, image7];

  return (
    <div className="overflow-hidden">
      {/* Hero Carousel */}
      <div className="relative h-[80vh] w-full"> {/* Better height control */}
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} className="h-[80vh]"> {/* Fixed slide height */}
              <img 
                src={img} 
                alt={`New Arrival ${index + 1}`} // More descriptive alt text
                className="w-full h-full object-cover object-center" // Better image positioning
                loading="lazy" // Add lazy loading
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* New Arrivals Section */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold text-center mb-8">
          NEW ARRIVALS
        </h1>
        <ProductList />
      </div>
    </div>
  );
}

export default HeroSection;