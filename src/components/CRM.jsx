import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchContacts } from "../features/crm/contactSlice";
import {
  fetchProperties,
  setSelectedContact,
  clearSelectedContact,
} from "../features/crm/propertySlice";
import "./CRM.css"; // Ensure this file is properly linked

const CRM = () => {
  const dispatch = useDispatch();
  const {
    contacts,
    status: contactsStatus,
    error: contactsError,
  } = useSelector((state) => state.contact);
  const {
    properties,
    selectedContact,
    status: propertiesStatus,
    error: propertiesError,
  } = useSelector((state) => state.property);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get isLoggedIn from auth state

  const [filter, setFilter] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      dispatch(fetchContacts(filter));
    }
  }, [filter, isSubmitted, dispatch]);

  useEffect(() => {
    if (selectedContact) {
      dispatch(fetchProperties(selectedContact.id));
    } else {
      dispatch(clearSelectedContact());
    }
  }, [selectedContact, dispatch]);

  const handleFilterChange = (e) => setFilter(e.target.value);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleContactClick = (contact) => {
    dispatch(setSelectedContact(contact));
  };

  const handleAddContact = () => {
    // Add logic to add contact
  };

  const handleAddProperty = () => {
    // Add logic to add property
  };

  const renderContactList = () => (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <li key={contact._id} onDoubleClick={() => handleContactClick(contact)}>
          {contact.lastname}, {contact.firstname}  | {contact.email}  | {contact.phone}
        </li>
      ))}
    </ul>
  );

  const renderPropertyList = () => (
    <ul className="property-list">
      {properties.map((property) => (
        <li key={property._id}>
          {property.address} - {property.details}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="crm-container">
      {isLoggedIn ? (
        <>
          <div className="filter-container">
            <form onSubmit={handleFilterSubmit}>
              <label htmlFor="filter">Select Filter:</label>
              <select id="filter" value={filter} onChange={handleFilterChange}>
                <option value="" disabled>
                  Select your filter
                </option>
                <option value="All">All</option>
                <option value="Lead">Lead</option>
                <option value="Prospect">Prospect</option>
                <option value="Research">Research</option>
                <option value="DNC">DNC</option>
              </select>
              <button type="submit">Get Contacts</button>
            </form>
          </div>
          {isSubmitted && (
            <div className="crm-content">
              <div className="contacts">
                <h2>Contacts</h2>
                {contactsStatus === "loading" ? (
                  <p>Loading...</p>
                ) : (
                  renderContactList()
                )}
                <button type="button" onClick={handleAddContact}>
                  + Add Contact
                </button>
              </div>
              <div className="properties">
                <h2>Properties</h2>
                {selectedContact ? (
                  propertiesStatus === "loading" ? (
                    <p>Loading...</p>
                  ) : (
                    renderPropertyList()
                  )
                ) : (
                  <p>Select a contact to view properties.</p>
                )}
                <button type="button" onClick={handleAddProperty}>
                  + Add Property
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Please Sign in to view this page.</p>
      )}
    </div>
  );
};

export default CRM;
