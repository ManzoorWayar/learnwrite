<<<<<<< HEAD
import express from "express";
import imgUploader from "../../utils/imgUploader.js";
import userController from "../../controllers/user.js";
import videoUploader from "../../utils/videoUploader.js";
import videoToCloud from "../../utils/videoToCloudinary.js";
import uploadToCloud from "../../utils/uploadCloudinary.js";
import userValidator from "../../middleware/validators/users/user.js";
import { authenticate, authorize } from "../../middleware/authMiddleware.js";
import User from "../../models/User.js";
import advancedResults from "../../middleware/advancedResult.js";
=======
import express from "express"
import imgUploader from "../../utils/imgUploader.js"
import userController from "../../controllers/user.js"
import videoUploader from "../../utils/videoUploader.js"
import videoToCloud from "../../utils/videoToCloudinary.js"
import uploadToCloud from "../../utils/uploadCloudinary.js"
import userValidator from "../../middleware/validators/users/user.js"
import { authenticate, authorize } from "../../middleware/authMiddleware.js"
>>>>>>> 3090d0f79a2e89c119984056e862233ffa72e37f

const router = express.Router()

router.use(authenticate)

router
<<<<<<< HEAD
	.route('/mentor-profile')
	.get(authorize("superAdmin", "mentor"), advancedResults(User), userController.getMentorProfile)
=======
	.route("/mentor-profile")
	.get(authorize("superAdmin", "mentor"), userController.getMentorProfile)
>>>>>>> 3090d0f79a2e89c119984056e862233ffa72e37f

router
	.route("/about")
	.get(authorize("superAdmin", "mentor"), userController.getAbout)

router
	.route("/profile")
	.get(authorize("superAdmin", "mentor"), userController.getProfile)

router
	.route("/video")
	.get(authorize("superAdmin", "mentor"), userController.getVideo)

router
	.route("/description")
	.get(authorize("superAdmin", "mentor"), userController.getDescription)

router
	.route("/subject")
	.get(authorize("superAdmin", "mentor"), userController.getSubject)

router
	.route("/pricing")
	.get(authorize("superAdmin", "mentor"), userController.getPricing)

router
	.route("/background")
	.get(authorize("superAdmin", "mentor"), userController.getBackground)

router
	.route("/about")
	.put(
		authorize("superAdmin", "mentor"),
		userValidator.about,
		userController.about
	)

router
	.route("/profile")
	.put(
		authorize("superAdmin", "mentor"),
		imgUploader([{ name: "profileImg" }]),
		uploadToCloud,
		userValidator.profileImg,
		userController.profile
	)

router
	.route("/education")
	.put(
		authorize("superAdmin", "mentor"),
		imgUploader([{ name: "citizenship" }, { name: "diploma" }]),
		uploadToCloud,
		userValidator.education,
		userController.education
	)

router
	.route("/description")
	.put(
		authorize("superAdmin", "mentor"),
		userValidator.description,
		userController.description
	)

router
	.route("/skill")
	.put(
		authorize("superAdmin", "mentor"),
		videoUploader,
		userValidator.video,
		videoToCloud,
		userController.videoLink
	)

router
	.route("/availability")
	.put(
		authorize("superAdmin", "mentor"),
		userValidator.availability,
		userController.availability
	)

router
	.route("/pricing")
	.put(
		authorize("superAdmin", "mentor"),
		userValidator.pricing,
		userController.pricing
	)

router
	.route("/pricing")
	.put(
		authorize("superAdmin", "mentor"),
		userValidator.pricing,
		userController.pricing
	)

router
	.route("/user-data")
	.get(authorize("superAdmin", "mentor"), userController.getData)

router
	.route("/change-status")
	.put(
		authorize("superAdmin", "mentor"),
		userValidator.mentorStatus,
		userController.mentorStatus
	)
export default router
