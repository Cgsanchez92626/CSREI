import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchContacts,
  fetchProperties,
  setSelectedContact,
  clearSelectedContact,
} from "../features/crm/crmSlice";
import "./CRM.css"; // Add appropriate styles

const CRM = () => {
  const dispatch = useDispatch();
  const { contacts, properties, selectedContact, status, error } = useSelector(
    (state) => state.crm
  );
  const [filter, setFilter] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // State to manage form submission
  
  useEffect(() => {
    if (filter && isSubmitted) {
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
    setIsSubmitted(true); // Set form submission state to true
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
        <li key={contact.id} onDoubleClick={() => handleContactClick(contact)}>
          {contact.lastname}, {contact.firstname} - {contact.phone}
        </li>
      ))}
    </ul>
  );

  const renderPropertyList = () => (
    <ul className="property-list">
      {properties.map((property) => (
        <li key={property.id}>
          {property.address} - {property.details}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="crm-container">
      {!isSubmitted ? (
        <div className="filter-container">
          <form onSubmit={handleFilterSubmit}>
            <label htmlFor="filter">Select Filter:</label>
            <select id="filter" value={filter} onChange={handleFilterChange}>
              <option value="">Select...</option>
              <option value="All">All</option>
              <option value="Lead">Lead</option>
              <option value="Prospect">Prospect</option>
              <option value="Research">Research</option>
              <option value="DNC">DNC</option>
            </select>
            <button type="submit">Filter</button>
          </form>
        </div>
      ) : (
        <div className="crm-content">
          <div className="contacts">
            <h2>Contacts</h2>
            {status === "loading" ? <p>Loading...</p> : renderContactList()}
            <button type="button" onClick={handleAddContact}>
              + Add Contact
            </button>
          </div>
          <div className="properties">
            <h2>Properties</h2>
            {selectedContact ? (
              renderPropertyList()
            ) : (
              <p>Select a contact to view properties.</p>
            )}
            <button type="button" onClick={handleAddProperty}>
              + Add Property
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;
