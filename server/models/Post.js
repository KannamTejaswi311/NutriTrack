import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: String,
  text: String,
  time: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  author: String,
  avatar: String,
  time: { type: Date, default: Date.now },
  content: String,
  likes: { type: Number, default: 0 },
  tags: [String],
  image: String,
  audio: String,
  flagged: { type: Boolean, default: false },
  comments: [commentSchema]
});

export default mongoose.model("Post", postSchema);
