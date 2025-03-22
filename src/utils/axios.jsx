import axios from 'axios';
import { secondsToHours } from 'date-fns/esm/fp';

const HOST_API = import.meta.env.VITE_HOST_API;
const axiosInstance = axios.create({ baseURL: HOST_API });

let isRefreshing = false;
let failedQueue = [];

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
        const token = sessionStorage.getItem('token');
        const refresh_token = sessionStorage.getItem('refresh_token');
        if (!refresh_token) {
          throw new Error('Sesi anda telah berakhir, Silahkan login');
        }

        const { data } = await axiosInstance.post(
          '/api/refresh_token',
          {
            refreshToken: refresh_token,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newToken = data.new_access_token;
        const newRefreshToken = data.new_refresh_token;

        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('refresh_token', newRefreshToken);

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        alert(err);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refresh_token');
        window.location.href = '/sign-in'; // Redirect ke halaman login
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
  user: {
    list: '/api/admin/users/list',
    detail: '/api/admin/users/detail', // need id here
    create: '/api/admin/users/create',
    update_data_user: '/api/admin/users/update',
    update: '/api/admin/users/update_user_password', // need id here
    booking: {
      property: '/api/user/booking/property/reserve',
      getBookingproperty: '/api/user/booking/property/all',
      getBookingDetail: '/api/user/booking/property/detail',
      admin: {
        list: '/api/admin/statistic/property/all',
        detail: '/api/admin/statistic/property/booking_information',
      },
    },
    profile: {
      update: '/api/user/profile/update',
      updatePassword: '/api/user/profile/update_password',
    },
  },
  visit: {
    createVisit: '/api/user/visit/create',
    cancelVisit: '/api/user/visit/cancel',
    listVisit: '/api/user/visit/all',
    detailIdVisit: '/api/user/visit/detail', // need id here
    detailCodeVisit: '/api/user/visit/detail/code', // need id here
  },
  profile: {
    update: '/api/user/profile/update',
    updatePassword: '/api/user/profile/update_password',
  },
  facilities: {
    list: '/api/admin/facility/list',
    delete: '/api/admin/facility/delete',
    create: '/api/admin/facility/create',
    update: '/api/admin/facility/update', // need id here
    owner: {
      list: '/api/owner_property/facility/all',
      create: '/api/owner_property/property/create',
    },
  },
  facilities_room: {
    list: '/api/admin/facility/room/list',
    create: '/api/admin/facility/room/create',
    update: '/api/admin/facility/room/update',
    delete: '/api/admin/facility/room/delete',
  },
  service: {
    list: '/api/admin/additional_service/list',
    detail: '/api/admin/additional_service/detail',
    create: '/api/admin/additional_service/create',
    update: '/api/admin/additional_service/update',
    delete: '/api/admin/additional_service/delete',
  },
  banner: {
    list: '/api/admin/banner/list',
    detail: '/api/admin/banner/detail', // need id here
    create: '/api/admin/banner/create',
    update: '/api/admin/banner/update', // need id here
    delete: '/api/admin/banner/delete', // need id here
    public: {
      list: '/api/public/banner/all',
      detail: '/api/public/banner/detail',
    },
  },
  wishlist: {
    list: '/api/user/wishlist/all',
    add: '/api/user/wishlist/add',
    remove: '/api/user/wishlist/remove',
  },
  property: {
    list: '/api/admin/property/list',
    detail_by_id: '/api/admin/property/detail/id', // need id here
    detail_by_slug: '/api/admin/property/detail/slug', // need slug here
    create: '/api/admin/property/create',
    update: '/api/admin/property/update', // need id here
    delete: '/api/admin/property/delete', // need id here
    owner: {
      list: '/api/owner_property/property/all',
    },
    public: {
      list: '/api/public/property/all',
      detail: '/api/public/property/detail/slug',
    },
  },
  state: {
    list: '/api/admin/state/list',
  },
  city: {
    list: '/api/admin/city/list',
    // detail: '/api/admin/city/detail',
    detail: '/api/admin/state/detail',
  },
  sector: {
    list: '/api/admin/city/list',
    detail: '/api/admin/city/detail',
  },
  promo: {
    list: '/api/admin/promo/list',
    create: '/api/admin/promo/create',
    delete: '/api/admin/promo/delete',
    public: {
      list: '/api/public/promo/all',
    },
  },
  property_room: {
    detail: '/api/admin/property/detail/id', // need id here
    add: '/api/admin/property/property_room/add',
    delete: '/api/admin/property_room/delete',
  },
  apartment: {
    create: '/api/admin/apartment/create',
    list: '/api/admin/property/list',
    update: '/api/admin/property/update',
    delete: '/api/admin/property/delete',
    detail: '/api/admin/property/detail/id',
    public: {
      list: '/api/public/apartment/all',
    },
  },
  property_type: {
    list: '/api/admin/property/type/list',
    create: '/api/admin/property/type/create',
    update: '/api/admin/property/type/update',
    delete: '/api/admin/property/type/delete',
    owner: {
      list: '/api/owner_property/property/type/all',
    },
  },
  owner: {
    property: {
      create: '/api/owner_property/property/create',
      statistic: {
        booking: '/api/owner_property/statistic/property/all_with_bookings',
      },
    },
    state: {
      list: '/api/owner_property/state/list',
    },
    city: {
      list: '/api/owner_property/city/list',
      detail: '/api/owner_property/city/detail',
    },
    sector: {
      list: '/api/owner_property/sector/list',
      detail: '/api/owner_property/sector/detail',
    },
  },
};

export const EndpointLandingPage = {
  service: {
    list: '/api/user/additional_service/list',
    detail: '/api/user/additional_service/detail',
  },
  ratingreview: {
    list: '/api/user/rating_and_review/all',
    reviewProperty: '/api/user/rating_and_review/property',
    add: '/api/user/rating_and_review/add',
    update: '/api/user/rating_and_review/update',
    delete: '/api/user/rating_and_review/delete',
    detail: '/api/user/rating_and_review/detail',
    room: {
      list: '/api/user/rating_and_review/room/all',
      reviewProperty: '/api/user/rating_and_review/room/user',
      add: '/api/user/rating_and_review/room/add',
      update: '/api/user/rating_and_review/room/update',
      delete: '/api/user/rating_and_review/room/delete',
      detail: '/api/user/rating_and_review/room/detail',
    },
    booking: {
      getBookingDetail: '/api/user/booking/property/detail',
      getBookingAll: '/api/user/booking/property/all',
    },
  },
};
