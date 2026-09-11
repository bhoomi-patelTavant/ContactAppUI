import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://nodejscontactappapi-cxcchza4a7ffe9fu.centralindia-01.azurewebsites.net/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;