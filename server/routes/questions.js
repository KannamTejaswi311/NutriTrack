import express from "express";
import Question from "../models/Question.js";
const router = express.Router();

// Get all questions
router.get("/", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// Add a question
router.post("/", async (req, res) => {
  const { question, askedBy } = req.body;
  const newQ = new Question({ question, askedBy, answers: [] });
  await newQ.save();
  res.json(newQ);
});

// ASHA reply to a question
router.post("/:id/answer", async (req, res) => {
  const { id } = req.params;
  const { answer, answeredBy, role } = req.body;

  const question = await Question.findById(id);
  if (!question) return res.status(404).json({ error: "Question not found" });

  question.answers.push({ answer, answeredBy, role, verified: true });
  await question.save();
  res.json(question);
});

export default router;
