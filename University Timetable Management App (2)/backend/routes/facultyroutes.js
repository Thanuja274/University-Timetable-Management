import express from "express";
import Faculty from "../models/Faculty.js";
const router = express.Router();

// demo route to get all faculty
router.get("/", async (req, res) => {
  const data = await Faculty.find();
  res.json(data);
});

// add demo data
router.post("/add", async (req, res) => {
  const faculty = new Faculty(req.body);
  await faculty.save();
  res.json({ message: "Faculty added!" });
});

export default router;
