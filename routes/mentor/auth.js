import express from "express";
import authController from "../../controllers/mentor/auth.js";
import authValidator from "../../middleware/validators/users/auth.js";

const router = express.Router();

router.route("/sign-up").post(authValidator.signup, authController.signup);

router.route("/login").post(authValidator.login, authController.login);

router.post("/verify", authValidator.verifyEmail, authController.verifyEmail);

router.post(
  "/resend-token",
  authValidator.verifyEmail,
  authController.verifyEmail
);

router.route("/refresh").get(authController.refresh);

router.route("/logout").post(authController.logout);

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

export default router;
