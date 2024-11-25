// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useAuthStore } from "../store/authStore";

// const AdminDashboardPage = () => {
// 	const { getAllUsers } = useAuthStore();
// 	const [users, setUsers] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);

// 	useEffect(() => {
// 		const fetchUsers = async () => {
// 			try {
// 				setLoading(true);
// 				const usersData = await getAllUsers(); 
// 				setUsers(usersData); 
// 			} catch (err) {
// 				setError(err.message || "Failed to fetch users");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchUsers();
// 	}, []);

// 	return (
// 		<motion.div
// 			initial={{ opacity: 0, scale: 0.9 }}
// 			animate={{ opacity: 1, scale: 1 }}
// 			exit={{ opacity: 0, scale: 0.9 }}
// 			transition={{ duration: 0.5 }}
// 			className='max-w-2xl w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
// 		>
// 			<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
// 				Admin Dashboard
// 			</h2>

// 			<div className='space-y-6'>
// 				<h3 className='text-xl font-semibold text-green-400 mb-3'>User List</h3>
// 				{loading ? (
// 					<p className="text-gray-400">Loading users...</p>
// 				) : error ? (
// 					<p className="text-red-500">{error}</p>
// 				) : (
// 					<div className='space-y-4'>
// 						{users.map((user, index) => (
// 							<div
// 								key={index}
// 								className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
// 							>
// 								<p className='text-gray-300'>
// 									<span className='font-bold'>Name: </span>
// 									{user.name}
// 								</p>
// 								<p className='text-gray-300'>
// 									<span className='font-bold'>Email: </span>
// 									{user.email}
// 								</p>
// 							</div>
// 						))}
// 					</div>
// 				)}
// 			</div>
// 		</motion.div>
// 	);
// };

// export default AdminDashboardPage;




import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const AdminDashboardPage = () => {
	const { getAllUsers } = useAuthStore();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch all users
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const usersData = await getAllUsers();
				setUsers(usersData);
			} catch (err) {
				setError(err.message || "Failed to fetch users");
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	// Delete user handler
	const handleDeleteUser = async (userId) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this user?");
		if (!confirmDelete) return;

		try {
			setLoading(true);
			await axios.delete(`/api/admin/admin-dashboard/${userId}`); // Backend route for deleting user
			setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId)); // Update state
			alert("User deleted successfully");
		} catch (error) {
			alert(error.response?.data?.message || "Failed to delete user");
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
			className='max-w-2xl w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
		>
			<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
				Admin Dashboard
			</h2>

			<div className='space-y-6'>
				<h3 className='text-xl font-semibold text-green-400 mb-3'>User List</h3>
				{loading ? (
					<p className="text-gray-400">Loading users...</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : (
					<div className='space-y-4'>
						{users.map((user) => (
							<div
								key={user._id}
								className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 flex justify-between items-center'
							>
								<div>
									<p className='text-gray-300'>
										<span className='font-bold'>Name: </span>
										{user.name}
									</p>
									<p className='text-gray-300'>
										<span className='font-bold'>Email: </span>
										{user.email}
									</p>
									<p className='text-gray-300'>
										<span className='font-bold'>Role: </span>
										<span className='uppercase'>{user.role}</span>
									</p>
								</div>
								<button
									onClick={() => handleDeleteUser(user._id)}
									className='text-red-500 hover:text-red-700 font-bold py-2 px-4 rounded'
								>
									Delete
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default AdminDashboardPage;
