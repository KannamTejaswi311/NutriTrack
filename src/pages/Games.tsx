import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Games = () => {
  const navigate = useNavigate();

  const games = [
    {
      emoji: "🧠+📋",
      title: "Nutrition Quiz",
      description: "Test your healthy food knowledge with this fun quiz!",
      route: "/quiz",
    },
    {
      emoji: "🕵️‍♀️",
      title: "Guess the Nutrient",
      description: "Match food emojis with their nutrients!",
      route: "/guess",
    },
    {
      emoji: "🍽️",
      title: "Build-a-Plate",
      description: "Drag and drop foods to build a balanced plate.",
      route: "/build",
    },
    {
      emoji: "🃏",
      title: "Memory Match",
      description: "Flip cards to match food and nutrient pairs.",
      route: "/match",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-orange-700 mb-10">
          🎮 Explore Fun Nutrition Games
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card
              key={game.title}
              className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all"
            >
              <CardHeader className="text-center">
                <div className="text-5xl">{game.emoji}</div>
                <CardTitle className="text-xl mt-2">{game.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-gray-600">{game.description}</p>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => navigate(game.route)}
                >
                  ▶️ Play Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
