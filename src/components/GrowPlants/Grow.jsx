import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Grow.scss";

export default function Grow() {
  const [growContent, setGrowContent] = useState({});
  const [growSteps, setGrowSteps] = useState([]);
  const [growCards, setGrowCards] = useState([]);

  const getGrowData = async () => {
    try {
      // use axios to get data from the backend
      const response = await axios.get(
        `${import.meta.env.VITE_STRAPI_BASE_URL}/api/grow`,
        {
          params: {
            "populate[growContent]": true,
            "populate[growSteps][populate][image]": true,
            "populate[growCards][populate][image]": true,
          },
        }
      );

      // destructure the data
      const { growContent, growSteps, growCards } =
        response?.data?.data?.attributes;

      setGrowContent(growContent);
      setGrowSteps(growSteps);
      setGrowCards(growCards);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getGrowData(); // calling the function
  }, []); // empty array means it will only run once

  return (
    <main className="grow">
      <div className="grow__header">
        <h1>{growContent.mainHeading}</h1>
        <p>{growContent.mainParagraph}</p>
      </div>

      <section className="grow__adviceCards">
        {growSteps.map((step) => (
          <div key={step.id}>
            <ul>
              <li>
                <img
                  src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
                    step?.image?.data?.attributes?.url
                  }`}
                />
              </li>
              <li>{step.heading}</li>
            </ul>
            <p>{step.paragraph}</p>
          </div>
        ))}
      </section>

      <section className="grow__ourWeb">
        {growCards.map((card, index) => {
          if (card.__component === "grow.grow-card-type1") {
            return (
              <img
                key={index}
                src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
                  card?.image?.data?.attributes?.url
                }`}
              />
            );
          } else if (card.__component === "grow.grow-card-type2") {
            return (
              <div key={index}>
                <ul>
                  <li>
                    <img
                      src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
                        card?.image?.data?.attributes?.url
                      }`}
                    />
                  </li>
                  <li>{card.paragraph}</li>
                </ul>
                <Link to={card.buttonLink}>
                  <button>{card.buttonText}</button>
                </Link>
              </div>
            );
          }
        })}
      </section>
    </main>
  );
}
