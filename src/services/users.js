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


// Menggunakan variabel untuk membedakan URL development dan production.
// Saat 'npm run serve', akan menggunakan '/api' (untuk proxy).
// Saat 'npm run build', akan menggunakan URL server yang sebenarnya.

// const apiClient = axios.create({
//   baseURL: '/api/api', 
// });

const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://37.44.244.19/api_desaonline'
  : '/api';

const apiClient = axios.create({
  baseURL: baseURL, 
});
// -------------------------

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
