import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import { Clock, Users, Heart, Utensils, Volume2, Repeat } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { ComponentProps } from "react";
import AnimatedDialogContent from "@/components/ui/AnimatedDialogContent";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// ── mock price map (₹ per kg / dozen) ──
const priceMap = { Oats:90, Milk:60, Banana:40, Honey:350, Rice:45, Dal:90, Vegetables:50, Spices:20, Chapati:30, Sabzi:40, Curd:55, Pickle:25 };
const quantityMap: Record<string, number> = {
  Oats: 50,       // grams
  Milk: 200,      // ml
  Banana: 1,      // unit
  Honey: 10,      // grams
   Rice:100, Dal:50, Vegetables:100, Spices:5, Chapati:2, Sabzi:150, Curd:100, Pickle:10 };

// ingredient substitutions for rural availability
const altMap: Record<string, string[]> = {
  Milk:["Curd","Buttermilk"], Banana:["Papaya","Guava"], Oats:["Ragi","BrokenWheat"],
  Honey:["Jaggery"], Chapati:["JowarRoti","BajraRoti"],
  Rice:["BrokenRice","Millets"], Dal:["GreenGram","ChanaDal"],
  Vegetables:["SeasonalVeg","LocalGreens"], Spices:["BasicMasalas"]
};

type MealPlan = { emoji:string; key:string; name:string; time:string; servings:number; calories:string; ingredients:string[]; nutrition:string; };

