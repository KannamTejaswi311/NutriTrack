
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { Star, CheckCircle, XCircle, Trophy } from "lucide-react";
import { toast } from "sonner";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const questions = [
    {
      question: "Which food group gives you the most energy?",
      options: ["Vegetables", "Grains and Cereals", "Fruits", "Dairy"],
      correct: 1,
      explanation: "Grains and cereals like rice, wheat, and millet provide carbohydrates which are our body's main source of energy!"
    },
    {
      question: "How many different colored vegetables should you eat in a day?",
      options: ["1-2 colors", "3-4 colors", "5+ colors", "Color doesn't matter"],
      correct: 2,
      explanation: "Eating vegetables of different colors ensures you get a variety of vitamins and minerals!"
    },
    {
      question: "What's the best way to cook vegetables to keep nutrients?",
      options: ["Deep frying", "Steaming", "Boiling for long time", "Raw only"],
      correct: 1,
      explanation: "Steaming vegetables helps retain most of their vitamins and minerals while making them easy to digest."
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    setTimeout(() => {
      if (answerIndex === questions[currentQuestion].correct) {
        setScore(score + 1);
        toast.success("Correct! Well done! 🎉");
      } else {
        toast.error("Not quite right, but great try! 💪");
      }

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
        } else {
          setShowResult(true);
        }
      }, 2000);
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect! You're a nutrition champion! 🏆";
    if (percentage >= 70) return "Great job! You know your nutrition well! 🌟";
    if (percentage >= 50) return "Good effort! Keep learning! 👍";
    return "Keep practicing! Every step counts! 💪";
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm text-center">
            <CardHeader>
              <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-yellow-600" />
              </div>
              <CardTitle className="text-3xl text-gray-800">Quiz Complete!</CardTitle>
              <CardDescription className="text-lg">
                {getScoreMessage()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-green-600">
                {score}/{questions.length}
              </div>
              
              <div className="flex justify-center gap-2">
                {Array.from({ length: questions.length }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-8 h-8 ${
                      i < score ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <Button
                  onClick={resetQuiz}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Take Quiz Again
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => window.history.back()}
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Nutrition Knowledge Quiz
              </h1>
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                {questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => {
                let buttonClass = "w-full p-4 text-left border-2 transition-all hover:border-green-300";
                
                if (selectedAnswer !== null) {
                  if (index === questions[currentQuestion].correct) {
                    buttonClass += " border-green-500 bg-green-50 text-green-800";
                  } else if (index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correct) {
                    buttonClass += " border-red-500 bg-red-50 text-red-800";
                  } else {
                    buttonClass += " border-gray-200 opacity-50";
                  }
                } else {
                  buttonClass += " border-gray-200 hover:bg-gray-50";
                }

                return (
                  <button
                    key={index}
                    onClick={() => selectedAnswer === null && handleAnswer(index)}
                    className={buttonClass}
                    disabled={selectedAnswer !== null}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {selectedAnswer !== null && (
                        <>
                          {index === questions[currentQuestion].correct && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correct && (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Explanation */}
          {selectedAnswer !== null && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-800 mb-2">Did you know?</h3>
                <p className="text-blue-700">{questions[currentQuestion].explanation}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
