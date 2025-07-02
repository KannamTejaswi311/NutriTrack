
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Plus, Star, Heart, Clock, Utensils } from "lucide-react";
import { toast } from "sonner";
import {Inventory} from "@/components/Inventory";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"; // assuming you're using shadcn/ui


const Dashboard = () => {
    const { items } = useInventoryStore();
    //const inventoryNames = inventoryItems.map((item) => item.name.toLowerCase());
    const { t } = useTranslation();
  const allMeals = [
  {
    name: "Spinach Dal Rice",
    time: "30 mins",
    nutrition: "High Protein",
    ingredients: ["Rice", "Dal", "Spinach"]
  },
  {
    name: "Tomato Onion Curry",
    time: "20 mins", 
    nutrition: "Vitamin C Rich",
    ingredients: ["Tomatoes", "Onions"]
  },
  {
    name: "Plain Rice",
    time: "15 mins",
    nutrition: "Basic Carbs",
    ingredients: ["Rice"]
  },
  {
    name: "Onion Dal",
    time: "25 mins",
    nutrition: "Protein + Fiber",
    ingredients: ["Onions", "Dal"]
  }
];
    const mealSuggestions = allMeals.filter(meal =>
  meal.ingredients.every(ing => items.some(item => item.name.toLowerCase() === ing.toLowerCase()))
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t("welcome")} 🌅
          </h1>
          <p className="text-gray-600">
            {t("Let's make today's meals healthy and delicious")}
          </p>
        </div>

        {/* Language */}
        <div className="w-48 mb-4">
  <Select onValueChange={(lng) => i18n.changeLanguage(lng)} defaultValue={i18n.language}>
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


        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Nutrition Score</p>
                  <p className="text-2xl font-bold text-green-600">85%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Win Streak</p>
                  <p className="text-2xl font-bold text-orange-600">7 days</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Food Saved</p>
                  <p className="text-2xl font-bold text-blue-600">12 items</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
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
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-600" />
                {t("smartMeal")}
              </CardTitle>
              <CardDescription>
                {t("mealNote")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mealSuggestions.map((meal, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {meal.time}
                    </Badge>
                  </div>
                  <p className="text-sm text-green-600 mb-2">{meal.nutrition}</p>
                  <div className="flex flex-wrap gap-1">
                    {meal.ingredients.map((ingredient, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
              
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Smart Cook with What You Have
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Button variant="outline" className="h-20 text-left justify-start hover:bg-green-50 border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold"> {t("quizTitle")} </p>
                <p className="text-sm text-gray-600"> {t("quizDesc")} </p>
              </div>
            </div>
          </Button>

          <Button variant="outline" className="h-20 text-left justify-start hover:bg-blue-50 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold"> {t("ashaTitle")} </p>
                <p className="text-sm text-gray-600"> {t("ashaDesc")} </p>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
