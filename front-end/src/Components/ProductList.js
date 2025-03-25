import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/ProductList.css";
import Slider from "react-slick"; // Import react-slick


function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      let result = await fetch("http://localhost:9000/product");
      result = await result.json();
      if (result && result.length > 0) {
        setProducts(result);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const deleteCar = async (id) => {
    try {
      let result = await fetch(`http://localhost:9000/product/${id}`, {
        method: "DELETE",
      });
      result = await result.json();
      if (result) {
        getProducts();
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const searchHandle = async (event) => {
    let key = event.target.value;

    if (key) {
      try {
        let result = await fetch(`http://localhost:9000/search/${key}`);
        result = await result.json();

        if (result) {
          setProducts(result);
        }
      } catch (error) {
        console.error("Error searching cars:", error);
      }
    } else {
      getProducts();
    }
  };

    // Slider settings
    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };






  return (
    <div className="product-list-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search Car"
        onChange={searchHandle}
      />
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((item, index) => (
            <div key={item._id} className="product-card">
<Slider {...sliderSettings} className="product-slider">
                {item.images &&
                  item.images.map((image, idx) => (
                    <div key={idx} className="">
                      <img
                        src={`http://localhost:9000${image}`}
                        alt={`Product ${idx + 1}`}
                        className="product-image"
                      />
                    </div>
                  ))}
              </Slider>
              <h3 className=" mt-10 product-model">Model: {item.model}</h3>
              <p className="product-company">Company: {item.company}</p>
              <p className="product-color">Color: {item.color}</p>
              <p className="product-distance">
                Distance Covered: {item.distanceCovered} km
              </p>
              <p className="product-modelYear">Model Year: {item.modelYear}</p>
              <p className="product-price">Price: ₹{item.price} Lakhs</p>
              <p className="product-bodyType">BodyType: {item.bodyType}</p>

              <div className="product-actions">
                <button
                  className="delete-button"
                  onClick={() => deleteCar(item._id)}
                >
                  Delete
                </button>
                <Link to={`/update/${item._id}`} className="update-link">
                  Update
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-products">No cars found</p>
      )}
    </div>
  );
}

export default ProductList;
