import asyncHandler from "express-async-handler"
import { splitString } from "../../utils/utils.js"
import User from "../../models/User.js"

// @desc    Create an user by users
// @route   POST /api/v1/user/
// @access  free
const create = asyncHandler(async ({ body, file }, res) => {
	const user = await User.create(body)
	res.status(201).json()
})

const getMentorProfile = asyncHandler(async (req, res) => {
	// const mentors = await User.find({ status: "approved" })
	// need an advanced result middleware for filtering and serching
	res.status(200).json(res.advancedResults);
	// res.status(200).json({
	// 	"profileImg": mentors?.profileImg,
	// 	"firstName": mentors?.firstName,
	// 	"lastName": mentors?.lastName,
	// 	"videoLink": mentors?.videoLink,
	// 	"videoCloud": mentors?.videoCloud,
	// 	"mentorshipFor": mentors?.mentorshipFor,
	// 	"hourlyRate": mentors?.hourlyRate,
	// 	"serviceFee": mentors?.serviceFee,
	// 	"discount": mentors?.discount,
	// 	"totalPayment": mentors?.totalPayment,
	// 	"languages": mentors?.languages,
	// 	"headline": mentors?.profile.headline,
	// 	"introduction": mentors?.profile.introduction,
	// 	"workExperience": mentors?.profile.workExperience,
	// 	"availability": mentors?.availability,
	// });
});

const getData = asyncHandler(async (req, res) => {
	const { user } = req;

	const userData = await User.findOne({ _id: user.id }).populate(
		"mentorshipFor"
	);

	res.status(200).json({
		userData,
	});
});

const getAbout = asyncHandler(async (req, res) => {
	const { user } = req;

	const aboutData = await User
		.findOne({ _id: user.id, status: 'approved' })
		.populate('mentorshipFor', 'name slug')

	res.status(200).json({
		"firstName": aboutData?.firstName,
		"lastName": aboutData?.lastName,
		"country": aboutData?.country,
		"userType": aboutData?.userType,
		"languages": aboutData?.languages,
		"age": aboutData?.age,
		"mentorshipFor": aboutData?.mentorshipFor,
		"provideMentorship": aboutData?.provideMentorship,
		"mentorshipLevel": aboutData?.mentorshipLevel,
		"mentorExperience": aboutData?.mentorExperience,
		"mentorSituation": aboutData?.mentorSituation
	});
});

const getProfile = asyncHandler(async (req, res) => {
	const { user } = req;

	res.status(200).json({
		profileImg: user?.profileImg
	});
});

const getVideo = asyncHandler(async (req, res) => {
	const { user } = req;

	res.status(200).json({
		"videoLink": user?.videoLink,
		"videoCloud": user?.videoCloud,
	});
});

const getDescription = asyncHandler(async (req, res) => {
	const { user } = req;

	res.status(200).json({
		"headline": user?.profile.headline,
		"introduction": user?.profile.introduction,
		"workExperience": user?.profile.workExperience,
		"mentorshipImpact": user?.profile.mentorshipImpact,
	});
});

const getPricing = asyncHandler(async (req, res) => {
	const { user } = req;

	res.status(200).json({
		"hourlyRate": user?.hourlyRate,
		"serviceFee": user?.serviceFee,
		"discount": user?.discount,
		"totalPayment": user?.totalPayment,
	});
});

const getSubject = asyncHandler(async (req, res) => {
	const { user } = req;

	res.status(200).json({
		"mentorshipFor": user?.mentorshipFor,
		"provideMentorship": user?.provideMentorship,
		"mentorshipLevel": user?.mentorshipLevel,
		"mentorExperience": user?.mentorExperience,
		"mentorSituation": user?.mentorSituation
	});
});

const getBackground = asyncHandler(async (req, res) => {
	const { user } = req;

	res.status(200).json({
		"name": user?.university.name,
		"degree": user?.university.degree,
		"degreeType": user?.university.degreeType,
		"specialization": user?.university.specialization,
		"completedDegree": user?.university.completedDegree,
		"statusDegree": user?.university.statusDegree,
		"localProof": user?.university.localProof,
	});
});

const about = asyncHandler(async (req, res) => {
	const { user, body } = req
	body.pages = 1

	if (body?.mentorshipFor || body.languages) {
		body.mentorshipFor = splitString(body?.mentorshipFor)
		body.languages = splitString(body.languages)
	}

	const updated = await User.findByIdAndUpdate({ _id: user.id }, body, {
		new: true,
	})
	res.status(200).json(updated)
})

const profile = asyncHandler(async (req, res) => {
	const { user, body } = req
	body.pages = 2
	body.profileImg = req.body.images[0]

	const updated = await User.findByIdAndUpdate({ _id: user.id }, body, {
		new: true,
	})
	res.status(200).json(updated)
})

const education = asyncHandler(async (req, res) => {
	const { user, body } = req
	const {
		name,
		degree,
		degreeType,
		specialization,
		completedDegree,
		statusDegree,
		localProof,
	} = body
	body.pages = 3
	body.university = new Object({
		name: name,
		degree: degree,
		degreeType: degreeType,
		specialization: specialization,
		completedDegree: completedDegree,
		statusDegree: statusDegree,
		localProof: localProof,
	})

	const updated = await User.findByIdAndUpdate(
		{ _id: user.id },
		{
			$set: {
				university: body.university,
				pages: body.pages,
				detailImgs: body.images
			},
		},
		{
			new: true,
		}
	)
	res.status(200).json(updated)
})

const description = asyncHandler(async (req, res) => {
	const { user, body } = req

	body.pages = 4
	body.profile = new Object({
		headline: body.headline,
		introduction: body.introduction,
		workExperience: body.workExperience,
		mentorshipImpact: body.mentorshipImpact,
	})
	const updated = await User.findByIdAndUpdate({ _id: user.id }, body, {
		new: true,
	})
	res.status(200).json(updated)
})

const videoLink = asyncHandler(async (req, res) => {
	const { user, body } = req
	const { video, videoLink } = body
	const newContent = {}

	body.pages = 5

	video
		? (newContent["videoCloud"] = video)
		: (newContent["videoLink"] = videoLink)

	const updated = await User.findByIdAndUpdate({ _id: user.id }, newContent, {
		new: true,
	})
	res.status(200).json(updated)
})

const availability = asyncHandler(async (req, res) => {
	const { user, body } = req
	body.pages = 6

	const updated = await User.findByIdAndUpdate({ _id: user.id }, body, {
		new: true,
	})
	res.status(200).json(updated)
})

const pricing = asyncHandler(async (req, res) => {
	const { user, body } = req
	body.pages = 7
	body.isCompleted = true

	const updated = await User.findByIdAndUpdate({ _id: user.id }, body, {
		new: true,
	})

	// Send maiml to user for compeleting the process successfully
	//sendMail functionlaity

	res.status(200).json(updated)
})

export default {
	about,
	education,
	availability,
	description,
	create,
	pricing,
	profile,
	videoLink,
	getAbout,
	getVideo,
	getDescription,
	getPricing,
	getSubject,
	getBackground,
	getProfile,
	getMentorProfile,
	getData
};
