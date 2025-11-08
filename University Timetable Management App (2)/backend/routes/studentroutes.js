import express from "express";
import Student from "../models/Student.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Student.find();
  res.json(data);
});

router.post("/add", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.json({ message: "Student added!" });
});

export default router;
