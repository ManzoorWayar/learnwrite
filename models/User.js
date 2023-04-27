import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import speakeasy from "speakeasy"
import EmailVerificationTemplate from "../views/verify-email.js"
import sendMail from "../utils/sendMail.js"

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
		email: {
			type: String,

			index: {
				unique: true,
			},
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please add a valid email",
			],
		},
		userType: {
			type: String,
			enum: ["superAdmin", "mentor", "mentee"],
			default: "mentor",
		},
		update_secret: {
			type: Object,
			select: false,
			default: speakeasy.generateSecret({ length: 32 }),
		},
		password: {
			type: String,

			minlength: 6,
			select: false,
		},
		auth_secret: {
			type: Object,
			select: false,
			default: speakeasy.generateSecret({ length: 32 }),
		},
		country: {
			type: String,
		},
		languages: {
			type: [String],
		},
		age: {
			type: Boolean,
			default: false,
		},
		phoneNumber: {
			type: String,
		},
		mentorshipFor: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Category",
			},
		],
		provideMentorship: {
			type: [String],
		},
		mentorshipLevel: {
			type: String,
			enum: ["A1", "A2", "B1", "B2"],
		},
		mentorExperience: {
			type: String,
		},
		mentorSituation: {
			type: String,
		},
		profileImg: {
			type: JSON,
		},
		university: {
			name: {
				type: String,
			},
			degree: {
				type: String,
			},
			degreeType: {
				type: String,
				enum: [
					"Associate's Degree",
					"Bachelor's Degree",
					"Master's Degree",
					"Post-Doctorate",
					"Professional Degree",
				],
			},
			specialization: {
				type: String,
			},
			completeDegree: {
				type: Date,
			},
			statusDegree: {
				type: Boolean,
				default: false,
			},

			localProof: {
				type: Boolean,
				default: false,
			},
		},

		diploma: {
			type: [JSON],
		},
		citizenship: {
			type: JSON,
		},

		pages: {
			type: Number,
			required: true,
			default: 0,
		},

		isCompleted: {
			type: Boolean,
			default: false,
		},

		availability: {
			type: [
				{
					day: String,
					startTime: String,
					endTime: String,
				},
			],
		},
		profile: {
			headline: {
				type: String,
				maxlength: 100,
			},
			introduction: {
				type: String,
			},
			workExperience: {
				type: String,
			},
			mentorshipProgram: {
				type: String,
				maxlength: 500,
			},
		},
		videoLink: {
			type: String,
		},
		videoCloud: {
			type: String,
		},
		timeZone: {
			type: String,
		},
		hourlyRate: {
			type: Number,
		},
		serviceFee: {
			type: Number,
		},
		discount: {
			type: Number,
		},
		totalPayment: {
			type: Number,
		},
		status: {
			type: String,
			enum: ["pending", "approved"],
			default: "pending",
		},
		verifiedAt: {
			type: Date,
			default: null,
		},
		resetPasswordToken: String,
	},
	{
		timestamps: true,
	}
)

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// Match users entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

// Sign JWT and return
UserSchema.methods.generateAccessToken = async function () {
	let payload = { id: this._id }

	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	})
}

UserSchema.methods.generateRefreshToken = async function () {
	let payload = { id: this._id }

	return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_EXPIRE,
	})
}

// Verify JWT token
UserSchema.methods.verifyToken = function (token, type = "access") {
	const secret =
		type === "access"
			? process.env.JWT_SECRET
			: process.env.JWT_REFRESH_SECRET.concat(this.password)
	return jwt.verify(token, secret)
}

UserSchema.methods.verifyEmailVerificationToken = function (otp) {
	return speakeasy.totp.verify({
		secret: this.update_secret.base32,
		algorithm: "sha512",
		encoding: "base32",
		token: otp,
		step: process.env.OTP_STEP_EMAIL || 120,
		window: 1,
	})
}

UserSchema.methods.sendEmailVerificationToken = function () {
	const token = speakeasy.totp({
		secret: this.update_secret.base32,
		algorithm: "sha512",
		encoding: "base32",
		step: process.env.OTP_STEP_EMAIL || 120,
	})

	const emailContent = new EmailVerificationTemplate(token)

	return sendMail({
		email: this.email,
		subject: `Learninbox verification code:${token} `,
		html: emailContent.render(),
	})
}

UserSchema.methods.getSignedJwtToken = async function (identifier) {
	let payload = { id: this._id }
	if (identifier) {
		payload["tokenIdentifier"] = identifier
	}
	return jwt.sign(payload, process.env.JWT_SECRET)
}

UserSchema.methods.handleLogin = async function () {
	this.tokenIdentifier = crypto.randomUUID()
	this.lastLogin = new Date()
	await this.save()
	return this.getSignedJwtToken(this.tokenIdentifier)
}

UserSchema.methods.verifyEmailVerificationToken = function (otp) {
	return speakeasy.totp.verify({
		secret: this.update_secret.base32,
		algorithm: "sha512",
		encoding: "base32",
		token: otp,
		step: process.env.OTP_STEP_EMAIL || 120,
		window: 1,
	})
}

const User = mongoose.model("User", UserSchema)

export default User
