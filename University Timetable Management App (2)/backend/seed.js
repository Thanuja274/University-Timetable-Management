import mongoose from "mongoose";
import dotenv from "dotenv";
import Faculty from "./models/Faculty.js";
import Student from "./models/Student.js";
import Admin from "./models/Admin.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Connected for seeding...");

await Faculty.deleteMany({});
await Student.deleteMany({});
await Admin.deleteMany({});

await Faculty.insertMany([
  { name: "Dr. Ramesh", email: "ramesh@univ.edu", department: "CSE", availableDays: ["Mon", "Wed"], courses: ["AI", "ML"] },
  { name: "Prof. Kavitha", email: "kavitha@univ.edu", department: "ECE", availableDays: ["Tue", "Thu"], courses: ["Networks", "Signals"] }
]);

await Student.insertMany([
  { name: "Arjun", email: "arjun@student.edu", department: "CSE", year: 3, enrolledCourses: ["AI", "ML"] },
  { name: "Sita", email: "sita@student.edu", department: "ECE", year: 2, enrolledCourses: ["Signals", "Networks"] }
]);

await Admin.insertMany([
  { name: "Admin1", email: "admin1@univ.edu" },
  { name: "Admin2", email: "admin2@univ.edu" }
]);

console.log("✅ Sample data inserted successfully!");
process.exit();
