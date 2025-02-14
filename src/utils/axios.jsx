import axios from "axios";

const HOST_API = import.meta.env.VITE_HOST_API;
const axiosInstance = axios.create({ baseURL: HOST_API });

let isRefreshing = false;
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};


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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Jika error 401 dan request belum dicoba ulang
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request untuk mendapatkan refresh token
        const token = sessionStorage.getItem("token"); 
        const refresh_token = sessionStorage.getItem("refresh_token"); 
        if (!refresh_token) {
          throw new Error("Sesi anda telah berakhir, Silahkan login");
        }

        const { data } = await axiosInstance.post("/api/refresh_token", {
          refreshToken : refresh_token,
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newToken = data.new_access_token;
      const newRefreshToken = data.new_refresh_token;
      
      sessionStorage.setItem("token", newToken);
      sessionStorage.setItem("refresh_token", newRefreshToken);
      
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      processQueue(null, newToken);
      return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        alert(err)
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refresh_token");
        window.location.href = "/sign-in"; // Redirect ke halaman login
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
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
      refresh_token: '/api/refresh_token',
    },
    user : {
      list : '/api/admin/users/list',
      detail : '/api/admin/users/detail', //need id here
      create : '/api/admin/users/create',
      update : '/api/admin/users/update',
      update : '/api/admin/users/update_user_password', // need id here
    },
    facilities : {
      list : '/api/admin/facility/list',
      // detail : '/api/admin/users/detail', //need id here
      create : '/api/admin/facility/create',
      delete : '/api/admin/facility/delete',
      update : '/api/admin/facility/update', // need id here
    },
    banner : {
      list : '/api/admin/banner/list',
      detail : '/api/admin/banner/detail', //need id here
      create : '/api/admin/banner/create',
      update : '/api/admin/banner/update', //need id here
      delete : '/api/admin/banner/delete', //need id here
      public : {
        list : '/api/public/banner/all',
        detail : '/api/public/banner/detail'
      }
    },
    property : {
      list : '/api/admin/property/list',
      detail : '/api/admin/property/detail/id', //need id here
      detail : '/api/admin/property/detail/slug', //need slug here
      create : '/api/admin/property/create',
      update : '/api/admin/property/update', //need id here
      delete: '/api/admin/property/delete', //need id here
      public : {
        list : '/api/public/property/all',
        detail : '/api/public/property/detail/slug'
      }
    },
    state : {
      list : '/api/admin/state/list',
    },
    city : {
      list : '/api/admin/city/list',
    },
    promo : {
      list : "/api/admin/discount/list",
      create : "/api/admin/discount/create",
      public : {
        list : "/api/public/discount/all"
      }
    }
  };