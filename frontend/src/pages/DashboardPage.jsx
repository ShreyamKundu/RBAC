import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const DashboardPage = () => {
	const { user, logout, getUserTasks, updateTaskStatus } = useAuthStore();
	const navigate = useNavigate();
	const [tasks, setTasks] = useState([]);

	const handleLogout = () => {
		logout();
	};

	const handleAdminDashboard = () => {
		navigate("/admin-dashboard");
	};

	// Fetch tasks for the logged-in user
	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await getUserTasks(user._id);
				setTasks(response);
			} catch (error) {
				console.error("Failed to fetch tasks:", error);
			}
		};

		fetchTasks();
	}, []);

	const handleUpdateTaskStatus = async (taskId, newStatus) => {
		try {
		  const updatedTask = await updateTaskStatus(taskId, newStatus, user._id);
		  setTasks((prevTasks) =>
			prevTasks.map((task) =>
			  task._id === updatedTask?._id ? updatedTask : task
			)
		  );
		} catch (error) {
		  console.error("Failed to update task status:", error.message);
		}
	  };
	
	 

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className='w-[800px] mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
		>
			<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
				Dashboard
			</h2>

			<div className='space-y-6'>
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-3'>Profile Information</h3>
					<p className='text-gray-300'>Name: {user.name}</p>
					<p className='text-gray-300'>Email: {user.email}</p>
					<p className='text-gray-300'>Role: {user.role}</p>
				</motion.div>
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-3'>Account Activity</h3>
					<p className='text-gray-300'>
						<span className='font-bold'>Joined: </span>
						{new Date(user.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className='text-gray-300'>
						<span className='font-bold'>Last Login: </span>
						{formatDate(user.lastLogin)}
					</p>
				</motion.div>
			</div>

			{/* Tasks Section */}
			<motion.div
				className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 mt-6 h-56 overflow-y-auto'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
			>
				<h3 className='text-xl font-semibold text-green-400 mb-3'>Your Tasks</h3>
				{Array.isArray(tasks) && tasks.length > 0 ? (
					<div className='space-y-4'>
						{tasks.map((task) => (
							<motion.div
								key={task._id}
								className='p-4 bg-gray-700 rounded-lg shadow-md'
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
							>
								<h4 className='text-lg font-bold text-green-300'>{task.title}</h4>
								<p className='text-gray-300 mb-2'>{task.description}</p>
								<p className='text-gray-400 text-sm'>
									Created by: {task.createdBy?.name || "Unknown"}
								</p>
								<div className='mt-3'>
									<label htmlFor={`status-${task._id}`} className='text-gray-300 mr-2'>
										Status:
									</label>
									<select
										id={`status-${task?._id}`}
										value={task.status}
										onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
										className='p-2 rounded bg-gray-600 text-gray-300'
									>
										<option value='Pending'>Pending</option>
										<option value='In Progress'>In Progress</option>
										<option value='Completed'>Completed</option>
									</select>
								</div>
							</motion.div>
						))}
					</div>
				) : (
					<p className='text-gray-400'>No tasks assigned to you.</p>
				)}
			</motion.div>

			{/* Admin Dashboard Button */}
			{user?.role === "Admin" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className='mt-4'
				>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleAdminDashboard}
						className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
					font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700
					 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
					>
						Go to Admin Dashboard
					</motion.button>
				</motion.div>
			)}

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8 }}
				className='mt-4'
			>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleLogout}
					className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
				>
					Logout
				</motion.button>
			</motion.div>
		</motion.div>
	);
};

export default DashboardPage;
