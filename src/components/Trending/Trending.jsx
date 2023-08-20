import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Trending.scss";

export default function Trending() {
  const [trending, setTrending] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const getAllTrendingData = async () => {
    try {
      // use axios to get data from the backend
      const responseTrending = await axios.get(
        `${import.meta.env.VITE_STRAPI_BASE_URL}/api/trending`
      );

      const responseCategories = await axios.get(
        `${import.meta.env.VITE_STRAPI_BASE_URL}/api/categories`,
        {
          params: {
            "populate[image]": true,
          },
        }
      );

      const responseProducts = await axios.get(
        `${import.meta.env.VITE_STRAPI_BASE_URL}/api/products`,
        {
          params: {
            "populate[image]": true,
            "populate[categories]": true,
          },
        }
      );

      setTrending(responseTrending?.data?.data?.attributes);
      setCategories(responseCategories?.data?.data);
      setProducts(responseProducts?.data?.data.slice(0, 4));
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getAllTrendingData(); // calling the function
  }, []); // empty array means it will only run once

  return (
    <main className="trending">
      <h2>
        <span>{trending.heading}</span> {trending.headingSpan}
      </h2>
      <nav className="trending__selectBar">
        {categories.map((category) => (
          <Link key={category.id} to="/" className="selected">
            <span>{category?.attributes?.category}</span>
            <span>
              <img
                src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
                  category?.attributes?.image?.data?.attributes?.url
                }`}
              />
            </span>
          </Link>
        ))}
      </nav>

      <section className="trending__cardsSection">
        {products.map((product) => (
          <div key={product.id} className="card">
            <img
              src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
                product?.attributes?.image?.data?.attributes?.url
              }`}
            />
            <div>
              <h3>{product.attributes.name}</h3>
              <ul>
                <li>{product.attributes.price}</li>
                <li>{product.attributes.discount}</li>
              </ul>
              <button>
                {product?.attributes?.categories?.data[0]?.attributes?.name}
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
