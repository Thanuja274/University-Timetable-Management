import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  year: Number,
  enrolledCourses: [String]
});

export default mongoose.model("Student", studentSchema);
