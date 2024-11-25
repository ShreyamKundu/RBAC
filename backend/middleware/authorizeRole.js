export const authorizeRole = (...allowedRoles) => {
	return (req, res, next) => {
		const role  = req.role;
		if (!allowedRoles.includes(role)) {
			return res.status(403).json({
				success: false,
				message: "Forbidden - You do not have the necessary permissions",
			});
		}

		next(); 
	};
};
