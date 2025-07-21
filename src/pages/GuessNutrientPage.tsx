import { useState, useEffect, useCallback } from "react";
import GuessNutrientCard from "@/components/GuessNutrientCard";
import Header from "@/components/Header";
import confetti from "canvas-confetti";
import { toast } from "sonner";

const originalQuestions = [
  {
    emoji: "🍚",
    name: "Rice",
    options: ["Protein", "Carbohydrates", "Fats", "Vitamins"],
    correct: "Carbohydrates",
    explanation: "Rice is full of carbohydrates, which give us energy to play and run!"
  },
  {
    emoji: "🍗",
    name: "Chicken",
    options: ["Fats", "Vitamins", "Protein", "Fiber"],
    correct: "Protein",
    explanation: "Chicken is rich in protein that helps build strong muscles!"
  },
  {
    emoji: "🥕",
    name: "Carrot",
    options: ["Vitamin A", "Iron", "Protein", "Calcium"],
    correct: "Vitamin A",
    explanation: "Carrots are rich in Vitamin A which is great for your eyes!"
  },
  {
    emoji: "🥛",
    name: "Milk",
    options: ["Calcium", "Iron", "Vitamin C", "Carbohydrates"],
    correct: "Calcium",
    explanation: "Milk is full of calcium which makes your bones and teeth strong!"
  },
  {
    emoji: "🍊",
    name: "Orange",
    options: ["Vitamin D", "Protein", "Vitamin C", "Fat"],
    correct: "Vitamin C",
    explanation: "Oranges are rich in Vitamin C, which keeps your immunity strong!"
  }
];

const GuessNutrientPage = () => {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  // Shuffle the questions when component loads
const [guessQuestions, setGuessQuestions] = useState(() =>
  [...originalQuestions].sort(() => 0.5 - Math.random())
);
  const current = guessQuestions[index];
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds timer
const [timerActive, setTimerActive] = useState(true);

  const handleAnswered = (isCorrect: boolean) => {
    setAnswered(true);
    setTimerActive(false);
    if (isCorrect) setScore((prev) => prev + 1);
  };

  const handleNext = useCallback(() => {
  if (index < guessQuestions.length - 1) {
    setIndex((prev) => prev + 1);
    setTimeLeft(10);
    setTimerActive(true);
    setAnswered(false);
  } else {
    setFinished(true);
  }
}, [index, guessQuestions.length]); // dependencies used inside this function

  const handleRetry = () => {
    setIndex(0);
    setTimeLeft(10);
    setTimerActive(true);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

useEffect(() => {
  if (finished && score === guessQuestions.length) {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
    const winSound = new Audio("/sounds/applause.mp3");
    winSound.play();
  }
}, [finished, score, guessQuestions.length]);
useEffect(() => {
  if (!answered && timerActive && timeLeft > 0) {
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }

  if (timeLeft === 0 && !answered) {
    const timesUpSound = new Audio("/sounds/times-up.mp3");
    timesUpSound.play();
    toast.info("⏰ Time's up! Moving to next question.");
    setAnswered(true);
    setTimeout(handleNext, 1500); // Delay to show message
  }
}, [timeLeft, answered, timerActive, handleNext]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-800">
          🍅 Guess the Nutrient
        </h1>
        {!finished && (
  <div className="text-center text-sm text-gray-600 mb-2">
    Question {index + 1} of {guessQuestions.length}
  </div>
)}
        {!finished && (
  <div className="text-center text-md font-medium text-red-600 mb-4">
    ⏱️ Time Left: {timeLeft}s
  </div>
)}
        <div className="max-w-xl mx-auto">
          {!finished ? (
            <>
              <GuessNutrientCard
                emoji={current.emoji}
                name={current.name}
                options={current.options}
                correct={current.correct}
                explanation={current.explanation}
                onAnswered={handleAnswered}
              />
              {answered && (
                <div className="text-center mt-4">
                  <button
                    onClick={handleNext}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
                  >
                    {index === guessQuestions.length - 1 ? "Finish ✅" : "Next 👉"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-4xl">
            🎉 All Questions Complete! {score === guessQuestions.length ? "🏆" : "✅"}
          </div>
          <div className="text-xl font-semibold text-green-700">
  Your Score: {score} / {guessQuestions.length}
</div>
              <div className="text-lg text-gray-700">
  {score === guessQuestions.length
    ? "Perfect! You're a nutrition hero! 🥇"
    : score >= 3
    ? "Great work! Keep learning! 🌟"
    : "Nice try! Let’s practice more! 🍀"}
</div>
              <button
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
              >
                🔁 Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuessNutrientPage;
