import axios from 'axios';

const getUserData = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('User'));
    return userData || {};
  } catch (error) {
    console.error("Gagal parse user data dari localStorage:", error);
    return {};
  }
};

const getUserToken = () => {
  return getUserData().token;
};


const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://37.44.244.19/api_desaonline/api' 
  : '/api'; 

// Membuat instance Axios terpusat
const apiClient = axios.create({
  baseURL: baseURL, 
});

// Menambahkan token ke setiap request secara otomatis
apiClient.interceptors.request.use(
  config => {
    const token = getUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiClient;