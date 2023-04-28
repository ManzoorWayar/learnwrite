import express from "express";
import userController from "../../controllers/user.js";
import userValidator from "../../middleware/validators/users/user.js";
import { authenticate, authorize } from "../../middleware/authMiddleware.js";

const router = express.Router()

router.use(authenticate)

router
    .route("/change-status")
    .put(
        authorize("superAdmin", "mentor"),
        userValidator.mentorStatus,
        userController.mentorStatus
    )

router
    .route('/mentor')
    .get(authorize("superAdmin", "mentor"), userController.getMentors)

router
    .route('/active-mentors')
    .get(authorize("superAdmin", "mentor"), userController.activeMentors)

router
    .route('/pending-mentors')
    .get(authorize("superAdmin", "mentor"), userController.pendingMentors)

export default router
