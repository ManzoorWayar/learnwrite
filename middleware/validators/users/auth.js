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
<<<<<<< HEAD
		escape: true,
		trim: true,
=======
>>>>>>> 3090d0f79a2e89c119984056e862233ffa72e37f
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
<<<<<<< HEAD
		escape: true,
		trim: true,
=======
>>>>>>> 3090d0f79a2e89c119984056e862233ffa72e37f
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
<<<<<<< HEAD
		escape: true,
		trim: true,
=======
>>>>>>> 3090d0f79a2e89c119984056e862233ffa72e37f
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
<<<<<<< HEAD
		escape: true,
		trim: true,
=======
>>>>>>> 3090d0f79a2e89c119984056e862233ffa72e37f
		isEmpty: {
			negated: true,
			errorMessage: "password is required.",
		},
	},
})

const verifyEmailSchema = checkSchema({
	email: {
		in: "body",
<<<<<<< HEAD
		escape: true,
		trim: true,
=======
>>>>>>> 3090d0f79a2e89c119984056e862233ffa72e37f
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
<<<<<<< HEAD
		escape: true,
		trim: true,
=======
>>>>>>> 3090d0f79a2e89c119984056e862233ffa72e37f
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
<<<<<<< HEAD
=======

const forgotPasswordSchema = checkSchema({
	email: {
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
})

const resetPasswordSchema = checkSchema({
	token: {
		escape: true,
		trim: true,
		isEmpty: {
			negated: true,
			errorMessage: "token is required!",
		},
	},
	newPassword: {
		escape: true,
		trim: true,
		isEmpty: {
			negated: true,
			errorMessage: "new password is required!",
		},
	},
	confirmPassword: {
		escape: true,
		trim: true,
		isEmpty: {
			negated: true,
			errorMessage: "confirm password is required!",
		},
		custom: {
			options: (value, { req }) => {
				if (value === req.body.newPassword) {
					return Promise.resolve()
				}
			},
			errorMessage: "password and confirm password does not match",
		},
	},
})
>>>>>>> 3090d0f79a2e89c119984056e862233ffa72e37f

export default {
	signup: [signUpSchema, errorHandler],
	login: [loginSchema, errorHandler],
	verifyEmail: [verifyEmailSchema, errorHandler],
	resendToken: [resendTokenSchema, errorHandler],
<<<<<<< HEAD
=======
	forgotPassword: [forgotPasswordSchema, errorHandler],
	resetPassword: [resetPasswordSchema, errorHandler],
>>>>>>> 3090d0f79a2e89c119984056e862233ffa72e37f
}
