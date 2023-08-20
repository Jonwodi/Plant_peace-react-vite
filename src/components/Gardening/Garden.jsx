import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Garden.scss";

export default function Garden() {
  const [gardenContent, setGardenContent] = useState({});
  const [products, setProducts] = useState([]);
  const [gardenNewsLetter, setGardenNewsLetter] = useState({});
  const [email, setEmail] = useState("");

  const getAllGardenData = async () => {
    try {
      // use axios to get data from the backend
      const responseGardenData = await axios.get(
        `${import.meta.env.VITE_STRAPI_BASE_URL}/api/garden`,
        {
          params: {
            "populate[gardenContent]": true,
            "populate[gardenNewsLetter]": true,
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

      setGardenContent(
        responseGardenData?.data?.data?.attributes?.gardenContent
      );

      setProducts(responseProducts?.data?.data.slice(4));

      setGardenNewsLetter(
        responseGardenData?.data?.data?.attributes?.gardenNewsLetter
      );
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getAllGardenData(); // calling the function
  }, []); // empty array means it will only run once

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      setEmail(email);

      // data object for post request
      const data = {
        email: email,
      };

      // send data to data object to to backend
      await axios.post(
        `${import.meta.env.VITE_STRAPI_BASE_URL}/api/mailing-lists`,
        { data }
      );

      setEmail("");
    } catch (error) {
      console.error("Error sending data: ", error);
    }
  };

  return (
    <main className="garden">
      <div className="garden__header">
        <h1>{gardenContent.bgHeading}</h1>
        <h3>{gardenContent.smHeading}</h3>
      </div>

      <section className="garden__cardSection">
        {products.map((product) => (
          <ul key={product.id}>
            <li>
              <img
                src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
                  product?.attributes?.image?.data?.attributes?.url
                }`}
              />
            </li>
            <li className="header">{product.attributes.name}</li>
            <li className="price">{product.attributes.price}</li>
          </ul>
        ))}
      </section>

      <section className="garden__subscribe">
        <div className="GreenCard">
          <ul className="GreenCard__header">
            <h1>{gardenNewsLetter.heading}</h1>
            <li>{gardenNewsLetter.description}</li>
          </ul>

          <form className="GreenCard__enlist" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button>{gardenNewsLetter.buttonText}</button>
          </form>
        </div>
      </section>
    </main>
  );
}
