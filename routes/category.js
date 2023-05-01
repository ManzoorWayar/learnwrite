import express from "express"
import categoryController from "../controllers/category.js"
// import categoryValidator from "../middleware/validators/users/category.js";

const router = express.Router()

// add valdation
router.route("/").get(categoryController.getCategories)

router.route("/:id").get(categoryController.getCategory)

router.route("/").post(categoryController.createCategory)

router.route("/:id").put(categoryController.updateCategory)

router.route("/:id").delete(categoryController.deleteCategory)

export default router
