import crypto from "crypto";
import fs from "fs";
import path from "path";
import express from "express";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/upload.js";
import Notice from "../models/Notice.js";

const router = express.Router();
const dataDir = path.resolve("data");
const noticesFile = path.join(dataDir, "notices.json");

const isMongoReady = () => mongoose.connection.readyState === 1;

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const activeNoticeQuery = () => ({ expiryDate: { $gte: startOfToday() } });

const buildAttachment = (file) =>
  file
    ? {
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`
      }
    : null;

const removeAttachmentFile = (attachment) => {
  if (!attachment?.fileName) return;
  const filePath = path.resolve("uploads", attachment.fileName);
  fs.promises.unlink(filePath).catch(() => {});
};

const readStoredNotices = async () => {
  await fs.promises.mkdir(dataDir, { recursive: true });

  try {
    const content = await fs.promises.readFile(noticesFile, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const writeStoredNotices = async (notices) => {
  await fs.promises.mkdir(dataDir, { recursive: true });
  await fs.promises.writeFile(noticesFile, JSON.stringify(notices, null, 2));
};

const isActiveNotice = (notice) => new Date(notice.expiryDate) >= startOfToday();

const matchesFilters = (notice, { category, search }) => {
  if (!isActiveNotice(notice)) return false;
  if (category && notice.category !== category) return false;

  if (!search) return true;

  const keyword = search.toLowerCase();
  return [notice.title, notice.description, notice.category]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(keyword));
};

const sortNotices = (a, b) => {
  if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
    return a.isPinned ? -1 : 1;
  }

  return new Date(b.createdAt) - new Date(a.createdAt);
};

const getNoticePayload = (req, existing = {}) => {
  const attachment = req.file ? buildAttachment(req.file) : existing.attachment || null;

  return {
    ...existing,
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    expiryDate: new Date(req.body.expiryDate).toISOString(),
    isPinned: req.body.isPinned === true || req.body.isPinned === "true",
    attachment,
    image: existing.image || "",
    createdBy: existing.createdBy || req.user?._id || null
  };
};

const validateNotice = [
  body("title").trim().isLength({ min: 3, max: 120 }).withMessage("Title must be 3-120 characters"),
  body("description")
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage("Description must be 5-1000 characters"),
  body("category").trim().isLength({ min: 2, max: 50 }).withMessage("Category must be 2-50 characters"),
  body("expiryDate").isISO8601().toDate().withMessage("A valid expiry date is required"),
  body("isPinned").optional().toBoolean()
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });
  }
  next();
};

router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const { category, search } = req.query;

    if (isMongoReady()) {
      const query = activeNoticeQuery();

      if (category) {
        query.category = category;
      }

      if (search) {
        const pattern = new RegExp(escapeRegex(search), "i");
        query.$or = [{ title: pattern }, { description: pattern }, { category: pattern }];
      }

      const notices = await Notice.find(query).sort({ isPinned: -1, createdAt: -1 });
      return res.json({ notices, newCount: 0 });
    }

    const notices = (await readStoredNotices())
      .filter((notice) => matchesFilters(notice, { category, search }))
      .sort(sortNotices);

    res.json({ notices, newCount: 0 });
  } catch (error) {
    next(error);
  }
});

router.get("/categories", async (req, res, next) => {
  try {
    if (isMongoReady()) {
      const categories = await Notice.distinct("category", activeNoticeQuery());
      return res.json(categories.sort((a, b) => a.localeCompare(b)));
    }

    const categories = [...new Set((await readStoredNotices()).filter(isActiveNotice).map((notice) => notice.category))];
    res.json(categories.sort((a, b) => a.localeCompare(b)));
  } catch (error) {
    next(error);
  }
});

router.post("/", roleMiddleware("admin"), upload.single("attachment"), validateNotice, validate, async (req, res, next) => {
  try {
    if (isMongoReady()) {
      const notice = await Notice.create(getNoticePayload(req));
      req.io?.emit("notice:created", notice);
      return res.status(201).json(notice);
    }

    const notices = await readStoredNotices();
    const now = new Date().toISOString();
    const notice = {
      _id: crypto.randomUUID(),
      ...getNoticePayload(req),
      createdAt: now,
      updatedAt: now
    };

    notices.unshift(notice);
    await writeStoredNotices(notices);
    req.io?.emit("notice:created", notice);
    res.status(201).json(notice);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", roleMiddleware("admin"), upload.single("attachment"), validateNotice, validate, async (req, res, next) => {
  try {
    if (isMongoReady()) {
      const notice = await Notice.findById(req.params.id);

      if (!notice) {
        return res.status(404).json({ message: "Notice not found" });
      }

      if (req.file) {
        removeAttachmentFile(notice.attachment);
      }

      Object.assign(notice, getNoticePayload(req, notice.toObject()));
      await notice.save();
      req.io?.emit("notice:updated", notice);
      return res.json(notice);
    }

    const notices = await readStoredNotices();
    const index = notices.findIndex((notice) => notice._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: "Notice not found" });
    }

    if (req.file) {
      removeAttachmentFile(notices[index].attachment);
    }

    const updatedNotice = {
      ...getNoticePayload(req, notices[index]),
      updatedAt: new Date().toISOString()
    };

    notices[index] = updatedNotice;
    await writeStoredNotices(notices);
    req.io?.emit("notice:updated", updatedNotice);
    res.json(updatedNotice);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", roleMiddleware("admin"), async (req, res, next) => {
  try {
    if (isMongoReady()) {
      const notice = await Notice.findById(req.params.id);

      if (!notice) {
        return res.status(404).json({ message: "Notice not found" });
      }

      removeAttachmentFile(notice.attachment);
      await notice.deleteOne();
      req.io?.emit("notice:deleted", { id: req.params.id });
      return res.json({ message: "Notice deleted" });
    }

    const notices = await readStoredNotices();
    const notice = notices.find((item) => item._id === req.params.id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    removeAttachmentFile(notice.attachment);
    await writeStoredNotices(notices.filter((item) => item._id !== req.params.id));
    req.io?.emit("notice:deleted", { id: req.params.id });
    res.json({ message: "Notice deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
