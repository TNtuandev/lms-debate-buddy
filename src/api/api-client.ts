import axios from "axios";
import { handleApiError } from "@/api/utils/api-response.util";

// ✅ Create an Axios instance for client-side API calls
const API_CLIENT = axios.create({
  baseURL: "/api", // Calls Next.js API Routes
  withCredentials: true, // ✅ Ensures cookies are sent automatically
});

// ✅ Automatically handle errors
API_CLIENT.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return handleApiError(error);
  },
);

export default API_CLIENT;
