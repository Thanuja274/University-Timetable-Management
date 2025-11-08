import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, default: "Admin" }
});

export default mongoose.model("Admin", adminSchema);
