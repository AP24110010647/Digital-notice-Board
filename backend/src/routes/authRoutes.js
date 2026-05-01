import express from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { createToken } from "../utils/createToken.js";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });
  }

  next();
};

const ensureDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database unavailable. Start MongoDB and try again." });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT secret is not configured" });
  }

  next();
};

const sendAuthResponse = (res, user) => {
  const token = createToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
};

router.post(
  "/register",
  ensureDatabase,
  [
    body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2-80 characters"),
    body("email").isEmail().normalizeEmail().withMessage("A valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "Email is already registered" });
      }

      const userCount = await User.countDocuments();
      const user = await User.create({
        name,
        email,
        password,
        role: userCount === 0 ? "admin" : "user"
      });

      sendAuthResponse(res, user);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  ensureDatabase,
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email }).select("+password");

      if (!user || !(await user.comparePassword(req.body.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      sendAuthResponse(res, user);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/me", authMiddleware, (req, res) => {
  sendAuthResponse(res, req.user);
});

export default router;
