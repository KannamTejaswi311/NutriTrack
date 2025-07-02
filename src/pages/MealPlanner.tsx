
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Clock, Users, Heart, Utensils } from "lucide-react";

const MealPlanner = () => {
  const mealPlans = [
    {
      name: "Family Breakfast",
      time: "20 mins",
      servings: 4,
      calories: "320 per serving",
      ingredients: ["Oats", "Milk", "Banana", "Honey"],
      nutrition: "High Fiber, Protein Rich"
    },
    {
      name: "Quick Lunch",
      time: "30 mins", 
      servings: 4,
      calories: "450 per serving",
      ingredients: ["Rice", "Dal", "Vegetables", "Spices"],
      nutrition: "Complete Protein, Iron Rich"
    },
    {
      name: "Healthy Dinner",
      time: "40 mins",
      servings: 4, 
      calories: "380 per serving",
      ingredients: ["Chapati", "Sabzi", "Curd", "Pickle"],
      nutrition: "Balanced Meal, Probiotics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Smart Meal Planner
          </h1>
          <p className="text-gray-600">
            Personalized meal suggestions based on your family's needs
          </p>
        </div>

        {/* Meal Planning Cards */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mealPlans.map((meal, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{meal.name}</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {meal.time}
                  </div>
                </CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {meal.servings} servings
                  </span>
                  <span>{meal.calories}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.map((ingredient, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Heart className="w-4 h-4" />
                  {meal.nutrition}
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Utensils className="w-4 h-4 mr-2" />
                  Start Cooking
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly Planner */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>This Week's Plan</CardTitle>
            <CardDescription>
              Your personalized weekly meal schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                  <h3 className="font-semibold text-gray-800 mb-2">{day}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-yellow-100 rounded text-yellow-800">
                      Oats & Fruits
                    </div>
                    <div className="p-2 bg-green-100 rounded text-green-800">
                      Dal Rice
                    </div>
                    <div className="p-2 bg-blue-100 rounded text-blue-800">
                      Roti Sabzi
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MealPlanner;
