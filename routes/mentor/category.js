import express from "express"
import categoryController from "../../controllers/mentor/category.js"
// import categoryValidator from "../middleware/validators/users/category.js";

const router = express.Router()

// add valdation
router
    .route("/").get(categoryController.getCategories)

router
    .route("/specialization").get(categoryController.specialization)

router
    .route("/professional").get(categoryController.professional)


export default router
