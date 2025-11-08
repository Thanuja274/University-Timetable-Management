import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  availableDays: [String],
  courses: [String]
});

export default mongoose.model("Faculty", facultySchema);
