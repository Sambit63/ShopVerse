import axios from "axios";

const BASE_URL = "http://localhost:9090/ShopVerseAPI";

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
