import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "./models/category.models.js"; // adjust path if needed
import { DB_NAME } from "./constants.js"; // adjust path if needed

dotenv.config();

const categories = [
  {
    _id: new mongoose.Types.ObjectId("000000000000000000000001"),
    name: "Adventure",
    about: "Thrilling outdoor adventures and experiences.",
  },
  {
    _id: new mongoose.Types.ObjectId("000000000000000000000002"),
    name: "Relaxation",
    about: "Calm and peaceful vacation destinations.",
  },
  {
    _id: new mongoose.Types.ObjectId("000000000000000000000003"),
    name: "Cultural",
    about: "Trips focused on history, art, and local traditions.",
  },
  {
    _id: new mongoose.Types.ObjectId("000000000000000000000004"),
    name: "Wildlife",
    about: "Explore flora and fauna in natural habitats.",
  },
  {
    _id: new mongoose.Types.ObjectId("000000000000000000000005"),
    name: "Luxury",
    about: "High-end, premium travel packages.",
  },
  {
    _id: new mongoose.Types.ObjectId("000000000000000000000006"),
    name: "Budget",
    about: "Affordable and value-for-money travel experiences.",
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    await Category.deleteMany(); // Clear existing categories (optional)
    await Category.insertMany(categories); // Insert new categories
    console.log("✅ Categories seeded successfully");
    process.exit(0); // Exit after success
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1); // Exit with error
  }
};

seedCategories();
