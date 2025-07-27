import mongoose from "mongoose";

// Comment Schema
const CommentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

// Answer Schema (For ASHA replies)
const AnswerSchema = new mongoose.Schema({
  answeredBy: { type: String, required: true }, // ASHA or health worker
  text: { type: String, required: true },
  verified: { type: Boolean, default: true },
  time: { type: Date, default: Date.now }
});

// Main Post Schema
const PostSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["post", "question"], default: "post" },
    author: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: null },
    audio: { type: String, default: null },
    tags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    comments: { type: [CommentSchema], default: [] },
    answers: { type: [AnswerSchema], default: [] } // For ASHA verified answers
  },
  { timestamps: true } // adds createdAt, updatedAt
);

export default mongoose.model("Post", PostSchema);
