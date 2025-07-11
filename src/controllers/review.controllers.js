import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { Review } from "../models/reviews.models.js";

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

const addReview = asyncHandler(async (req, res) => {
  const { fullname, email, phoneNumber, message } = req.body;
  if (!fullname || !email || !phoneNumber || !message) {
    throw new ApiError(404, "These fields are required");
  }
  const body = `
New Contact Form Submission:

Name: ${fullname}
Email: ${email}
Phone: ${phoneNumber}
Message: ${message}
    `;

  await sendEmail({
    to: "bajpaisatvic@gmail.com",
    subject: "New Contact Form Submission - Bumped Travel",
    text: body,
  });
  const review = await Review.create({
    fullname,
    email,
    phoneNumber,
    message,
  });

  const createdReview = await Review.findById(review._id);
  if (!createdReview) {
    throw new ApiError(500, "Something went wrong!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdReview, "Review saved successfully!"));
});

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find();
  //   if (!req.user.isAdmin) {
  //     throw new ApiError(500, "You are not authorized to access this route");
  //   }
  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully!"));
});

export { addReview, getAllReviews };
