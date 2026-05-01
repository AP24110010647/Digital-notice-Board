import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    originalName: String,
    fileName: String,
    mimeType: String,
    size: Number,
    url: String
  },
  { _id: false }
);

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    expiryDate: {
      type: Date,
      required: true
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    attachment: {
      type: attachmentSchema,
      default: null
    },
    image: {
      type: String,
      default: ""
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

noticeSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Notice", noticeSchema);
