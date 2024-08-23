import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchContacts,
  updateContact,
  deleteContact,
} from "../features/crm/contactSlice";
import {
  fetchProperties,
  setSelectedContact,
  clearProperties,
} from "../features/crm/propertySlice";
import "./CRM.css"; // Styling file is properly linked

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
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedContact, setEditedContact] = useState(null);
  const [isDoubleClick, setIsDoubleClick] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      dispatch(fetchContacts(filter));
      dispatch(clearProperties());
    }
  }, [filter, isSubmitted, dispatch]);

  useEffect(() => {
    if (selectedContact) {
      // console.log("Selected contact: ", selectedContact);
      dispatch(fetchProperties(selectedContact._id));
    } else {
      dispatch(clearProperties());
    }
  }, [selectedContact, dispatch]);

  const handleFilterChange = (e) => setFilter(e.target.value);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleContactSingleClick = (contact) => {
    setTimeout(() => {
      if (!isDoubleClick) {
        dispatch(setSelectedContact(contact));
      }
    }, 200); // Adjust the delay as needed
  };

  const handleContactDoubleClick = (contact) => {
    setIsDoubleClick(true);
    dispatch(setSelectedContact(contact));
    // Optionally navigate to edit/delete page
  };

  const handleEditClick = (contact) => {
    setIsEditing(true);
    setEditedContact(contact);
  };

  const handleSaveClick = () => {
    // Dispatch action to save the edited contact
    dispatch(updateContact(editedContact));
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteContact(editedContact._id));
    setShowDeleteConfirm(false);
    setIsEditing(false);
    // dispatch(clearProperties()); // Optionally clear properties after delete
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedContact((prev) => ({ ...prev, [name]: value }));
  };

  // Reset double click flag after processing double click
  useEffect(() => {
    if (isDoubleClick) {
      const timer = setTimeout(() => setIsDoubleClick(false), 300); // Reset after short delay
      return () => clearTimeout(timer);
    }
  }, [isDoubleClick]);

  const handleAddContact = () => {
    // Add logic to add contact
  };

  const handleAddProperty = () => {
    // Add logic to add property
  };

  const renderContactList = () => (
    <div className="contact-list">
      {contacts.map((contact) => (
        <div
          className="contact-card"
          key={contact._id}
          onClick={() => handleContactSingleClick(contact)}
        >
          <div>
            <h3>
              Name: {contact.lastname},{contact.firstname}
            </h3>
          </div>
          <p>Contact Type: {contact.contact_type} </p>
          <p>Contact Status: {contact.contact_status} </p>
          <p>Email: {contact.email}</p>
          <p>Phone: {contact.phone} </p>
          <p>Last Contact Date: {contact.last_contact_dt}</p>
          <button onClick={() => handleEditClick(selectedContact)}>Edit</button>
          <button onClick={handleDeleteClick}>Delete</button>
        </div>
      ))}
    </div>
  );

  const renderContactDetails = () => {
    if (!isDoubleClick) return null;

    return (
      <div className="contact-details">
        <h3>Contact Details</h3>
        {isEditing ? (
          <div>
            <label>
              First Name:
              <input
                type="text"
                name="firstname"
                value={editedContact.firstname}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastname"
                value={editedContact.lastname}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={editedContact.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={editedContact.phone}
                onChange={handleInputChange}
              />
            </label>
            <button onClick={handleSaveClick}>Save</button>
          </div>
        ) : (
          <div>
            <p>
              {selectedContact.firstname} {selectedContact.lastname}
            </p>
            <p>{selectedContact.email}</p>
            <p>{selectedContact.phone}</p>
          </div>
        )}
      </div>
    );
  };

  const renderDeleteConfirmation = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div className="delete-confirmation">
        <p>
          Are you sure you want to delete this contact and all associated
          properties?
        </p>
        <button onClick={handleConfirmDelete}>Confirm</button>
        <button onClick={handleCancelDelete}>Cancel</button>
      </div>
    );
  };

  const renderPropertyList = () => (
    <div className="property-list">
      {properties.length > 0 ? (
        properties.map((property) => (
          <div className="prop-card" key={property._id}>
            <div>
              <h3> Address: {property.address} </h3>
            </div>
            <p>City: {property.city} </p>
            <p>State: {property.state} </p>
            <p>Zipcode: {property.zipcode}</p>
            <p>County: {property.county} </p>
            <p>Parcel Number: {property.parcelNumber}</p>
            <p>Year Built: {property.yearBuilt}</p>
            <p>Property Type: {property.propertyType}</p>
            <button onClick={() => handleEditClick(selectedContact)}>
              Edit
            </button>
            <button onClick={handleDeleteClick}>Delete</button>
          </div>
        ))
      ) : (
        <li>No properties found</li>
      )}
    </div>
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
                <button
                    className="add-btn"
                    type="button"
                    onClick={handleAddContact}
                  >  + Add Contact
                     </button>
                <p>Select a contact to view properties.</p>            
            
                
                {contactsStatus === "loading" ? (
                  <p>Loading...</p>
                ) : contactsStatus === "failed" ? (
                  <p>Error loading contacts: {contactsError}</p>
                ) : (
                  renderContactList()
                )}
              </div>
              <div className="properties">
                <h2>Properties</h2>
                <button
                  className="add-btn"
                  type="button"
                  onClick={handleAddProperty}
                >
                  + Add Property
                </button>
                {selectedContact ? (
                  propertiesStatus === "loading" ? (
                    <p>Loading...</p>
                  ) : propertiesStatus === "failed" ? (
                    <p>Error loading properties: {propertiesError}</p>
                  ) : (
                    renderPropertyList()
                  )
                ) : (
                  <p>Select a contact to view properties.</p>
                )}
              </div>
              {renderContactDetails()}
              {renderDeleteConfirmation()}
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
