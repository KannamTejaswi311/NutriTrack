import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, RefreshCcw } from "lucide-react";
import clsx from "clsx";
import confetti from "canvas-confetti";
import Header from "@/components/Header";

type Pair = {
  food: string;
  nutrient: string;
  foodEmoji: string;
  nutrientEmoji: string;
};

const pairs: Pair[] = [
  { food: "Carrot", nutrient: "Vitamin A", foodEmoji: "🥕", nutrientEmoji: "🧴" },
  { food: "Milk", nutrient: "Calcium", foodEmoji: "🥛", nutrientEmoji: "🦴" },
  { food: "Spinach", nutrient: "Iron", foodEmoji: "🥬", nutrientEmoji: "🧲" },
  { food: "Orange", nutrient: "Vitamin C", foodEmoji: "🍊", nutrientEmoji: "💊" },
  { food: "Fish", nutrient: "Omega-3", foodEmoji: "🐟", nutrientEmoji: "🧠" },
  { food: "Banana", nutrient: "Potassium", foodEmoji: "🍌", nutrientEmoji: "⚡" },
];

const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5);
const nutrientFacts: Record<string, string> = {
  "Vitamin A": "Vitamin A keeps your eyes sharp! 👀",
  "Calcium": "Calcium makes your bones strong! 🦴",
  "Iron": "Iron boosts your blood and energy! 💪🩸",
  "Vitamin C": "Vitamin C protects your immune system! 🛡️",
  "Omega-3": "Omega-3 supports your brain and heart! 🧠❤️",
  "Potassium": "Potassium keeps your muscles and nerves working! ⚡💪",
};

const MemoryMatchCard = () => {
  const [shuffledCards, setShuffledCards] = useState<{ id: number; text: string; emoji: string; type: "food" | "nutrient"; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState<number>(0);
  const matchSound = new Audio("/sounds/correct.mp3");
const wrongSound = new Audio("/sounds/wrong.mp3");

  useEffect(() => {
    const allCards = pairs.flatMap((pair, idx) => [
  {
    id: idx * 2,
    text: pair.food,
    emoji: pair.foodEmoji,
    type: "food",
    matched: false,
  },
  {
    id: idx * 2 + 1,
    text: pair.nutrient,
    emoji: pair.nutrientEmoji,
    type: "nutrient",
    matched: false,
  },
]);

    setShuffledCards(shuffle(allCards));
    setFlippedIndices([]);
    setMatches(0);
  }, []);
const [fact, setFact] = useState<string | null>(null);

  const handleFlip = (index: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || shuffledCards[index].matched) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = shuffledCards[first];
      const secondCard = shuffledCards[second];

      const isMatch =
        firstCard.type !== secondCard.type &&
        pairs.some(
          (pair) =>
            (pair.food === firstCard.text && pair.nutrient === secondCard.text) ||
            (pair.food === secondCard.text && pair.nutrient === firstCard.text)
        );

      setTimeout(() => {
        if (isMatch) {
          toast.success("Match found! ✅");
          const nutrient = firstCard.type === "nutrient" ? firstCard.text : secondCard.text;
          setFact(nutrientFacts[nutrient]);
          matchSound.play();
          setShuffledCards((prev) =>
            prev.map((card) =>
              card.text === firstCard.text || card.text === secondCard.text
                ? { ...card, matched: true }
                : card
            )
          );
          setMatches(matches + 1);
        } else {
          wrongSound.play();
          toast.error("No match! Try again.");
        }
        setFlippedIndices([]);
      }, 1000);
    }
  };

  const handleReset = () => {
    const allCards = pairs.flatMap((pair, idx) => [
      { id: idx * 2, text: pair.food, emoji: pair.foodEmoji, type: "food", matched: false },
      { id: idx * 2 + 1, text: pair.nutrient,  emoji: pair.nutrientEmoji, type: "nutrient", matched: false },
    ]);
    setShuffledCards(shuffle(allCards));
    setFlippedIndices([]);
    setMatches(0);
  };

  const allMatched = matches === pairs.length;

    useEffect(() => {
  if (allMatched) {
    const applause = new Audio("/sounds/applause.mp3");
    applause.play();
    confetti({ particleCount: 100, spread: 70 });
  }
}, [allMatched]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 ">
      <Header />
    <Card className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border-4 border-yellow-200 max-w-6xl mx-auto transition-all duration-300 transform hover:scale-90">
      <CardHeader>
        <CardTitle className="text-xl text-center">🧠 Memory Match: Food & Nutrients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-4 border-pink-300 rounded-xl p-4 bg-white/70 shadow-inner grid grid-cols-2 sm:grid-cols-4 gap-4">
          {shuffledCards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index) || card.matched;
            return (
              <div
  key={card.id}
  className={clsx(
    "h-24 sm:h-28 md:h-32 w-full flex items-center justify-center rounded-lg shadow-lg cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl transform perspective",
    isFlipped
      ? "bg-green-100 text-green-900 rotate-y-180 border border-green-300"
      : "bg-gray-200 text-transparent hover:bg-gray-300"
  )}
  onClick={() => handleFlip(index)}
>
                {isFlipped ? (
    <div className="flex flex-col items-center">
      <div className="text-2xl sm:text-3xl mb-1">{card.emoji}</div>
      <span>{card.text}</span>
    </div>
) : "❓"}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3 mt-4">
          {allMatched ? (
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <CheckCircle className="w-5 h-5" />
              All pairs matched! Great memory!
            </div>
          ) : (
            <p className="text-center text-yellow-700 font-semibold text-lg mb-2">
  🧸 Help Teddy find the right nutrients! Match the pairs!</p>
          )}

          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Reset Game
          </Button>
        </div>
      </CardContent>
      {fact && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full animate-fade-in">
      <h2 className="text-xl font-bold mb-2">🧠 Did You Know?</h2>
      <p className="text-gray-700 mb-4">{fact}</p>
      <Button onClick={() => setFact(null)} className="bg-green-600 text-white hover:bg-green-700">
        Got it!
      </Button>
    </div>
  </div>
)}
    </Card>
    </div>
  );
};

export default MemoryMatchCard;
