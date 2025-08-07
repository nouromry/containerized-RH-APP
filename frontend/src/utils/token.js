/**
 * Retrieves the JWT token from localStorage.
 * @returns {string|null} The token or null if not found.
 */
export const getToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Stores the JWT token in localStorage.
 * @param {string} token The token to store.
 */
export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Removes the JWT token from localStorage.
 */
export const removeToken = () => {
  localStorage.removeItem('authToken');
};