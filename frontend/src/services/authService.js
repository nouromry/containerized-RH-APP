import api from './api';

/**
 * Sends a POST request to log in a user.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} The response data, including token and user info.
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Sends a POST request to register a new user.
 * @param {object} userData - { name, email, password, role }
 * @returns {Promise<object>} The response data, including token and user info.
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};