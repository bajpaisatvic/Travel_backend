import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPackage,
  deletePackage,
  getAllPackages,
  getPackageById,
  getAllPackagesUnfiltered,
} from "../controllers/package.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/all", getAllPackagesUnfiltered);
router.route("/add").post(verifyJWT, upload.single("image"), createPackage);
router.route("/:packageId").delete(verifyJWT, deletePackage);
router.route("/:packageId").get(getPackageById);

router.route("/").get(getAllPackages);

export { router };
