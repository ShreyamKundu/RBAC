import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Edit, Trash, Clipboard, Eye } from "lucide-react";
import { Tooltip } from "react-tooltip";

const AdminDashboardPage = () => {
  const {
    getAllUsers,
    deleteUser,
    updateUserRole,
    user,
    assignTask,
    getUserTasks,
  } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [assigningTask, setAssigningTask] = useState(null);
  const [taskDetails, setTaskDetails] = useState("");
  const [viewingTasks, setViewingTasks] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "Admin") {
      navigate("/");
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
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
    setSelectedRole(user.role);
  };

  const handleSaveRole = async () => {
    try {
      setLoading(true);
      const updatedUser = await updateUserRole(
        editingUser._id,
        user?._id,
        selectedRole
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );
      alert("User role updated successfully");
      setEditingUser(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTaskModal = (user) => {
    setAssigningTask(user);
  };

  const handleAssignTask = async (userId) => {
    if (!taskDetails.title.trim() || !taskDetails.description.trim()) {
      alert("Task details cannot be empty");
      return;
    }
    const task = await assignTask(userId, user._id, taskDetails);
    setTaskDetails("");
    setAssigningTask(null);
  };

  const handleViewTasks = async (userId) => {
    const response = await getUserTasks(userId);
    setViewingTasks(response);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          Admin Dashboard
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Back to Home
        </button>
      </div>
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400 mb-3">User List</h3>
        {loading ? (
          <p className="text-gray-400">Loading users...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-4 bg-gray-800 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="text-gray-300">Name: {user.name}</p>
                  <p className="text-gray-300">Email: {user.email}</p>
                  <p className="text-gray-300">Role: {user.role}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenTaskModal(user)}
                    className="text-yellow-500 px-2 rounded hover:text-yellow-600 transition"
                    data-tooltip-id="assign-tooltip"
                    data-tooltip-content="Assign Task"
                  >
                    <Clipboard className="inline-block" />
                  </button>
                  <button
                    onClick={() => handleViewTasks(user._id)}
                    className="text-green-500 px-2 rounded hover:text-green-600 transition"
                    data-tooltip-id="view-tooltip"
                    data-tooltip-content="View Tasks"
                  >
                    <Eye className="inline-block" />
                  </button>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-500 px-2 rounded hover:text-blue-600 transition"
                    data-tooltip-id="edit-tooltip"
                    data-tooltip-content="Edit User"
                  >
                    <Edit className="inline-block" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500 px-2 rounded hover:text-red-600 transition"
                    data-tooltip-id="delete-tooltip"
                    data-tooltip-content="Delete User"
                  >
                    <Trash className="inline-block" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg mb-4 text-white">
              Edit Role for {editingUser.name}
            </h3>
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

      {assigningTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg mb-4 text-white">
              Assign Task to {assigningTask.name}
            </h3>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Task Title</label>
              <input
                type="text"
                value={taskDetails.title}
                onChange={(e) =>
                  setTaskDetails({ ...taskDetails, title: e.target.value })
                }
                className="w-full p-2 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">
                Task Description
              </label>
              <textarea
                value={taskDetails.description}
                onChange={(e) =>
                  setTaskDetails({
                    ...taskDetails,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 text-black"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setAssigningTask(null)}
                className="bg-gray-600 px-3 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignTask(assigningTask._id)}
                className="bg-green-500 px-3 py-2 rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingTasks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg mb-4 text-white">Tasks</h3>
            {viewingTasks.length > 0 ? (
              <ul className="space-y-2">
                {viewingTasks.map((task, index) => (
                  <li key={index} className="p-3 bg-gray-700 rounded">
                    <p className="text-gray-300">Title: {task.title}</p>
                    <p className="text-gray-300">
                      Description: {task.description}
                    </p>
                    <p className="text-gray-300">
                      Description: {task.status}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No tasks found</p>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => setViewingTasks(null)}
                className="bg-gray-600 px-3 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Tooltip id="assign-tooltip" />
      <Tooltip id="view-tooltip" />
      <Tooltip id="edit-tooltip" />
      <Tooltip id="delete-tooltip" />
    </motion.div>
  );
};

export default AdminDashboardPage;
