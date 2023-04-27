import express from "express"
import userController from "../controllers/user.js"
import userValidator from "../middleware/validators/users/user.js"
import imgUploader from "../utils/imgUploader.js"
import { authenticate, authorize } from "../middleware/authMiddleware.js"
import uploadToCloud from "../utils/uploadCloudinary.js"
import videoUploader from "../utils/videoUploader.js"
import videoToCloud from "../utils/videoToCloudinary.js"

const router = express.Router()

router.use(authenticate)

router
	.route("/about")
	.get(authorize("superAdmin", "mentor"), userController.getAbout)

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
		authorize("superAdmin", "mentor", "mentee"),
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
	.route("/change-status")
	.put(
		authorize("superAdmin", "mentor"),
		userValidator.mentorStatus,
		userController.mentorStatus
	)

export default router
