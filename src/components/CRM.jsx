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
  addProperty,
} from "../features/crm/propertySlice";
import "./CRM.css"; // Styling file is properly linked
import * as validators from '../utils/validators';

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
  const [newProperty, setNewProperty] = useState({
    address: "",
    city: "",
    state: "",
    zipcode: "",
    county: "",
    parcelNumber: "",
    yearBuilt: "",
    propertyType: "",
  });

  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
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
  const [deleteContactId, setDeleteContactId] = useState(null); // New state for delete action
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // console.log("isSubmitted: ", isSubmitted);
    // console.log("Selected contact: ", selectedContact);
    if (isSubmitted) {
      dispatch(fetchContacts(filter));
      dispatch(clearProperties());
    }
  }, [filter, isSubmitted, dispatch]);

  useEffect(() => {
    if (selectedContact) {
      dispatch(fetchProperties(selectedContact._id));
    } else {
      dispatch(clearProperties());
    }
  }, [selectedContact, dispatch]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value); // Update the filter value
    setSelectedContact(null); // Clear selectedCOntact
    setIsSubmitted(false); // Reset isSubmitted when filter changes
    localStorage.removeItem(`properties}`);
    localStorage.removeItem(`contacts}`);
    localStorage.removeItem(`selectedContact}`);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setSelectedContact(null); // Clear selectedCOntact
    setIsSubmitted(true);
  };

  const handleContactSingleClick = (contact) => {
    dispatch(setSelectedContact(contact));
  };

  const handleNewContactChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setNewContact((prevState) => ({
        ...prevState,
        [name]: validators.formatPhoneNumber(value), // Format phone number
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
    const newErrors = {};

    // Validate firstname
    if (!validators.isNonEmptyString(newContact.firstname)) {
      newErrors.firstname = "First Name is required";
    }
    // Validate lastname
    if (!validators.isNonEmptyString(newContact.lastname)) {
      newErrors.lastname = "Last Name is required";
    }

    // Validate email
    if (!validators.isValidEmail(newContact.email)) {
      newErrors.email = "If present, Email must have proper pattern";
    }

    // Validate phone
    if (!validators.isValidPhone(newContact.phone)) {
      newErrors.phone =
        "If present, Phone must be in the format 999-999-999 or 9-999-999-9999";
    }

    // Validate contactStatus
    if (!validators.isNonEmptyString(newContact.contact_status)) {
      newErrors.contact_status = "Please select, Contact Status is required";
    }

    if (Object.keys(newErrors).length === 0) {
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
        setValidationErrors({}); // Clear validation errors
      } else {
        console.error("Agent ID is missing");
      }
    } else {
      // Set validation errors to state for display
      setValidationErrors(newErrors);
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
        [name]: validators.formatPhoneNumber(value), // Format phone number
      }));
    } else {
      setEditedContact((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setIsFormTouched(true); // Mark form as touched
  };

  const handleEditClick = (contact) => {
    setEditedContactId(contact._id);
    setEditedContact(contact);
  };

  const handleEditContactSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (isFormTouched) {
      // Validate firstname
      if (!validators.isNonEmptyString(editedContact.firstname)) {
        newErrors.firstname = "First Name is required";
      }
      // Validate lastname
      if (!validators.isNonEmptyString(editedContact.lastname)) {
        newErrors.lastname = "Last Name is required";
      }

      // Validate email
      if (!validators.isValidEmail(editedContact.email)) {
        newErrors.email = "If present, Email must have proper pattern";
      }

      // Validate phone
      if (!validators.isValidPhone(editedContact.phone)) {
        newErrors.phone =
          "If present, Phone must be in the format 999-999-999 or 9-999-999-9999";
      }

      // Validate contactStatus
      if (!validators.isNonEmptyString(editedContact.contact_status)) {
        newErrors.contact_status = "Please select, Contact Status is required";
      }

      if (Object.keys(newErrors).length === 0) {
        // console.log("Submitting contact:", editedContact); // Adding this to debug

        const agent = localStorage.getItem("agentId");
        if (agent) {
          const formattedDate = validators.formatDate(editedContact.last_contact_dt);
          const contactWithAgent = {
            ...editedContact,
            agent,
            last_contact_dt: formattedDate,
          };
          // console.log("contactWithAgent: ", contactWithAgent);
          // Dispatch action to save the edited contact
          dispatch(updateContact(contactWithAgent));
          setEditedContactId(null);
          setValidationErrors({}); // Clear validation errors
        } else {
          console.error("Agent ID is missing");
        }
      } else {
        // Set validation errors to state for display
        setValidationErrors(newErrors);
      }
    }
  };

  const handleDeleteClick = (contactId) => {
    if (contactId) {
      setDeleteContactId(contactId); // Set the ID of the contact to be deleted
      setShowDeleteConfirm(true); // Show the confirmation dialog
    } else {
      console.error("No contact ID provided for deletion");
    }
  };

  const handleConfirmDelete = () => {
    if (deleteContactId) {
      dispatch(deleteContact(deleteContactId))
        .unwrap() // Ensure to handle promise resolution or rejection
        .then(() => {
          setShowDeleteConfirm(false);
          setDeleteContactId(null);
          localStorage.removeItem(`contact_${deleteContactId}`);
          dispatch(clearProperties()); // clear properties after delete
        })
        .catch((error) => {
          console.error("Failed to delete contact: ", error);
        });
    } else {
      console.error("No contact selected for deletion");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleNewPropertyChange = (e) => {
    const { name, value } = e.target;
    if (name === "parcelNumber") {
      setNewProperty((prevState) => ({
        ...prevState,
        [name]: validators.formatParcelNumber(value), // Format parcelNumber number
      }));
    } else {
      setNewProperty((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddPropertySubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate address
    if (!validators.isNonEmptyString(newProperty.address)) {
      newErrors.address = "Address is required";
    }

    // Validate city
    if (
      !validators.isNonEmptyString(newProperty.city) ||
      !/^[A-Za-z\s-]+$/.test(newProperty.city)
    ) {
      newErrors.city =
        "City is required and can only contain letters, spaces, or hyphens";
    }

    // Validate state
    if (!validators.validateState(newProperty.state)) {
      newErrors.state = "State is required and must be a 2-letter abbreviation";
    }

    // Validate zipcode
    if (!validators.validateZipcode(newProperty.zipcode)) {
      newErrors.zipcode =
        "Zipcode is required and must be in the format 12345 or 12345-6789";
    }

    // Validate county
    if (
      validators.isNonEmptyString(newProperty.county) &&
      !/^[A-Za-z\s-]+$/.test(newProperty.county)
    ) {
      newErrors.county = "County can only contain letters, spaces, or hyphens";
    }

    // Validate parcel number
    if (!validators.validateParcelNumber(newProperty.parcelNumber)) {
      newErrors.parcelNumber =
        "Parcel number must be in the format 9999-999-999";
    }

    // Validate year built
    if (!validators.validateYearBuilt(newProperty.yearBuilt)) {
      newErrors.yearBuilt = "Year built must be a 4-digit number";
    }

    // Validate contactStatus
    if (!validators.isNonEmptyString(newProperty.propertyType)) {
      newErrors.propertyType = "Please select, Property Type is required";
    }

    if (Object.keys(newErrors).length === 0) {
      // console.log("Submitting Property:", newProperty); // Adding this to debug
      const contact = selectedContact._id;
      // console.log("contactId: ", contact);
      if (contact) {
        const propertyWithContact = { ...newProperty, contact };
        dispatch(addProperty(propertyWithContact)); // Dispatch action to add property
        setShowAddPropertyForm(false);
        setNewProperty({
          address: "",
          city: "",
          state: "",
          zipcode: "",
          county: "",
          parcelNumber: "",
          yearBuilt: "",
          propertyType: "",
        });
        setValidationErrors({}); // Clear validation errors
      } else {
        console.error("Contact ID is missing");
      }
    } else {
      // Set validation errors to state for display
      setValidationErrors(newErrors);
    }
  };

  const renderContactList = () => {
    // Find Admin contact for status check
    const adminContact = contacts.find(
      (contact) => contact.contact_status === "Admin"
    );

    return (
      <div className="contact-list">
        {contacts.length === 0 ? (
          <p>No contacts found</p>
        ) : (
          contacts.map((contact) => (
            <div
              className={`contact-card ${
                contact === selectedContact ? "selectedContact" : ""
              }`}
              key={contact._id}
              onClick={() => handleContactSingleClick(contact)}
            >
              <div>
                <h3>
                  Name: {contact.lastname}, {contact.firstname}
                </h3>
              </div>
              <p>Contact Type: {contact.contact_type}</p>
              <p>Contact Status: {contact.contact_status}</p>
              <p>Email: {contact.email}</p>
              <p>Phone: {contact.phone}</p>
              <p>Last Contact Date: {validators.formatDate(contact.last_contact_dt)}</p>
              <button onClick={() => handleEditClick(contact)}>Edit</button>
              <button
                onClick={() => handleDeleteClick(contact._id)}
                disabled={contact.contact_status === "Admin"}
              >
                Delete
              </button>
              {editedContactId === contact._id && renderEditContactForm()}
            </div>
          ))
        )}
        {renderDeleteConfirmation()}{" "}
        {/* Include renderDeleteConfirmation here */}
      </div>
    );
  };

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
            {validationErrors.firstname && (
              <p className="error">{validationErrors.firstname}</p>
            )}
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastname"
              value={newContact.lastname}
              onChange={handleNewContactChange}
            />
            {validationErrors.lastname && (
              <p className="error">{validationErrors.lastname}</p>
            )}
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newContact.email}
              onChange={handleNewContactChange}
            />
            {validationErrors.email && (
              <p className="error">{validationErrors.email}</p>
            )}
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={newContact.phone}
              onChange={handleNewContactChange}
            />
            {validationErrors.phone && (
              <p className="error">{validationErrors.phone}</p>
            )}
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
            {validationErrors.contact_status && (
              <p className="error">{validationErrors.contact_status}</p>
            )}
          </label>
          <button type="submit">Add Contact</button>
          <button type="button" onClick={() => setShowAddContactForm(false)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );

  const renderEditContactForm = () => {
    // Determine if the contact being edited is "Admin"
    const isAdmin = editedContact.contact_status === "Admin";

    return (
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
                required
              />
              {validationErrors.firstname && (
                <p className="error">{validationErrors.firstname}</p>
              )}
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastname"
                value={editedContact.lastname}
                onChange={handleEditContactChange}
                required
              />
              {validationErrors.lastname && (
                <p className="error">{validationErrors.lastname}</p>
              )}
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={editedContact.email}
                onChange={handleEditContactChange}
              />
              {validationErrors.email && (
                <p className="error">{validationErrors.email}</p>
              )}
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={editedContact.phone}
                onChange={handleEditContactChange}
              />
              {validationErrors.phone && (
                <p className="error">{validationErrors.phone}</p>
              )}
            </label>
            <label>
              Contact Status:
              <select
                name="contact_status"
                value={editedContact.contact_status}
                onChange={handleEditContactChange}
                disabled={isAdmin} // Conditionally disable the select field
                required
              >
                <option value="" disabled>
                  Select the Status
                </option>
                <option value="Lead">Lead</option>
                <option value="Prospect">Prospect</option>
                <option value="Research">Research</option>
                <option value="DNC">DNC</option>
              </select>
              {validationErrors.contact_status && (
                <p className="error">{validationErrors.contact_status}</p>
              )}
            </label>
            <label>
              Last Contact Date:
              <input
                type="date"
                name="last_contact_dt"
                value={validators.convertToDateForInput(editedContact.last_contact_dt)}
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
  };

  const renderDeleteConfirmation = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div className="modal-overlay">
        <div className="delete-confirmation modal-content">
          <p>
            Are you sure you want to delete this contact, any associated
            properties will be re-assigned to Admin?
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
          </div>
        ))
      ) : (
        <li>No properties found</li>
      )}
    </div>
  );

  const renderAddPropertyForm = () => (
    <div className="modal-overlay">
      <div className="add-property-form modal-content">
        <h3>Add New Property</h3>
        <form onSubmit={handleAddPropertySubmit}>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={newProperty.address}
              onChange={handleNewPropertyChange}
            />
            {validationErrors.address && (
              <p className="error">{validationErrors.address}</p>
            )}
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={newProperty.city}
              onChange={handleNewPropertyChange}
            />
            {validationErrors.city && (
              <p className="error">{validationErrors.city}</p>
            )}
          </label>
          <label>
            State:
            <input
              type="text"
              name="state"
              value={newProperty.state}
              onChange={handleNewPropertyChange}
            />
            {validationErrors.state && (
              <p className="error">{validationErrors.state}</p>
            )}
          </label>
          <label>
            Zipcode:
            <input
              type="text"
              name="zipcode"
              value={newProperty.zipcode}
              onChange={handleNewPropertyChange}
            />
            {validationErrors.zipcode && (
              <p className="error">{validationErrors.zipcode}</p>
            )}
          </label>
          <label>
            County:
            <input
              type="text"
              name="county"
              value={newProperty.county}
              onChange={handleNewPropertyChange}
            />
            {validationErrors.county && (
              <p className="error">{validationErrors.county}</p>
            )}
          </label>
          <label>
            Parcel Number:
            <input
              type="text"
              name="parcelNumber"
              value={newProperty.parcelNumber}
              onChange={handleNewPropertyChange}
            />
            {validationErrors.parcelNumber && (
              <p className="error">{validationErrors.parcelNumber}</p>
            )}
          </label>
          <label>
            Year Built:
            <input
              type="text"
              name="yearBuilt"
              value={newProperty.yearBuilt}
              onChange={handleNewPropertyChange}
            />
            {validationErrors.yearBuilt && (
              <p className="error">{validationErrors.yearBuilt}</p>
            )}
          </label>
          <label>
            Property Type:
            <select
              name="propertyType"
              value={newProperty.propertyType}
              onChange={handleNewPropertyChange}
            >
              <option value="" disabled>
                Select the Property Type
              </option>
              <option value="Single-Family">Single-Family</option>
              <option value="Multi-Family">Multi-Family</option>
              <option value="Mix-Use">Mix-Use</option>
            </select>
            {validationErrors.propertyType && (
              <p className="error">{validationErrors.propertyType}</p>
            )}
          </label>
          <button type="submit">Add Property</button>
          <button type="button" onClick={() => setShowAddPropertyForm(false)}>
            Cancel
          </button>
        </form>
      </div>
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
                  Select your Contact Type
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
                {selectedContact ? (
                  <>
                    <button
                      className="add-btn"
                      type="button"
                      onClick={() => setShowAddPropertyForm(true)}
                    >
                      + Add Property
                    </button>
                    {showAddPropertyForm && renderAddPropertyForm()}
                    {propertiesStatus === "loading" ? (
                      <p>Loading...</p>
                    ) : propertiesStatus === "failed" ? (
                      <p>Error loading properties: {propertiesError}</p>
                    ) : (
                      renderPropertyList()
                    )}
                  </>
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
