import express from "express"
import authController from "../../controllers/auth.js"
import authValidator from "../../middleware/validators/users/auth.js"

const router = express.Router()

router.route("/sign-up").post(authValidator.signup, authController.signup)

router.route("/login").post(authValidator.login, authController.login)

router.post("/verify", authValidator.verifyEmail, authController.verifyEmail)

router.post(
<<<<<<< HEAD
  "/resend-token",
  authValidator.verifyEmail,
  authController.verifyEmail
);
=======
	"/resend-token",
	authValidator.resendToken,
	authController.resendToken
)
>>>>>>> 3090d0f79a2e89c119984056e862233ffa72e37f

router.route("/refresh").get(authController.refresh)

router.route("/logout").post(authController.logout)

router.post(
	"/forgot-password",
	authValidator.forgotPassword,
	authController.forgotPassword
)
router.put(
	"/reset-password",
	authValidator.resetPassword,
	authController.resetPassword
)
export default router
