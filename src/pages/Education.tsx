import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, Headphones, CheckCircle, BookOpen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Interfaces
interface Module {
  id: number;
  title: string;
  category: string;
  description: string;
  videoUrl: string;
  audioUrl: string;
  pdfUrl: string;
  completed: boolean;
}

interface Story {
  id: number;
  image: string;
  text: string;
  audio?: string;
}

// Sample stories data
const stories = [
  { id: 1, title: "Healthy Pregnancy Tips", videoUrl: "/stories/Pregnancy.mp4" },
  { id: 2, title: "Child Nutrition Essentials", videoUrl: "/stories/child-story.mp4" },
  { id: 3, title: "Safe Drinking Water Practices", videoUrl: "/stories/water-safety.mp4" },
  { id: 4, title: "Hygiene Habits", videoUrl: "/stories/hygiene.mp4" },
  { id: 5, title: "Affordable Healthy Meals", videoUrl: "/stories/budget-meals.mp4" }
];

const Education = () => {
  const [modules, setModules] = useState<Module[]>([
    {
      id: 1,
      title: "Maternal Nutrition",
      category: "pregnant",
      description: "Essential tips for expecting mothers to maintain health.",
      videoUrl: "/videos/maternal.mp4",
      audioUrl: "/audio/maternal.mp3",
      pdfUrl: "/docs/maternal-guide.pdf",
      completed: false,
    },
    {
      id: 2,
      title: "Child Nutrition",
      category: "child",
      description: "Learn how to prevent malnutrition in children.",
      videoUrl: "/videos/child.mp4",
      audioUrl: "/audio/child.mp3",
      pdfUrl: "/docs/child-guide.pdf",
      completed: false,
    },
    {
      id: 3,
      title: "Hygiene & Food Safety",
      category: "hygiene",
      description: "Practices to keep food and water safe in rural areas.",
      videoUrl: "/videos/hygiene.mp4",
      audioUrl: "/audio/hygiene.mp3",
      pdfUrl: "/docs/hygiene-guide.pdf",
      completed: false,
    },
  ]);

  const handleComplete = (id: number) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: true } : m))
    );
  };

  const progress =
    (modules.filter((m) => m.completed).length / modules.length) * 100;

    const level = progress < 50 ? "Beginner" : progress < 100 ? "Intermediate" : "Expert";
  // Save progress in local storage
  useEffect(() => {
    localStorage.setItem("eduModules", JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    const saved = localStorage.getItem("eduModules");
    if (saved) setModules(JSON.parse(saved));
  }, []);

  // Speak story text
  const speakText = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Nutrition Education Hub
          </h1>
          <p className="text-gray-600">
            Learn about health, nutrition, and hygiene in simple, interactive ways.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Your Learning Progress</CardTitle>
            <CardDescription>Complete modules to earn badges!</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {Math.round(progress)}% Completed
            </p>
          <p className="mt-2 text-gray-700">Current Level: {level}</p>
            {progress === 100 && (
              <p className="text-green-700 font-semibold mt-2">
                <img src="/badges/expert.png" alt="Expert Badge" className="w-16 mx-auto" />
                🎉 Congratulations! You've completed all modules and earned a badge!
              </p>
            )}
          </CardContent>
        </Card>
        

        {/* Education Modules */}
        <Tabs defaultValue="pregnant" className="w-full mt-6">
  <TabsList className="grid grid-cols-4">
    <TabsTrigger value="pregnant">Pregnant Women</TabsTrigger>
    <TabsTrigger value="child">Child Nutrition</TabsTrigger>
    <TabsTrigger value="hygiene">Hygiene</TabsTrigger>
    <TabsTrigger value="asha">ASHA Workers</TabsTrigger>
  </TabsList>

  <TabsContent value="pregnant">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.filter(m => m.category === "pregnant").map((module) => (
        <Card key={module.id} className={`bg-white/90 shadow-lg border ${module.completed ? "border-green-500" : "border-gray-200"}`}>
          {/* Same module content here */}
        </Card>
      ))}
    </div>
  </TabsContent>

  <TabsContent value="child">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.filter(m => m.category === "child").map((module) => (
        <Card key={module.id} className={`bg-white/90 shadow-lg border ${module.completed ? "border-green-500" : "border-gray-200"}`}>
          {/* Same module content here */}
        </Card>
      ))}
    </div>
  </TabsContent>

  <TabsContent value="hygiene">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.filter(m => m.category === "hygiene").map((module) => (
        <Card key={module.id} className={`bg-white/90 shadow-lg border ${module.completed ? "border-green-500" : "border-gray-200"}`}>
          {/* Same module content here */}
        </Card>
      ))}
    </div>
  </TabsContent>

  <TabsContent value="asha">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.filter(m => m.category === "asha").map((module) => (
        <Card key={module.id} className={`bg-white/90 shadow-lg border ${module.completed ? "border-green-500" : "border-gray-200"}`}>
          {/* Same module content here */}
        </Card>
      ))}
    </div>
  </TabsContent>
</Tabs>

        {/* Quick Stories Section */}
<div className="mt-10">
  <h2 className="text-2xl font-bold mb-4">Quick Stories</h2>
  <div className="flex gap-4 overflow-x-auto">
    {stories.map((story) => (
      <div key={story.id} className="min-w-[200px]">
        <video src={story.videoUrl} controls className="rounded-lg shadow-lg w-full h-40 object-cover" />
        <p className="text-sm mt-2 text-center font-medium">{story.title}</p>
        <Button
          onClick={() => {
            const speech = new SpeechSynthesisUtterance(story.title);
            speech.lang = "en-IN";
            window.speechSynthesis.speak(speech);
          }}
          className="mt-2 text-green-600"
        >
          🔊 Listen
        </Button>
      </div>
    ))}
  </div>
</div>
        {/* Download All Guides */}
        <Button asChild className="bg-green-600 text-white mt-6">
          <a href="/all-guides.zip" download>
            Download All Guides
          </a>
        </Button>
        <a
  href={`https://wa.me/?text=Check out this Nutrition Education Hub: ${window.location.href}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <Button className="bg-green-700 text-white mt-2">Share on WhatsApp</Button>
</a>
      </div>
    </div>
  );
};

export default Education;
