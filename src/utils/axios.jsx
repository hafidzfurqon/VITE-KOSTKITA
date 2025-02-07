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
      register: '/api/register',
    },
    user : {
      list : '/api/admin/users/list',
      detail : '/api/admin/users/detail', //need id here
      create : '/api/admin/users/create',
      update : '/api/admin/users/update',
      update : '/api/admin/users/update_user_password', // need id here
    },
    banner : {
      list : '/api/admin/banner/list',
      detail : '/api/admin/banner/detail', //need id here
      create : '/api/admin/banner/create',
      update : '/api/admin/banner/update', //need id here
      delete : '/api/admin/banner/delete', //need id here
    },
    property : {
      list : '/api/admin/property/list',
      detail : '/api/admin/property/detail/id', //need id here
      detail : '/api/admin/property/detail/slug', //need slug here
      create : '/api/admin/property/create',
      update : '/api/admin/property/update', //need id here
      delete: '/api/admin/property/delete', //need id here
    }
  };