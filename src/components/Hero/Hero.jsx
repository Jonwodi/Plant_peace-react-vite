import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Hero.scss";

export default function Hero() {
  const [heroContent, setHeroContent] = useState({});

  const getHeroData = async () => {
    try {
      // use axios to get data from the backend
      const response = await axios.get(
        `${import.meta.env.VITE_STRAPI_BASE_URL}/api/hero`,
        {
          params: {
            "populate[HeroContent][populate][LeftGardenImage]": true,
            "populate[HeroContent][populate][RightArrowImage]": true,
            "populate[HeroContent][populate][HeroImage]": true,
          },
        }
      );

      setHeroContent(response?.data?.data?.attributes?.HeroContent);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getHeroData(); // calling the function
  }, []); // empty array means it will only run once

  return (
    <section className="hero">
      <main className="hero__main">
        <h3>{heroContent.TopHeading}</h3>

        <div className="hero__main--leftInfo">
          <h2>{heroContent.BottomHeading}</h2>
          <p>{heroContent.paragraph}</p>
        </div>

        <Link to={heroContent.buttonLink}>
          <button>{heroContent.ButtonText}</button>
        </Link>

        <div className="hero__main--gardening">
          <img
            src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
              heroContent?.LeftGardenImage?.data?.attributes?.url
            }`}
            className="mainImage"
          />
          <ul>
            <li>{heroContent.GardeningText}</li>
            <li>
              <img
                src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
                  heroContent?.RightArrowImage?.data?.attributes?.url
                }`}
              />
            </li>
          </ul>
        </div>
      </main>

      <img
        src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
          heroContent?.HeroImage?.data?.attributes?.url
        }`}
        className="hero__image"
      />
    </section>
  );
}
