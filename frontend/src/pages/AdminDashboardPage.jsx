import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const { getAllUsers, deleteUser, updateUserRole, user } = useAuthStore(); // Assume updateUserRole is defined
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(""); // Selected role for the user
  const navigate = useNavigate();
  
  useEffect(() => {
    
    if (user?.role !== "Admin") {
      navigate("/"); // Redirect to home page
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers(user._id);
        setUsers(usersData);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const isDeleted = await deleteUser(userId, user._id);
      if (isDeleted) {
        setUsers(users.filter((user) => user._id !== userId));
        alert("User deleted successfully");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role); // Pre-select the current role
  };

  const handleSaveRole = async () => {
    try {
      setLoading(true);
      const updatedUser = await updateUserRole(editingUser._id, user?._id, selectedRole);
      setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
      alert("User role updated successfully");
      setEditingUser(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
        Admin Dashboard
      </h2>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400 mb-3">User List</h3>
        {loading ? (
          <p className="text-gray-400">Loading users...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="p-4 bg-gray-800 rounded-lg flex justify-between">
                <div>
                  <p className="text-gray-300">Name: {user.name}</p>
                  <p className="text-gray-300">Email: {user.email}</p>
                  <p className="text-gray-300">Role: {user.role}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-500 px-3 py-2 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500 px-3 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg mb-4 text-white">Edit Role for {editingUser.name}</h3>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-2 text-black"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-600 px-3 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                className="bg-green-500 px-3 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboardPage;
