import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Footer.scss";

export default function Footer() {
  const [leftBlock, setLeftBlock] = useState({});
  const [logo, setLogo] = useState({});
  const [footerLinks, setFooterLinks] = useState([]);

  const getFooterData = async () => {
    try {
      // use axios to get data from the backend
      const response = await axios.get(
        `${import.meta.env.VITE_STRAPI_BASE_URL}/api/footer`,
        {
          params: {
            "populate[footerLeftBlock]": true,
            "populate[logo]": true,
            "populate[footerLinks][populate][links]": true,
          },
        }
      );

      setLeftBlock(response?.data?.data?.attributes?.footerLeftBlock);
      setLogo(response?.data?.data?.attributes?.logo);
      setFooterLinks(response?.data?.data?.attributes?.footerLinks);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getFooterData(); // calling the function
  }, []); // empty array means it will only run once

  return (
    <main className="footer">
      <section className="footer__blocks">
        <div className="Lblock">
          <h1>{leftBlock.heading}</h1>
          <ul>
            <li>
              <Link to={`mailto:${leftBlock.email}`}>{leftBlock.email}</Link>
            </li>
            <li>
              <Link to={`tel:${leftBlock.phoneNumber}`}>
                {leftBlock.phoneNumber}
              </Link>
            </li>
          </ul>
        </div>

        <div className="Rblock">
          {footerLinks.map((component) => (
            <ul key={component.id}>
              <h2>{component.heading}</h2>
              {component.links.map((li) => (
                <li key={li.id}>
                  <Link to={li.linkPath}>{li.linkText}</Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      <div className="footer__bottomLine">
        <img
          src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
            logo?.data?.attributes?.url
          }`}
        />
        <p>Copyrights. All rights reserved.</p>
      </div>
    </main>
  );
}
