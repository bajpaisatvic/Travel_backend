import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addReview, getAllReviews } from "../controllers/review.controllers.js";

const router = Router();
router.route("/").get(getAllReviews);
router.route("/").post(addReview);

export { router };
