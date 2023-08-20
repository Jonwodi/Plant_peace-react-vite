import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Nav.scss";

export default function Nav() {
  // create state variables
  const [logo, setLogo] = useState({});
  const [links, setLinks] = useState([]);
  const [icons, setIcons] = useState([]);

  const getNavData = async () => {
    try {
      // use axios to get data from the backend
      const response = await axios.get(
        `${import.meta.env.VITE_STRAPI_BASE_URL}/api/nav`,
        {
          params: {
            "populate[Logo][populate][image]": true,
            "populate[NavLinks]": true,
            "populate[NavIcons][populate][image]": true,
          },
        }
      );

      // destructure the data
      const { Logo, NavLinks, NavIcons } = response?.data?.data?.attributes;

      setLogo(Logo);
      setLinks(NavLinks);
      setIcons(NavIcons);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getNavData(); // calling the function
  }, []); // empty array means it will only run once

  return (
    <nav className="nav">
      <Link to={logo.url} className="nav__logo">
        <img
          src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
            logo?.image?.data?.attributes?.url
          }`}
        />
        <h4>{logo?.title}</h4>
      </Link>

      <ul className="nav__middleBlock">
        {links?.map((link) => (
          <li key={link.id}>
            <Link to={link.url}>{link.title}</Link>
          </li>
        ))}
      </ul>

      <div className="nav__lastBlock">
        {icons.map((icon) => (
          <Link key={icon.id} to={icon.url}>
            <img
              src={`${import.meta.env.VITE_STRAPI_BASE_URL}${
                icon?.image?.data?.attributes?.url
              }`}
            />
          </Link>
        ))}
      </div>
    </nav>
  );
}
