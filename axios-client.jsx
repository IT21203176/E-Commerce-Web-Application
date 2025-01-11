import axios from "axios";
import Cookies from "js-cookie";
const axiosClient = axios.create({
  // baseURL: `https://localhost:44305/api/`,  // Base URL for API requests
  baseURL: `http://localhost:1000/api/`, // Base URL for live API requests

  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from all origins (change this as needed)
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE", // Allow specific HTTP methods
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept", // Allow specific headers
  },
});

// Interceptor for processing requests before they are sent
axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("_auth");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor for processing responses or handling errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    try {
      const { response } = error;
      if (response.status === 401) {
        Cookies.remove("_auth"); // Remove the auth token from cookies
        localStorage.setItem(
          "TOKEN_EXPIRE",
          "Your login has expired. Please log in again to continue."
        );
        // Redirect to login page or perform any other action, like logging the user out
        let baseURL = window.location.origin;
        let fullPath = window.location.href;
        let pathAfterBaseURL = fullPath.substring(baseURL.length);
        if (pathAfterBaseURL !== "/login") {
          window.location.href = "/login";
        }
      }
    } catch (error) {
      console.error(error);
    }

    throw error;
  }
);

export default axiosClient;
