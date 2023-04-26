import express from "express";
import userController from "../controllers/user.js";
import userValidator from "../middleware/validators/users/user.js";
import imgUploader from "../utils/imgUploader.js";
import { authenticate } from "../middleware/authMiddleware.js";
import uploadToCloud from "../utils/uploadCloudinary.js";
import videoUploader from "../utils/videoUploader.js";
import videoToCloud from "../utils/videoToCloudinary.js";

const router = express.Router();

router
  .route("/about")
  .put(authenticate, userValidator.about, userController.about);

router
  .route("/profile")
  .put(
    authenticate,
    imgUploader([{ name: "profileImg" }]),
    uploadToCloud,
    userValidator.profileImg,
    userController.profile
  );

router
  .route("/education")
  .put(
    authenticate,
    imgUploader([{ name: "citizenship" }, { name: "diploma" }]),
    uploadToCloud,
    userValidator.education,
    userController.education
  );

router
  .route("/description")
  .put(authenticate, userValidator.description, userController.description);

router
  .route("/skill")
  .put(
    authenticate,
    videoUploader,
    userValidator.video,
    videoToCloud,
    userController.videoLink
  );

router
  .route("/availability")
  .put(authenticate, userValidator.availability, userController.availability);

router
  .route("/pricing")
  .put(authenticate, userValidator.pricing, userController.pricing);

export default router;
