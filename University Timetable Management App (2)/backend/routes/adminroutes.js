import express from "express";
import Admin from "../models/Admin.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Admin.find();
  res.json(data);
});

router.post("/add", async (req, res) => {
  const admin = new Admin(req.body);
  await admin.save();
  res.json({ message: "Admin added!" });
});

export default router;
