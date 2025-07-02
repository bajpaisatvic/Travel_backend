import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Package } from "../models/package.models.js";
import { Category } from "../models/category.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPackage = asyncHandler(async (req, res) => {
  const { name, description, category, price } = req.body;

  if (req.user?.isAdmin === false) {
    throw new ApiError(404, "You are not admin!");
  }

  if (!name || !description || !category || !price) {
    throw new ApiError(400, "These values are required");
  }

  const existingPackage = await Package.findOne({
    name,
  });

  if (existingPackage) {
    throw new ApiError(409, "This package already existed");
  }

  const categoryRef = await Category.findOne({
    name: new RegExp(`^${category}$`, "i"),
  });

  if (!categoryRef) {
    throw new ApiError(400, "Not a valid category");
  }

  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image not found");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(
      403,
      "something went wrong while uploading image to cloudinary"
    );
  }

  const newpackage = await Package.create({
    name,
    description,
    image: image.url,
    category: categoryRef._id,
    price,
  });

  const createdPackage = await Package.findById(newpackage._id);

  if (!createdPackage) {
    throw new ApiError(500, "something went wrong while creating package");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdPackage, "New package created Successfully")
    );
});

const getPackageById = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  // if (req.user?.isAdmin === false) {
  //   throw new ApiError(404, "You are not admin!");
  // }

  if (!packageId) {
    throw new ApiError(400, "Package Id is required");
  }

  if (!mongoose.isValidObjectId(packageId)) {
    throw new ApiError(400, "Not a valid package Id");
  }

  const foundPackage = await Package.findById(
    new mongoose.Types.ObjectId(packageId)
  );

  if (!foundPackage) {
    throw new ApiError(404, "Package does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, foundPackage, "Package found successfully!"));
});

const deletePackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  if (req.user?.isAdmin === false) {
    throw new ApiError(404, "You are not admin!");
  }
  if (!packageId) {
    throw new ApiError(400, "Package Id is required");
  }

  if (!mongoose.isValidObjectId(packageId)) {
    throw new ApiError(400, "Not a valid package Id");
  }

  const deletedPackage = await Package.findByIdAndDelete(
    new mongoose.Types.ObjectId(packageId)
  );

  if (!deletedPackage) {
    throw new ApiError(404, "Package does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Package removed successfully!"));
});

const getAllPackages = asyncHandler(async (req, res) => {
  const { category } = req.query;

  const categoryDoc = await Category.findOne({ name: category });
  if (!categoryDoc) {
    throw new ApiError(404, "Category not found");
  }

  const packages = await Package.aggregate([
    {
      $match: {
        category: categoryDoc._id,
      },
    },

    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },

    { $unwind: "$categoryDetails" },

    {
      $project: {
        name: 1,
        description: 1,
        image: 1,
        category: {
          _id: "$categoryDetails._id",
          name: "$categoryDetails.name",
          about: "$categoryDetails.about",
        },
      },
    },
  ]);

  if (!packages || packages.length === 0) {
    throw new ApiError(500, "something went wrong while fetching packages");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, packages, "All packages fetched successfully"));
});

const getAllPackagesUnfiltered = asyncHandler(async (req, res) => {
  const packages = await Package.find().populate("category", "name about");

  return res
    .status(200)
    .json(new ApiResponse(200, packages, "All packages fetched"));
});

export {
  createPackage,
  getPackageById,
  deletePackage,
  getAllPackages,
  getAllPackagesUnfiltered,
};
