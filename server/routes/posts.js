import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

/**
 * ✅ Get all posts (or filter by type)
 * Example:
 * GET /api/posts           -> All posts
 * GET /api/posts?type=question -> Only questions
 */
router.get("/", async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Create a new post
 * Required: author, content
 * Optional: type (default "general")
 */
router.post("/", async (req, res) => {
  try {
    const { author, content, type, image, audio, tags } = req.body;

    if (!author || !content) {
      return res.status(400).json({ message: "Author and content are required" });
    }

    const newPost = new Post({
      author,
      content,
      type: type || "general",
      image: image || null,
      audio: audio || null,
      tags: tags || [],
      likes: 0,
      replies: 0,
      flagged: false,
      comments: [],
      createdAt: new Date()
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Like a post
 */
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Add a comment (reply)
 */
router.put("/:id/comment", async (req, res) => {
  try {
    const { author, text } = req.body;
    if (!author || !text) {
      return res.status(400).json({ message: "Author and text are required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ author, text, time: new Date().toISOString() });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Flag or unflag a post
 */
router.put("/:id/flag", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.flagged = !post.flagged;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
