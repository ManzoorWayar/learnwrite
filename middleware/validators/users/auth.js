import { checkSchema, validationResult } from "express-validator"
import { existsSync, unlinkSync } from "fs"
import User from "../../../models/User.js"

const errorHandler = (req, res, next) => {
	// handling validation errors
	const validationErrs = validationResult(req)
	if (!validationErrs.isEmpty()) {
		// removing uploaded files
		if (req.hasOwnProperty("file") && existsSync(req.file.path)) {
			unlinkSync(req.file.path)
		}
		return res.status(400).json({ errors: validationErrs.array() })
	}

	next()
}

const signUpSchema = checkSchema({
	email: {
		escape: true,
		trim: true,
		isEmail: {
			bail: true,
			errorMessage: "Invalid email address!",
		},
		normalizeEmail: true,
		isEmpty: {
			negated: true,
			errorMessage: "Email is empty!",
		},
		custom: {
			options: async (email, { req }) => {
				const findEmail = await User.findOne({ email })
				if (findEmail) {
					return Promise.reject("Email already-exists")
				}
				return Promise.resolve()
			},
		},
	},
	password: {
		escape: true,
		trim: true,
		isEmpty: {
			negated: true,
			errorMessage: "Password is required.",
		},
		// isStrongPassword: {
		//   negated: true,
		//   errorMessage: "Password is weak required.",
		// },
	},
})

const loginSchema = checkSchema({
	email: {
		escape: true,
		trim: true,
		isEmail: {
			bail: true,
			errorMessage: "invalid email address.",
		},
		normalizeEmail: true,
		isEmpty: {
			negated: true,
			errorMessage: "email is required.",
		},
	},
	password: {
		escape: true,
		trim: true,
		isEmpty: {
			negated: true,
			errorMessage: "password is required.",
		},
	},
})

const verifyEmailSchema = checkSchema({
	email: {
		in: "body",
		escape: true,
		trim: true,
		isEmail: {
			bail: true,
		},
		isEmpty: {
			negated: true,
			errorMessage: "email is required.",
		},
	},
	token: {
		in: "body",
		escape: true,
		trim: true,
		isEmpty: {
			negated: true,
			errorMessage: "token is required.",
		},
	},
})

const resendTokenSchema = checkSchema({
	email: {
		in: "body",
		escape: true,
		trim: true,
		isEmpty: {
			negated: true,
			errorMessage: "email is required.",
		},
		isEmail: {
			bail: true,
			errorMessage: "invalid email.",
		},
		custom: {
			options: async (email, { req }) => {
				const user = await User.findOne({ email })
				if (!user) {
					return Promise.reject("email not found.")
				}
				return Promise.resolve()
			},
		},
	},
})

export default {
	signup: [signUpSchema, errorHandler],
	login: [loginSchema, errorHandler],
	verifyEmail: [verifyEmailSchema, errorHandler],
	resendToken: [resendTokenSchema, errorHandler],
}
