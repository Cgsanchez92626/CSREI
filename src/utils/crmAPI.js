const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchContactsApi = async (filter, agentId) => {
  const response = await fetch(`${API_BASE_URL}/api/contacts?filter=${filter}&agentId=${agentId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Failed to fetch contacts');
  }

  return response.json();
};

export const fetchPropertiesApi = async (contactId) => {
  const response = await fetch(`${API_BASE_URL}/api/properties?contactId=${contactId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Failed to fetch properties');
  }

  return response.json();
};