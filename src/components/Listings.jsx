import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../features/properties/propertySlice";
import "./Listings.css";

const ITEMS_PER_PAGE = 6; // Number of items to display per page

const Listings = () => {
  const [zipCode, setZipCode] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track form submission
  const dispatch = useDispatch();
  const properties = useSelector((state) => state.properties.list);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    // Future logic here to handle other side effects
  }, [properties]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (zipCode) {
      dispatch(fetchProperties(zipCode));
      setIsSubmitted(true); // Set to true once the form is submitted
    }
  };

  const handleArrowClick = (direction) => {
    const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) return; // No pagination needed if there's only one page

    setCurrentPage((prevPage) => {
      if (direction === "next") {
        return (prevPage + 1) % totalPages; // Move to the next page or wrap around
      } else {
        return (prevPage - 1 + totalPages) % totalPages; // Move to the previous page or wrap around
      }
    });
  };

  const currentProperties = properties.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <main>
      {isLoggedIn ? (
        <div>
          <div className="zip-container">
            <input
              type="text"
              placeholder="Enter zip code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
          {isSubmitted && (
            <div className="carousel-container">
              <div className="carousel">
                {currentProperties.length > 0 ? (
                  currentProperties.map((property, index) => (
                    <div className="property-card" key={index}>
                      <img src={property.imgSrc} alt={property.address} />
                      <div className="details">
                        <h3>{property.address}</h3>
                        <p>Status: {property.listingStatus}</p>
                        <p>Price: ${property.price.toLocaleString()}</p>
                        <p>Type: {property.propertyType}</p>
                        <a
                          href={`https://www.zillow.com${property.detailUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Full Details
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No properties found.</p>
                )}
              </div>
              <button
                className="prev-btn"
                onClick={() => handleArrowClick("prev")}
              >
                ‹ Previous
              </button>
              <button
                className="next-btn"
                onClick={() => handleArrowClick("next")}
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Please Sign in to view this page.</p>
      )}
    </main>
  );
};

export default Listings;
