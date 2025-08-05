import axios from "axios";

const AUTH_URL = '/api/api/auth';

export const login = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append('email', email);      
    formData.append('password', password);

    // console.log("Request URL:", AUTH_URL); 

    const response = await axios.post(AUTH_URL, formData);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error); 
    throw error;
  }
};
