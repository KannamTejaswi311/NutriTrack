import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  answer: String,
  answeredBy: String,
  role: String,
  verified: Boolean
});

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  askedBy: String,
  answers: [AnswerSchema]
});

export default mongoose.model("Question", QuestionSchema);
