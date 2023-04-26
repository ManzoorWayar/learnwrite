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

			const user = await User.findOne({ _Id: decoded.id })
			if (!user || user.verifiedAt === null)
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

export { authenticate }
