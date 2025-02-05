import axios from "axios";

const HOST_API = import.meta.env.VITE_HOST_API;
const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;


// ----------------------------------------------------------------------

export const fetcher = async (args) => {
    const [url, config] = Array.isArray(args) ? args : [args];
  
    const res = await axiosInstance.get(url, { ...config });
  
    return res.data;
  };
  
  // ----------------------------------------------------------------------
  

  export const endpoints = {
    auth: {
      me: '/api/me',
      login: '/api/login',
      logout: '/api/logout',
    //   register: '/api/daftar',
    },
  };