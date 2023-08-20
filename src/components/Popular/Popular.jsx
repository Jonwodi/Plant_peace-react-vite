import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Popular.scss";

export default function Popular() {
  const [popular, setPopular] = useState({});
  const [products, setProducts] = useState([]);

  const getAllPopularData = async () => {
    try {
      // use axios to get data from the backend
      const responsePopular = await axios.get(
        `${import.meta.env.VITE_STRAPI_BASE_URL}/api/popular`
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

      setPopular(responsePopular?.data?.data?.attributes);
      setProducts(responseProducts?.data?.data.slice(0, 4));
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getAllPopularData(); // calling the function
  }, []); // empty array means it will only run once

  return (
    <main className="popular">
      <h1>
        {popular.heading} <span>{popular.headingSpan}</span>
      </h1>

      <section className="popular__cardsSection">
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
