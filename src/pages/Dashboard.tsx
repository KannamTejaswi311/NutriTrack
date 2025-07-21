
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Plus, Star, Heart, Clock, Utensils } from "lucide-react";
import CountUp from 'react-countup';
import {Inventory} from "@/components/Inventory";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Dashboard = () => {
    const { items } = useInventoryStore();
    //const inventoryNames = inventoryItems.map((item) => item.name.toLowerCase());
    const { t } = useTranslation();
  const allMeals = [
  {
    name: "Spinach Dal Rice",
    time: "30 mins",
    nutrition: ["Protein", "Iron", "Fiber"],
    ingredients: ["Rice", "Dal", "Spinach"],
    recipe: [
      "Cook rice; keep warm.",
      "Pressure‑cook dal with turmeric & salt.",
      "Wilt spinach, mix into dal, temper with garlic‑chilli tadka.",
      "Serve dal over rice."
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQruT0j47SVtkciBdanT9M76WSl7B6lTFln8g&s",  // or use your own hosted images
    videoUrl: "https://www.youtube.com/watch?v=zljAPX4GqfQ"
  },
  {
    name: "Tomato Onion Curry",
    time: "20 mins", 
    nutrition: ["Vitamin C", "Antioxidants"],
    ingredients: ["Tomatoes", "Onions"],
    recipe: [
      "Chop and sauté onions.",
      "Add tomatoes and cook until soft.",
      "Season and simmer for 5–10 minutes."
    ],
    image: "https://tastedrecipes.com/wp-content/uploads/2018/02/onion-tomato-sabji-848x424.jpg",
    videoUrl: "https://www.youtube.com/watch?v=rYr6hGnrIVk"
  },
  {
    name: "Plain Rice",
    time: "15 mins",
    nutrition: ["Carbohydrates"],
    ingredients: ["Rice"],
    recipe: [
      "Rinse and cook rice until soft."
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-v1S86fjK3ia_mH4wkPYjUhFwDQawLedkKA&s",
    videoUrl: "https://www.youtube.com/shorts/coJ96hYF1i0"
  },
  {
    name: "Onion Dal",
    time: "25 mins",
    nutrition: ["Protein", "Fiber", "Prebiotics"],
    ingredients: ["Onions", "Dal"],
    recipe: [
      "Cook dal until soft.",
      "Fry onions and add to dal.",
      "Boil together for 5 minutes and serve."
    ],
    image: "https://img.freepik.com/free-photo/traditional-indian-soup-lentils-indian-dhal-spicy-curry-bowl-spices-herbs-rustic-black-wooden-table_2829-18717.jpg?semt=ais_items_boosted&w=740",
    videoUrl: "https://www.youtube.com/watch?v=8c_scYUN5uc"
  }
];
    const mealSuggestions = allMeals.filter(meal =>
  meal.ingredients.every(ing => items.some(item => item.name.toLowerCase() === ing.toLowerCase()))
);
const allNutrients = new Set();
mealSuggestions.forEach(meal => {
  meal.nutrition.forEach(nut => allNutrients.add(nut));
});
const nutritionScore = allNutrients.size * 10; // For example, 5 nutrients = 50%
const usedIngredients = new Set();
mealSuggestions.forEach(meal => {
  meal.ingredients.forEach(ing => usedIngredients.add(ing.toLowerCase()));
});

const savedFoodCount = items.filter(item => usedIngredients.has(item.name.toLowerCase())).length;
const emojiMap = {
  Protein: "💪",
  Fiber: "🌾",
  Iron: "🧲",
  "Vitamin C": "🍊",
  Antioxidants: "🛡️",
  Carbohydrates: "🍚",
};
const [favorites, setFavorites] = useState([]);
const toggleFavorite = (mealName) => {
  setFavorites((prev) =>
    prev.includes(mealName) ? prev.filter((name) => name !== mealName) : [...prev, mealName]
  );
};
const [filter, setFilter] = useState("All");
// partial matches (at least 1 ing present, but not all)
const partialMatches = allMeals.filter(meal => {
  const matched = meal.ingredients.filter(ing =>
    items.some(item => item.name.trim().toLowerCase() === ing.trim().toLowerCase())
  );
  return matched.length > 0 && matched.length < meal.ingredients.length;
});
const [dialogOpen, setDialogOpen] = useState(false);

const generateAshaShareMessage = (meals) => {
  if (!meals.length) return "No meals available right now. Please add more ingredients!";

  let message = "🌿 Smart Meal Suggestions for Today:\n\n";

  meals.forEach((meal, idx) => {
    message += `${idx + 1}. ${meal.name} (${meal.time})\n`;
    message += `   ➤ Ingredients: ${meal.ingredients.join(", ")}\n`;
    if (meal.videoUrl) {
      message += `   ▶️ Recipe Video: ${meal.videoUrl}\n`;
    }
    message += "\n";
  });

  message += "Shared via the Smart Nutrition App 🍲\n";
  return message;
};

const encodedMsg = encodeURIComponent(generateAshaShareMessage(mealSuggestions));
const [winStreak, setWinStreak] = useState(1);

useEffect(() => {
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem("lastVisitDate");
  const currentStreak = parseInt(localStorage.getItem("winStreak") || "1");

  if (lastVisit) {
    const last = new Date(lastVisit);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (last.toDateString() === yesterday.toDateString()) {
      // Continue streak
      localStorage.setItem("winStreak", (currentStreak + 1).toString());
      setWinStreak(currentStreak + 1);
    } else if (last.toDateString() !== today) {
      // Reset streak
      localStorage.setItem("winStreak", "1");
      setWinStreak(1);
    } else {
      // Same day revisit
      setWinStreak(currentStreak);
    }
  } else {
    localStorage.setItem("winStreak", "1");
    setWinStreak(1);
  }

  localStorage.setItem("lastVisitDate", today);
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
    {/* ── Welcome + Language row ── */}
<div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  {/* Heading + subtitle */}
  <div>
    <h1 className="text-3xl font-bold text-gray-800 mb-1">
      {t("welcome")} 🌅
    </h1>
    <p className="text-gray-600">
      {t("Let's make today's meals healthy and delicious")}
    </p>
  </div>
</div>
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex-1 ">
    <p className="text-sm text-gray-600">Nutrition Score</p>
    <p className="text-2xl font-bold text-green-600">
  <CountUp end={nutritionScore} duration={1} />%
</p>
    <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-green-500 transition-all duration-300"
        style={{ width: `${nutritionScore}%` }}
      ></div>
    </div>
  </div>

  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
    <Heart className="w-6 h-6 text-green-600" />
  </div>
</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <p className="text-sm text-gray-600">Win Streak</p>
        <p className="text-2xl font-bold text-orange-600">{winStreak} day{winStreak > 1 && "s"}</p>
        <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${Math.min(winStreak, 7) * (100 / 7)}%` }}
          ></div>
        </div>
      </div>
      <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shadow-inner">
        <Star className="w-6 h-6 text-orange-600" />
      </div>
    </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <p className="text-sm text-gray-600">Food Saved</p>
        <p className="text-2xl font-bold text-blue-600">{savedFoodCount} item{savedFoodCount !== 1 && "s"}</p>
        <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${items.length === 0 ? 0 : (savedFoodCount / items.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
        <Utensils className="w-6 h-6 text-blue-600" />
      </div>
    </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Food Inventory */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-green-600" />
                {t("inventoryTitle")}
              </CardTitle>
              <CardDescription>
                What's available in your kitchen today?
              </CardDescription>
            </CardHeader>
            {/* Food Inventory Section (new version) */}
            <Inventory />
          </Card>

          {/* Meal Suggestions */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <CardTitle className="flex items-center gap-2">
      <Heart className="w-5 h-5 text-orange-600" />
      {t("smartMeal")}
              </CardTitle>
              {/* Filter Dropdown */}
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="All">All</option>
      <option value="Protein">High Protein</option>
      <option value="Under30">Under 30 mins</option>
    </select>
    </div>
              <CardDescription>
                {t("mealNote")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mealSuggestions
  .filter(meal => {
    if (filter === "All") return true;
    if (filter === "Protein") return meal.nutrition.includes("Protein");
    if (filter === "Under30") {
      const mins = parseInt(meal.time);
      return mins <= 30;
    }
    return true;
  })
              .map((meal, index) => (
                <div key={index} className="p-4 border-2 border-lime-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2 ">
                    <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {meal.time}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-sm text-green-600 mb-2">
                  <span className="font-medium">Nutrients:</span>
                  {meal.nutrition.map((nutrient, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {emojiMap[nutrient] || "🧪"} {nutrient}
                    </Badge>
                  ))}
                  <Button
  variant="ghost"
  className="text-red-500 text-xs"
  onClick={() => toggleFavorite(meal.name)}
>
  {favorites.includes(meal.name) ? "❤️ Unfavorite" : "🤍 Favorite"}
</Button>
                </div>
                </div>
              ))}
              {mealSuggestions.length > 0 ? (
  <p className="text-sm text-gray-600">
    You're ready to cook {mealSuggestions.length} meal{mealSuggestions.length > 1 && "s"}!
  </p>
) : (
  <div className="text-center text-red-500 font-medium mb-4">
    🧺 No complete meal match. Add more ingredients to get suggestions!
  </div>
)}

              {/* ─── Partial matches collapsible ─── */}
{partialMatches.length > 0 && (
  <Accordion type="single" collapsible className="mb-4">
    <AccordionItem value="almost">
      <AccordionTrigger className="text-sm font-medium">
        Almost there! ({partialMatches.length}) meal{partialMatches.length>1 && "s"} unlocked
      </AccordionTrigger>
      <AccordionContent>
        {partialMatches.length > 0 && (
  <div className="mb-4">
    <div className="grid sm:grid-cols-2 gap-4">
      {partialMatches.map((meal, idx) => {
        const available = meal.ingredients.filter(ing =>
          items.some(item => item.name.trim().toLowerCase() === ing.trim().toLowerCase())
        );
        const missing = meal.ingredients.filter(ing =>
          !items.some(item => item.name.trim().toLowerCase() === ing.trim().toLowerCase())
        );

        return (
  <Card key={idx} className="shadow-sm rounded-lg !bg-yellow-50 p-3">
    <CardTitle className="text-md mb-2">{meal.name}</CardTitle>

    {/* Missing items row */}
    <div className="flex flex-wrap items-center gap-1 mb-2">
      <span className="text-sm text-gray-600 font-medium">You're missing:</span>
      {missing.map((m, i) => (
        <Badge
          key={i}
          variant="destructive"
          className="text-xs bg-red-100 text-red-700 border-red-300"
        >
          ❌ {m}
        </Badge>
      ))}
    </div>

    {/* Already‑have items row */}
    <div className="flex flex-wrap items-center gap-1">
      <span className="text-sm text-gray-600 font-medium">You already have:</span>
      {available.map((a, i) => (
        <Badge key={i} variant="secondary" className="text-xs">
          ✅ {a}
        </Badge>
      ))}
    </div>
  </Card>
);
      })}
    </div>
  </div>
)}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)}

{/* ─── Smart‑Cook button ─── */}
<Button
  className="w-full bg-green-600 hover:bg-green-700"
  disabled={mealSuggestions.length === 0}
  onClick={() => setDialogOpen(true)}
>
  Smart Cook with What You Have
</Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link to="/games" className="block"> 
          <Button variant="outline" className="h-20 text-left justify-start  w-full hover:bg-green-50 border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold"> Games </p>
                <p className="text-sm text-gray-600"> Play quizzes & challenges </p>
              </div>
            </div>
          </Button>
          </Link>

          <Button
            variant="outline"
            className="h-20 text-left justify-start hover:bg-red-50 border-red-200"
            onClick={() => {
          const shareText = generateAshaShareMessage(mealSuggestions);
          const encodedText = encodeURIComponent(shareText);
          // Open WhatsApp with pre-filled message (general, no phone number)
          window.open(`https://wa.me/?text=${encodedText}`, "_blank");
        }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="font-semibold">{t("ashaTitle")}</p>
                <p className="text-sm text-gray-600">{t("ashaDesc")}</p>
              </div>
            </div>
          </Button>

        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent className="max-w-5xl sm:max-w-5xl h-[90vh] overflow-y-auto bg-lime-50 p-6 rounded-xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">Recipes you can cook now 🍳</DialogTitle>
    </DialogHeader>

    {mealSuggestions.length === 0 ? (
      <p className="text-gray-600">Add a few more ingredients to unlock recipes.</p>
    ) : (
      <div className="grid md:grid-cols-2 gap-6">
        {mealSuggestions.map((meal, idx) => (
          <Card key={idx} 
          style={{ "--card": "theme(colors.lime.100 / <alpha-value>)" } as React.CSSProperties}
          className="bg-white border-lime-300 shadow-md rounded-lg">
            <CardHeader className="pb-2">
    <CardTitle className="flex items-center justify-between">
      {meal.name}
      <Badge variant="outline" className="text-xs">{meal.time}</Badge>
    </CardTitle>
  </CardHeader>
  {/* Meal Image */}
  {meal.image && (
    <img
  src={meal.image}
  alt={meal.name}
  className="w-[300px] h-[150px] object-cover rounded-md mx-auto"
/>

  )}

  <CardContent className="space-y-3">
    {/* Ingredients */}
    <div>
      <p className="text-sm font-medium">Ingredients:</p>
      <div className="flex flex-wrap gap-1">
        {meal.ingredients.map((ing, i) => (
          <Badge key={i} variant="secondary" className="text-xs">{ing}</Badge>
        ))}
      </div>
    </div>

    {/* Nutrients */}
    <div>
      <p className="text-sm font-medium">Nutrients:</p>
      <div className="flex flex-wrap gap-1">
        {meal.nutrition.map((nut, i) => (
          <Badge key={i} variant="outline" className="text-xs">{nut}</Badge>
        ))}
      </div>
    </div>

    {/* Steps */}
    <div>
      <p className="text-sm font-medium">Steps:</p>
      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
        {(meal.recipe ?? []).map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>

    {/* YouTube Video */}
    {meal.videoUrl && (
      <div className="pt-2">
        <p className="text-sm font-medium mb-1">Watch on YouTube:</p>
        <a
          href={meal.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 hover:underline text-sm"
        >
          ▶️ {meal.name} Recipe Video
        </a>
      </div>
    )}
  </CardContent>
</Card>
        ))}
      </div>
    )}
  </DialogContent>
</Dialog>
    </div>
  );
};

export default Dashboard;
