import jwt from "jsonwebtoken"
import User from "../models/User.js"
import asyncHandler from "express-async-handler"

const authenticate = asyncHandler(async (req, res, next) => {
	let token, decoded

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1]
			decoded = jwt.verify(token, process.env.JWT_SECRET)

			const user = await User.findById(decoded.id)

			if (!user || !user.verifiedAt)
				throw new Error("Not authorized, token failed")

			req.user = user

			next()
		} catch (error) {
			res.status(403)
			next(new Error("Not authorized, token failed"))
		}
	}

	if (!token) {
		res.status(401)
		next(new Error("Not authorized, no token"))
	}
})

// Grant access to specific roles
const authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.userType)) {
			throw new Error(`User role ${req.user.userType} is not authorized to access this route`)
		}
		next();
	};
};

export { authenticate, authorize }
