import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate for redirection
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [activeLink, setActiveLink] = useState(null);

  // Handle Logout
  const handleLogout = (event) => {
    event.preventDefault();
    // console.log("Logging out...");
    dispatch(logout());
    // Redirect to login page
    navigate("/login");
  };

  const menuLinks = [
    { text: "home", href: "/" },
    {
      text: "about me",
      href: "/about",
    },
    {
      text: "services",
      href: "#",
      subLinks: [
        { classname: "listings", text: "listings", href: "/listings" },
      ],
    },
    {
      text: "account",
      href: "#",
      subLinks: isLoggedIn
        ? [
            {
              classname: "signout",
              text: "Sign-Out",
              href: "#",
              onClick: handleLogout,
            },
          ]
        : [{ classname: "signin", text: "Sign-In", href: "/login" }],
    },
  ];

  const handleMenuClick = (event, link) => {
    if (link.subLinks) {
      event.preventDefault();
      setActiveLink(activeLink === link.text ? null : link.text);
    } else {
      // Allow default navigation for links without sublinks
      setActiveLink(null);
    }
  };

  const renderSubMenu = (subLinks) => (
    <nav id="sub-menu" className="sub-menu flex-around">
      {subLinks.map((subLink) => (
        <Link
          key={subLink.text}
          to={subLink.href}
          className={subLink.classname}
          onClick={subLink.onClick} // Make sure this is handled correctly
        >
          {subLink.text}
        </Link>
      ))}
    </nav>
  );

  return (
    <header>
      <nav id="top-menu" className="top-menu flex-around">
        {menuLinks.map((link) => (
          <div key={link.text} className="menu-item">
            <Link
              to={link.href}
              onClick={(event) => handleMenuClick(event, link)}
              className={activeLink === link.text ? "active" : ""}
            >
              {link.text}
            </Link>
            {activeLink === link.text &&
              link.subLinks &&
              renderSubMenu(link.subLinks)}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
