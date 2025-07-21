import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// ✅ Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ time: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create a new post
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Like a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add comment
router.post("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push(req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Flag/Unflag post
router.put("/:id/flag", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.flagged = !post.flagged;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
