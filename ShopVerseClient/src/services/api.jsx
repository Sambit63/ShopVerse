import axios from "axios";

const BASE_URL = "https://shopverseclient.onrender.com/ShopVerseAPI";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

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
