import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchContacts,
  addContact,
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
  const [newContact, setNewContact] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    contact_type: "Owner",
    contact_status: "",
  });
  const [showAddContactForm, setShowAddContactForm] = useState(false);

  const [editedContactId, setEditedContactId] = useState(null);
  const [editedContact, setEditedContact] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    contact_type: "Owner",
    contact_status: "",
    last_contact_dt: "",
  });

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get isLoggedIn from auth state

  const [filter, setFilter] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    dispatch(setSelectedContact(contact));
  };

  const formatPhoneNumber = (phone) => {
    // Remove non-numeric characters
    const cleaned = ("" + phone).replace(/\D/g, "");
    // Check the length of cleaned phone number
    const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}-${match[4]}`;
    }
    const match2 = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match2) {
      return `${match2[1]}-${match2[2]}-${match2[3]}`;
    }
    return phone; // Return the original phone if it doesn't match the pattern
  };

  const convertToDateForInput = (date) => {
    if (!date) return "";
    const [month, day, year] = date.split("-").map(Number);
    return `${year}-${("0" + month).slice(-2)}-${("0" + day).slice(-2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2); // Months are zero-based
    const day = `0${d.getDate()}`.slice(-2);
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const handleNewContactChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setNewContact((prevState) => ({
        ...prevState,
        [name]: formatPhoneNumber(value), // Format phone number
      }));
    } else {
      setNewContact((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddContactSubmit = (e) => {
    e.preventDefault();
    // console.log("Submitting contact:", newContact); // Adding this to debug
    const agent = localStorage.getItem("agentId");
    if (agent) {
      const contactWithAgent = { ...newContact, agent };
      dispatch(addContact(contactWithAgent)); // Dispatch action to add contact
      setShowAddContactForm(false);
      setNewContact({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        contact_type: "Owner",
        contact_status: "",
      });
    } else {
      console.error("Agent ID is missing");
    }
  };

  const handleEditContactChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is a date field
    if (name === "last_contact_dt") {
      // Convert the date format from yyyy-mm-dd to mm-dd-yyyy
      const [year, month, day] = value.split("-").map(Number);
      const formattedDate = `${("0" + month).slice(-2)}-${("0" + day).slice(
        -2
      )}-${year}`;
      setEditedContact((prevState) => ({
        ...prevState,
        [name]: formattedDate,
      }));
    } else if (name === "phone") {
      setEditedContact((prevState) => ({
        ...prevState,
        [name]: formatPhoneNumber(value), // Format phone number
      }));
    } else {
      setEditedContact((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleEditClick = (contact) => {
    setEditedContactId(contact._id);
    setEditedContact(contact);
  };

  const handleEditContactSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting contact:", editedContact); // Adding this to debug

    const agent = localStorage.getItem("agentId");
    if (agent) {
      const formattedDate = formatDate(editedContact.last_contact_dt);
      const contactWithAgent = {
        ...editedContact,
        agent,
        last_contact_dt: formattedDate,
      };
      console.log("contactWithAgent: ", contactWithAgent);
      // Dispatch action to save the edited contact
      dispatch(updateContact(contactWithAgent));
      setEditedContactId(null);
    } else {
      console.error("Agent ID is missing");
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteContact(editedContact._id));
    setShowDeleteConfirm(false);
    setEditedContactId(null);
    dispatch(clearProperties()); // clear properties after delete
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
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
          <p>Last Contact Date: {formatDate(contact.last_contact_dt)}</p>
          <button onClick={() => handleEditClick(contact)}>Edit</button>
          <button onClick={handleDeleteClick}>Delete</button>
          {editedContactId === contact._id && renderEditContactForm()}
          {renderDeleteConfirmation()}
        </div>
      ))}
    </div>
  );

  const renderAddContactForm = () => (
    <div className="modal-overlay">
      <div className="add-contact-form modal-content">
        <h3>Add New Contact</h3>
        <form onSubmit={handleAddContactSubmit}>
          <label>
            First Name:
            <input
              type="text"
              name="firstname"
              value={newContact.firstname}
              onChange={handleNewContactChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastname"
              value={newContact.lastname}
              onChange={handleNewContactChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newContact.email}
              onChange={handleNewContactChange}
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={newContact.phone}
              onChange={handleNewContactChange}
            />
          </label>
          <label>
            Contact Status:
            <select
              name="contact_status"
              value={newContact.contact_status}
              onChange={handleNewContactChange}
            >
              <option value="" disabled>
                Select the Status
              </option>
              <option value="Lead">Lead</option>
              <option value="Prospect">Prospect</option>
              <option value="Research">Research</option>
              <option value="DNC">DNC</option>
            </select>
          </label>
          <button type="submit">Add Contact</button>
          <button type="button" onClick={() => setShowAddContactForm(false)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );

  const renderEditContactForm = () => (
    <div className="modal-overlay">
      <div className="edit-contact-form modal-content">
        <h3>Edit Contact</h3>
        <form onSubmit={handleEditContactSubmit}>
          <label>
            First Name:
            <input
              type="text"
              name="firstname"
              value={editedContact.firstname}
              onChange={handleEditContactChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastname"
              value={editedContact.lastname}
              onChange={handleEditContactChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={editedContact.email}
              onChange={handleEditContactChange}
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={editedContact.phone}
              onChange={handleEditContactChange}
            />
          </label>
          <label>
            Contact Status:
            <select
              name="contact_status"
              value={editedContact.contact_status}
              onChange={handleEditContactChange}
            >
              <option value="" disabled>
                Select the Status
              </option>
              <option value="Lead">Lead</option>
              <option value="Prospect">Prospect</option>
              <option value="Research">Research</option>
              <option value="DNC">DNC</option>
            </select>
          </label>
          <label>
            Last Contact Date:
            <input
              type="date"
              name="last_contact_dt"
              value={convertToDateForInput(editedContact.last_contact_dt)}
              onChange={handleEditContactChange}
            />
          </label>
          <button type="submit">Save Contact</button>
          <button type="button" onClick={() => setEditedContactId(null)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );

  const renderDeleteConfirmation = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div className="modal-overlay">
        <div className="delete-confirmation modal-content">
          <p>
            Are you sure you want to delete this contact and all associated
            properties?
          </p>
          <button onClick={handleConfirmDelete}>Confirm</button>
          <button onClick={handleCancelDelete}>Cancel</button>
        </div>
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
            <button onClick={() => handlePropEditClick(selectedProperty)}>
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
                  onClick={() => setShowAddContactForm(true)}
                >
                  + Add Contact
                </button>
                {showAddContactForm && renderAddContactForm()}
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