const mealPlans: MealPlan[] = [
  { emoji:"🥣", key: "FamilyBreakfast", name:"🥣Family Breakfast", time:"20 mins", servings:4, calories:"320 kcal", ingredients:["Oats","Milk","Banana","Honey"], nutrition:"HighFiber" },
  { emoji:"🍛", key: "QuickLunch", name:"🍛Quick Lunch",      time:"30 mins", servings:4, calories:"450 kcal", ingredients:["Rice","Dal","Vegetables","Spices"], nutrition:"CompleteProtein" },
  { emoji:"🌙", key: "HealthyDinner",name:"🌙Healthy Dinner",    time:"40 mins", servings:4, calories:"380 kcal", ingredients:["Chapati","Sabzi","Curd","Pickle"],  nutrition:"BalancedMeal" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mealTimes = ["breakfast", "lunch", "dinner"];   // lower‑case keys

export default function MealPlanner() {
  const { t } = useTranslation();
  const [showAltMap, setShowAltMap] = useState<Record<string, boolean>>({});
  const [selectedMeal, setSelectedMeal] = useState<MealPlan | null>(null);
  // ✅ move the checklist state here
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const toggleStep = (idx:number) =>
  setDoneSteps((s)=> s.includes(idx) ? s.filter(n=>n!==idx) : [...s,idx]);
  const toggleAlt = (mealName: string) =>
  setShowAltMap((prev) => ({ ...prev, [mealName]: !prev[mealName] }));
  
  const [showCongrats, setShowCongrats] = useState(false);
const [completedMeal, setCompletedMeal] = useState<MealPlan | null>(null);

  /* ── 1. make sure browser voices are ready ───────────────── */
  function useVoicesReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      if (window.speechSynthesis.getVoices().length) {
        setReady(true);
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
    window.speechSynthesis.onvoiceschanged = load;
    load(); // first attempt
    return () => (window.speechSynthesis.onvoiceschanged = null);
  }, []);

  return ready;
}

const voicesReady = useVoicesReady();

 function speakRecipe(meal: MealPlan, detailed = false) {
  if (!voicesReady) return;

  window.speechSynthesis.cancel();

  const voiceMap = { en: "en-IN", hi: "hi-IN", te: "te-IN" };
  const lang = voiceMap[i18n.language] || "en-IN";

  const voices = window.speechSynthesis.getVoices();
  const useVoice = voices.find(v => v.lang === lang) || voices[0];

  let text = "";

  if (!detailed) {
    // Read card summary info
    text = `${t(meal.name)}. Time: ${meal.time}. Servings: ${meal.servings}. Calories: ${meal.calories}. Nutrition: ${t(meal.nutrition)}. Ingredients: ${meal.ingredients.join(", ")}.`;
  } else {
    // Read cooking steps in detail
   const steps = [
  t("letsCook", { meal: meal.name.replace(/^[^\w]+/, "") }),
  t("youNeed",  { items: meal.ingredients.join(", ") }),
  t("Prepare"),
  t("Cook"),
  t("Serve")
];
    // Speak steps sequentially
    let index = 0;
    const utterStep = () => {
      if (index >= steps.length) return;
      const u = new SpeechSynthesisUtterance(steps[index]);
      u.voice = useVoice;
      u.lang = useVoice.lang;
      u.rate = 0.9;
      u.onend = () => {
        index++;
        utterStep();
      };
      window.speechSynthesis.speak(u);
    };
    utterStep();
    return;
  }

  const u = new SpeechSynthesisUtterance(text);
  u.voice = useVoice;
  u.lang = useVoice.lang;
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

function speakCardSummary(
  meal: MealPlan,
  useAlt: boolean,
  voicesReady: boolean
) {
  if (!voicesReady) return;

  const voiceMap = { en: "en-IN", hi: "hi-IN", te: "te-IN" };
  const lang = voiceMap[i18n.language] || "en-IN";
  const voice =
    window.speechSynthesis.getVoices().find(v => v.lang === lang) ||
    window.speechSynthesis.getVoices()[0];

  const ingredients = meal.ingredients.map(ing =>
    useAlt && altMap[ing]?.[0] ? altMap[ing][0] : ing
  );

  const text = [
    t(meal.name).replace(/^[^\w]+/, ""),
    `${meal.time}, ${meal.calories}`,
    `${meal.servings} ${i18n.t("servings")}`,
    `${i18n.t("ingredients")}: ${ingredients.join(", ")}`,
    `${t(meal.nutrition)}`
  ].join(". ");

  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

  const estimatedCost = (meal: MealPlan) =>
  meal.ingredients.reduce((total, ing) => {
    const pricePerKg = priceMap[ing] ?? 0;
    const quantity = quantityMap[ing] ?? 100;
    return total + (pricePerKg * quantity) / 1000;
  }, 0) / meal.servings;

// Create a map to translated labels so we don't call t() in render loops
const mealTimeLabel = {
  breakfast: t("breakfast"),
  lunch:     t("lunch"),
  dinner:    t("dinner")
};

  // download PDF of weekly grid
  const downloadPDF = async () => {
  const node = document.getElementById("weekly-plan");
  if (!node) return;

  const canvas = await html2canvas(node);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "px", "a4");
  const pageWidth  = pdf.internal.pageSize.getWidth();
  const pageHeight = (canvas.height * pageWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
  pdf.save("meal-plan.pdf");
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Heading + language picker */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {t("mealPlannerTitle")}
            </h1>
            <p className="text-gray-600">
              {t("mealPlannerDesc")}
            </p>
          </div>
          <div className="w-48">
            <Select
              onValueChange={(lng) => i18n.changeLanguage(lng)}
              defaultValue={i18n.language}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Meal cards */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mealPlans.map((meal) => (
            <Card
              key={t(meal.name)}
              className="bg-white border-2 border-lime-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t(meal.emoji)}{t(meal.key)}</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {meal.time}
                  </div>
                </CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {meal.servings} {t("servings")}
                  </span>
                  <span>{meal.calories} / {t("serving")}</span>
                  <span>₹{estimatedCost(meal).toFixed(1)} / {t("serving")}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* ingredients */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    {t("ingredients")}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.map((ing) => (
                      <span
                        key={t(ing)}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                      {t(showAltMap[meal.name] && altMap[ing]?.[0] ? altMap[ing][0] : ing)}
                      </span>
                    ))}
                    <Button
                    aria-label="Swap to rural-friendly ingredients"
                    title="Swap to rural-friendly ingredients"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleAlt(meal.name)}
                    className="w-6 h-6 text-gray-500 hover:text-gray-700"
                  >
                    <Repeat className="w-4 h-4" />
                  </Button>
                  </div>
                </div>

                {/* nutrition tag */}
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Heart className="w-4 h-4" />
                  {t(meal.nutrition)}
                </div>

                {/* action buttons */}
                <div className="flex gap-2">
                  <Button
  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
  disabled={!voicesReady}
  onClick={() =>
    speakCardSummary(meal, showAltMap[meal.name] ?? false, voicesReady)
  }
>
  <Volume2 className="w-4 h-4 mr-2" />
  {t("Listen")}
</Button>
              <Button className="flex-1 bg-lime-600 hover:bg-lime-700"
                          onClick={()=>{setDoneSteps([]); setSelectedMeal(meal)}}>
                    <Utensils className="w-4 h-4 mr-2"/>{t("startCooking")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly planner */}
        <div id="weekly-plan">
        <Card className="mt-8 bg-white/80 backdrop-blur-sm">
  <CardHeader>
    <CardTitle>{t("weeklyPlan")}</CardTitle>
    <CardDescription>
      {t("weeklyPlanDesc")}
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
  {days.map((day, i) => (
    <div
      key={day}
      className="text-left p-4 border rounded-lg bg-white hover:bg-gray-50 shadow-sm"
    >
      <h3 className="font-semibold text-gray-800 text-center mb-3">{t(day)}</h3>

      {mealTimes.map((label, j) => {
  const meal = mealPlans[(i + j) % mealPlans.length];

        const colorClass =
          j === 0
            ? "bg-yellow-100 text-yellow-800"
            : j === 1
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800";

        return (
          <details key={mealTimeLabel[label]} className={`mb-2 rounded-lg ${colorClass}`}>
            <summary className="cursor-pointer px-2 py-1 text-xs font-semibold">
              {t(mealTimeLabel[label])}
            </summary>
            <ul className="list-disc list-inside px-4 py-1 text-[11px]">
              <li>{meal.ingredients.map((ing) => t(ing)).join(", ")}</li>
            </ul>
          </details>
        );
      })}

      <Progress
        value={60 + Math.random() * 30}
        className="h-2 bg-red-200 [&>div]:bg-green-500 mt-3"
      />
    </div>
  ))}
</div>
  </CardContent>
</Card>
        {/* action buttons under planner */}
<div className="mt-6 flex flex-wrap gap-4 justify-center">
  <Button
    onClick={downloadPDF}
    className="bg-blue-600 hover:bg-blue-700 text-white"
  >
    {t("downloadPlan")} 
  </Button>

  <a
    href={`https://wa.me/?text=${encodeURIComponent(
      t("weeklyPlan") + " 📅\n\n" +
      "Breakfast: Oats & Fruits\nLunch: Dal Rice\nDinner: Roti Sabzi"
    )}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button className="bg-green-600 hover:bg-green-700 text-white">
      {t("shareWithASHA")}
    </Button>
  </a>
</div>

     {/* ───────── Cooking Modal ───────── */}
      <Dialog open={!!selectedMeal} onOpenChange={()=>setSelectedMeal(null)}>
        {selectedMeal && (
           <AnimatedDialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">{t(selectedMeal.key)}</DialogTitle>
              <DialogDescription>
    {t("This modal shows cooking steps and ingredients.")}
  </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <p className="text-sm text-gray-600 flex justify-between">
                <span>⏱ {selectedMeal.time}</span>
                <span>🔥 {selectedMeal.calories}</span>
                <span>₹{estimatedCost(selectedMeal).toFixed(1)}</span>
              </p>

              <div>
                <h4 className="font-semibold mb-1">{t("ingredients")}:</h4>
                <ul className="list-disc list-inside ml-4 text-sm">
                  {selectedMeal.ingredients.map(i=><li key={i}>{t(i)}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-1">{t("Steps")}:</h4>
                <ol className="space-y-2">
  {["Prepare", "Cook", "Serve"].map((key, idx)=>(
    <motion.li
      key={idx}
      onClick={()=>toggleStep(idx)}
      className={`cursor-pointer flex items-start gap-2 ${doneSteps.includes(idx) ? "line-through text-gray-400" : ""}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
    >
      <span className={`h-4 w-4 mt-[2px] rounded-full border flex items-center justify-center
  ${doneSteps.includes(idx) ? "bg-green-500 border-green-500" : "border-gray-400"}`}>
  {doneSteps.includes(idx) && "✓"}
</span>
      <span>{t(key)}</span>
    </motion.li>
  ))}
</ol>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={!voicesReady}
                        onClick={()=>speakRecipe(selectedMeal,true)}>
                  <Volume2 className="w-4 h-4 mr-2"/> {t("Listen")}
                </Button>
                <Button className="flex-1" variant="outline"
                        onClick={() => {
  setSelectedMeal(null);         // close modal
  setCompletedMeal(selectedMeal); // store meal
  setShowCongrats(true);         // show message
  setTimeout(() => setShowCongrats(false), 5000); // hide after 3s
  // 🎉 Play sound
  const audio = new Audio("/sounds/applause.mp3");
  audio.play();

// Stop after 3 seconds
setTimeout(() => {
  audio.pause();
  audio.currentTime = 0; // Reset so it can be replayed later
}, 5000);

  // 🎊 Emoji confetti
  const emojis = ["🎉", "🎊", "🎈", "🥳", "🧁"];
  emojis.forEach((emoji, i) => {
    setTimeout(() => {
      const div = document.createElement("div");
      div.innerText = emoji;
      div.style.position = "fixed";
      div.style.fontSize = "2rem";
      div.style.left = `${Math.random() * 100}%`;
      div.style.top = "-40px";
      div.style.zIndex = "9999";
      div.style.animation = "fall 2s ease-out forwards";

      document.body.appendChild(div);
      setTimeout(() => div.remove(), 2000);
    }, i * 150);
  });

  // 🎆 Real confetti
  confetti({
      particleCount: 120,
      spread: 80,
      colors: ["#4ade80", "#facc15", "#f472b6"], // lime‑green, yellow, pink
      origin: { y: 0.6 },                        // start a bit lower
    });

  // Hide message after 3 seconds
  setTimeout(() => setShowCongrats(false), 3000);
}}
>
                  {t("Done")}
                </Button>
              </div>
            </div>
          </AnimatedDialogContent>
        )}
      </Dialog>

      {showCongrats && completedMeal && (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    className="fixed bottom-6 right-6 bg-white border border-green-300 text-green-700 px-6 py-3 rounded-lg shadow-lg text-center z-50"
  >
    <div className="text-2xl font-semibold mb-1">🎉 {t("Congratulations")}!</div>
    <div className="text-sm">
      {t("You have completed")} <strong>{t(completedMeal!.key)}</strong> 👏🍽️
    </div>
  </motion.div>
)}

        </div>
      </div>
    </div>
  );
}
