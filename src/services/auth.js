
import apiClient from './users'; 

// const AUTH_URL = '/api/api/auth'; 

export const login = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append('email', email);      
    formData.append('password', password);

    // baseURL ('http://.../api_desaonline') akan ditambahkan secara otomatis
    const response = await apiClient.post('/auth', formData);
    
    return response.data;
  } catch (error) {
    console.error("Error during login:", error); 
    throw error;
  }
};
