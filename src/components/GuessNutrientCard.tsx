import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";
import confetti from "canvas-confetti";

type GuessNutrientCardProps = {
  emoji: string;
  name: string; // <-- new
  options: string[];
  correct: string;
  explanation: string;
  onAnswered: (isCorrect: boolean) => void;
};

const GuessNutrientCard = ({ emoji, name, options, correct, explanation, onAnswered }: GuessNutrientCardProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const correctSound = useMemo(() => new Audio("/sounds/correct.mp3"), []);
const wrongSound = useMemo(() => new Audio("/sounds/wrong.mp3"), []);
const winSound = useMemo(() => new Audio("/sounds/applause.mp3"), []);

  const handleAnswer = (option: string) => {
    if (answered) return;

    setSelected(option);
    setAnswered(true);

    if (option === correct) {
  confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  correctSound.play();
  toast.success("Correct! 🎉 You're amazing!");
  onAnswered(true); // ⬅️ notify parent it's correct
} else {
  wrongSound.play();
  toast.error("Oops! Not quite. Try again!");
  onAnswered(false); // ⬅️ notify parent it's wrong
}
  };
  useEffect(() => {
  setAnswered(false);
  setSelected(null);
}, [emoji]); // 👈 This will reset when a new emoji (new question) is passed

  const reset = () => {
    setSelected(null);
    setAnswered(false);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-md">
      <CardHeader>
        <CardTitle className="text-center">
  <div className="text-6xl animate-bounce">{emoji}</div> {/* bounce animation */}
  <div className="text-xl font-medium mt-2 text-gray-700">{name}</div>
</CardTitle>

      </CardHeader>
      <CardContent className="space-y-4">
        {options.map((option) => {
          const isCorrect = option === correct;
          const isSelected = option === selected;

          let style =
            "w-full p-3 border-2 text-left transition-all rounded hover:border-green-300";
          if (answered) {
            if (isCorrect) {
              style += " border-green-500 bg-green-50 text-green-800";
            } else if (isSelected) {
              style += " border-red-500 bg-red-50 text-red-800";
            } else {
              style += " opacity-50";
            }
          } else {
            style += " border-gray-200 hover:bg-gray-50";
          }

          return (
            <button
              key={option}
              className={style}
              onClick={() => handleAnswer(option)}
              disabled={answered}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {answered && (
                  <>
                    {isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                  </>
                )}
              </div>
            </button>
          );
        })}

        {answered && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded text-blue-700">
            <strong>Why?</strong> {explanation}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GuessNutrientCard;
