const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchContactsApi = async (filter, agentId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/contacts?filter=${filter}&agentId=${agentId}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || "Failed to fetch contacts");
  }

  return response.json();
};

export const addContactApi = async (newContact) => {
  const response = await fetch(`${API_BASE_URL}/api/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContact),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || "Failed to add contact");
  }

  return response.json();
};

export const updateContactApi = async (contact) => {
  console.log("Updating contact:", contact);
  const response = await fetch(`${API_BASE_URL}/api/contacts/${contact._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Ensure the content type is set correctly
    },
    body: JSON.stringify(contact), // Convert the contact object to JSON
  });

  console.log("Response Status:", response.status); // Log response status
  console.log("Response Body:", await response.clone().json()); // Log response body

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Update error:", errorData); // Debug log
    throw new Error(errorData.msg || "Failed to update contact");
  }

  return response.json();
};

export const deleteContactApi = async (contactId) => {
  if (!contactId) {
    throw new Error("Invalid contact ID");
  }
  console.log("Deleting contactId:", contactId);
  const response = await fetch(`${API_BASE_URL}/api/contacts/${contactId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || "Failed to delete contact");
  }
};
export const fetchPropertiesApi = async (contactId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/properties?contactId=${contactId}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || "Failed to fetch properties");
  }

  return response.json();
};
