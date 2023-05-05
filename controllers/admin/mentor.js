import asyncHandler from "express-async-handler"
import User from "../../models/User.js"

const getMentors = asyncHandler(async (req, res) => {
	const mentors = await User.find({})

	res.status(200).json({
		"firstName": mentors?.firstName,
		"lastname": mentors?.lastname,
		"email": mentors?.email,
		"status": mentors?.status,
		"mentorstype": mentors?.usertype
	});
});

const activeMentors = asyncHandler(async (req, res) => {
	const active = await User.find({ status: "approved" })
	res.status(200).json(active);
});

const pendingMentors = asyncHandler(async (req, res) => {
	const pending = await User.find({ status: "pendingMentors" })
	res.status(200).json(pending);
});

const mentorStatus = asyncHandler(async (req, res) => {
	const { user, body, params } = req

	if (!mongoose.Types.ObjectId.isValid(params.id)) {
		return next()
	}

	body.updaterId = user?.id

	const mentor = await User.findByIdAndUpdate(
		params.id,
		{
			status: body.status,
			updaterId: user?.id,
		},
		{ new: true }
	)

	if (mentor) {
		res.status(400)
		throw new Error("no mentor was found")
	}

	res.status(200).json(mentor)
})

export default {
	getMentors,
	mentorStatus,
	activeMentors,
	pendingMentors,
};
