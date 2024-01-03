// AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:1337'; // Replace with your Strapi API URL

const AuthService = {
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/local`, {
      identifier: username,
      password: password,
    });

    // Store the JWT token in localStorage or a secure storage method
    localStorage.setItem('jwt', response.data.jwt);
    return response.data.user;
  },

  logout: () => {
    // Remove the JWT token on logout
    localStorage.removeItem('jwt');
  },
};

export default AuthService;
