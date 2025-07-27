import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import questionRoutes from "./routes/questions.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Post Schema
const postSchema = new mongoose.Schema({
  author: String,
  avatar: String,
  time: String,
  content: String,
  likes: { type: Number, default: 0 },
  replies: { type: Number, default: 0 },
  tags: [String],
  image: String,
  audio: String,
  flagged: { type: Boolean, default: false },
  isHealthWorker: { type: Boolean, default: false },
  comments: [
    {
      author: String,
      text: String,
      time: String
    }
  ] // ✅ Add comments array
});
// Temporary in-memory storage
let posts = [
  {
    _id: "1",
    author: "Alice",
    avatar: "👩",
    time: "2 hours ago",
    content: "Welcome to our community! Share your health tips here.",
    likes: 5,
    replies: 2,
    tags: ["health", "community"],
    image: null,
    audio: null,
    flagged: false,
    isHealthWorker: true
  },
  {
    _id: "2",
    author: "John",
    avatar: "🧑",
    time: "1 hour ago",
    content: "Try this amazing budget nutrition recipe!",
    likes: 8,
    replies: 3,
    tags: ["recipes", "budget-nutrition"],
    image: null,
    audio: null,
    flagged: false
  }
];

const Post = mongoose.model("Post", postSchema);

// Routes
app.get("/api/posts", async (req, res) => {
  let dbPosts = await Post.find().sort({ _id: -1 });

  if (dbPosts.length === 0) {
    // Insert dummy posts into DB
    await Post.insertMany(posts); // "posts" is your dummy array
    dbPosts = await Post.find().sort({ _id: -1 });
  }

  res.json(dbPosts);
});

app.post("/api/posts", async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.json(newPost);
});

app.put("/api/posts/:id/like", async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
  res.json(post);
});

app.put("/api/posts/:id/reply", async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { replies: 1 } }, { new: true });
  res.json(post);
});

app.put("/api/posts/:id/flag", async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.flagged = !post.flagged;
  await post.save();
  res.json(post);
});
app.put("/api/posts/:id/comment", async (req, res) => {
  try {
    const { author, text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      author,
      text,
      time: new Date().toLocaleString()
    });

    post.replies += 1; // update reply count
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.use("/api/questions", questionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
