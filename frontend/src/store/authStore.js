import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async (userId) => {
    set({ isCheckingAuth: true, error: null });
  
    try {
      // First, check Google OAuth authentication using /login/success route
      const googleAuthResponse = await axios.get("http://localhost:5000/auth/login/success");  // Replace with your correct OAuth check route
      
      // If Google OAuth authentication is successful, update state
      if (googleAuthResponse.data.success && googleAuthResponse.data.user) {
        set({
          user: googleAuthResponse.data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } else {
        // If Google OAuth fails, proceed to check JWT authentication
        const jwtResponse = await axios.get(`${API_URL}/check-auth/${userId}`);
  
        if (jwtResponse.data.success && jwtResponse.data.user) {
          // If JWT authentication is successful, update state
          set({
            user: jwtResponse.data.user,
            isAuthenticated: true,
            isCheckingAuth: false,
          });
        } else {
          // If both Google OAuth and JWT authentication fail, mark user as not authenticated
          set({
            isAuthenticated: false,
            user: null,
            isCheckingAuth: false,
          });
        }
      }
    } catch (error) {
      // Handle errors for both Google OAuth and JWT checks
      set({
        error: error.response?.data?.message || "Error checking authentication",
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  }
,  
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
  getAllUsers: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}`);
      return response.data.users;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching users",
        isLoading: false,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteUser: async (userId,adminId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete/user/${userId}`,{userId:adminId}); // Assuming the route is `/delete/user/:userId`
      set({ message: "User deleted successfully", isLoading: false });
      return true; 
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting user",
        isLoading: false,
      });
      throw error;
    }
  },

  updateUserRole: async (userId, adminId, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(`http://localhost:5000/api/admin/update/user/${userId}`, { role, userId:adminId }); 
      set({user: response.data.user, message: "User role updated successfully", isLoading: false });
      return response.data.user;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating user role",
        isLoading: false,
      });
      throw error;
    }
  },

  assignTask: async (userId,adminId, task) => {
    set({ isLoading: true, error: null });
    try {
      console.log("task", task);  
      console.log("userId", userId);
      console.log("adminId", adminId);
      const response = await axios.post(`http://localhost:5000/api/admin/assign/task/${adminId}`, {title:task.title, description: task.description, assignedTo: userId});
      set({ message: "Task assigned successfully", isLoading: false });
      return response.data.task;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error assigning task",
        isLoading: false,
      });
      throw error;
    }
  },

  getUserTasks: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/tasks/${userId}`);
      return response.data.tasks;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching tasks",
        isLoading: false,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
