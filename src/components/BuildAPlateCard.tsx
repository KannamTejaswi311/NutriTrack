import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import DraggableItem from "@/components/DraggableItem";
import DropZone from "@/components/DropZone";

type FoodItem = {
  name: string;
  category: "Protein" | "Vegetable" | "Grain" | "Fruit" | "Dairy";
};

type Plate = {
  Protein: FoodItem[];
  Vegetable: FoodItem[];
  Grain: FoodItem[];
};

const initialItems: FoodItem[] = [
  { name: "🍗 Chicken", category: "Protein" },
  { name: "🥬 Spinach", category: "Vegetable" },
  { name: "🍚 Rice", category: "Grain" },
  { name: "🌽 Corn", category: "Vegetable" },       // ✅ New Vegetable
  { name: "🥔 Potato", category: "Grain" },         // ✅ New Grain
  { name: "🥦 Broccoli", category: "Vegetable" },
  { name: "🥣 Lentils", category: "Protein" },
  { name: "🍞 Bread", category: "Grain" },
];

const BuildAPlateCard = () => {
  const [availableItems, setAvailableItems] = useState(initialItems);
  const [plate, setPlate] = useState<Plate>({
    Protein: [],
    Vegetable: [],
    Grain: [],
  });
  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const successSound = new Audio("/sounds/correct.mp3");
const errorSound = new Audio("/sounds/wrong.mp3");
const [allowSurprise, setAllowSurprise] = useState(false);

  const handleDrop = (category: keyof Plate, item: FoodItem) => {
    if (plate[category].some(i => i.name === item.name)) return;

    setPlate((prev) => ({
      ...prev,
      [category]: [...prev[category], item],
    }));

    setAvailableItems((prev) => prev.filter(i => i.name !== item.name));
  };

  const handleSubmit = () => {
    const valid =
      plate.Protein.every(item => item.category === "Protein") &&
    plate.Vegetable.every(item => item.category === "Vegetable") &&
    plate.Grain.every(item => item.category === "Grain") &&
    plate.Protein.length > 0 &&
    plate.Vegetable.length > 0 &&
    plate.Grain.length > 0;

    setIsValid(valid);
  setSubmitted(true);
  setAllowSurprise(true);

    if (valid) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      successSound.play();
      toast.success("Great plate! You've chosen a balanced meal! 🍽️");
    } else {
      errorSound.play();
      toast.error("Oops! Try adding at least one from each category.");
    }

    setSubmitted(true);
    setAllowSurprise(true);
  };

  const handleReset = () => {
    setAvailableItems(initialItems);
    setPlate({ Protein: [], Vegetable: [], Grain: [] });
    setSubmitted(false);
    setAllowSurprise(false);
  };
const handleRandomPlate = () => {
  const protein = initialItems.filter(i => i.category === "Protein");
  const vegetable = initialItems.filter(i => i.category === "Vegetable");
  const grain = initialItems.filter(i => i.category === "Grain");

  const getRandom = (arr: FoodItem[]) => arr[Math.floor(Math.random() * arr.length)];

  const randomPlate = {
    Protein: [getRandom(protein)],
    Vegetable: [getRandom(vegetable)],
    Grain: [getRandom(grain)],
  };

  const usedNames = new Set([
    ...randomPlate.Protein,
    ...randomPlate.Vegetable,
    ...randomPlate.Grain,
  ].map(i => i.name));

  setPlate(randomPlate);
  setAvailableItems(initialItems.filter(i => !usedNames.has(i.name)));
  setSubmitted(false);
};

const renderDropZone = (label: keyof Plate) => {
  const bgColor =
    label === "Protein" ? "bg-red-50" :
    label === "Vegetable" ? "bg-green-50" :
    label === "Grain" ? "bg-purple-100" :
    "bg-gray-100"; // fallback

  return (
    <div className={`border-2 border-dashed p-4 rounded min-h-[100px] ${bgColor}`}>
      <div className="font-semibold text-gray-700 mb-2">{label}</div>
      {plate[label].length === 0 ? (
        <p className="text-sm text-gray-400">Drop items here</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {plate[label].map((item) => (
            <Badge key={item.name} variant="outline">
              {item.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

 return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
    <Card className="m-20 md:m-10 bg-yellow-100 rounded-2xl shadow-lg border border-yellow-300 p-20 md:p-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-[Comic Sans MS] text-center">🥗 Build a Balanced Plate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 italic mb-1">
  👉 Drag only <strong>one correct ingredient</strong> into each category.
</p>
          <h3 className="text-md font-medium mb-2 text-gray-700">Available Ingredients:</h3>
          <div className="flex flex-wrap gap-3">
            {availableItems.map((item) => (
  <DraggableItem key={item.name} item={item} />
))}
          </div>
        </div>

        <DropZone category="Protein" plate={plate} onDrop={handleDrop} />
<DropZone category="Vegetable" plate={plate} onDrop={handleDrop} />
<DropZone category="Grain" plate={plate} onDrop={handleDrop} />

                 {!allowSurprise && (
  <p className="text-center text-sm text-gray-500">👇 Click Submit to see results or unlock 'Surprise Me'</p>
)}

        <div className="flex justify-center gap-4 mt-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleSubmit} disabled={submitted}>
            🍽️ Submit Plate
          </Button>
          <Button className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
          variant="outline" onClick={handleReset}>
            🔁 Reset
          </Button>

          <Button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
          variant="secondary" onClick={handleRandomPlate} disabled={!allowSurprise}>
            🎲 Surprise Me
          </Button>
        </div>

        {submitted && isValid && (
  <div className="flex items-center justify-center gap-2 mt-2 text-lg text-green-700">
    <CheckCircle className="text-green-500" />
    Great job! Your plate looks balanced.
  </div>
)}

{submitted && !isValid && (
  <div className="flex items-center justify-center gap-2 mt-2 text-lg text-red-700">
    <XCircle className="text-red-500" />
    Try to include the correct ingredients in each category!
  </div>
)}

      </CardContent>
    </Card>
    </div>
  );
};

export default BuildAPlateCard;