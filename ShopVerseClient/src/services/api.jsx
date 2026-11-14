import axios from "axios";

// const BASE_URL = "http://localhost:9090/ShopVerseAPI";
const BASE_URL = "https://shopverse-backend-14ga.onrender.com/ShopVerseAPI/";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===================================================
// GLOBAL API LOADING TRACKER (FOR GLOBAL SPINNER)
// ===================================================
let activeRequests = 0;
const subscribers = new Set();

export const subscribeToLoading = (callback) => {
  subscribers.add(callback);
  callback(activeRequests > 0);
  return () => subscribers.delete(callback);
};

const notifySubscribers = () => {
  const isLoading = activeRequests > 0;
  subscribers.forEach((cb) => {
    try {
      cb(isLoading);
    } catch (err) {
      console.error("Error in loading subscriber:", err);
    }
  });
};

// Axios Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.silent) {
      activeRequests++;
      notifySubscribers();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (!response.config?.silent) {
      activeRequests = Math.max(0, activeRequests - 1);
      notifySubscribers();
    }
    return response;
  },
  (error) => {
    if (!error.config?.silent) {
      activeRequests = Math.max(0, activeRequests - 1);
      notifySubscribers();
    }
    return Promise.reject(error);
  }
);

const api = {
  get: (url, config = {}) => {
    return axiosInstance.get(url, config);
  },

  post: (url, data, config = {}) => {
    return axiosInstance.post(url, data, config);
  },

  put: (url, data, config = {}) => {
    return axiosInstance.put(url, data, config);
  },

  patch: (url, data, config = {}) => {
    return axiosInstance.patch(url, data, config);
  },

  delete: (url, config = {}) => {
    return axiosInstance.delete(url, config);
  },
};

export default api;
