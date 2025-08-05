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

const apiClient = axios.create({
  baseURL: '/api/api', 
});

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