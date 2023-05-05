import asyncHandler from "express-async-handler"
import Category from "../../models/Category.js"
import User from "../../models/User.js"

const getCategories = asyncHandler(async (req, res, next) => {
	const categories = await Category.find({})

	res.status(200).json(categories)
})

const specialization = asyncHandler(async (req, res, next) => {
	const mentors = await User
		.find({ status: "approved" })
		.populate('mentorshipFor', 'name slug')
		.select("mentorshipFor")

	const specialization = mentors[0]?.mentorshipFor

	res.status(200).json(specialization)
})

const professional = asyncHandler(async (req, res, next) => {
	const professional = await User
		.find({ status: "approved" })
		.distinct("provideMentorship")

	res.status(200).json(professional)
})

export default {
	getCategories,
	specialization,
	professional
}
