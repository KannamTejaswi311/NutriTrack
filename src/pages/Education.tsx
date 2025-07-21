import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, Headphones, CheckCircle, BookOpen } from "lucide-react";

interface Module {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  audioUrl: string;
  pdfUrl: string;
  completed: boolean;
}

const Education = () => {
  const [modules, setModules] = useState<Module[]>([
    {
      id: 1,
      title: "Maternal Nutrition",
      description: "Essential tips for expecting mothers to maintain health.",
      videoUrl: "/videos/maternal.mp4",
      audioUrl: "/audio/maternal.mp3",
      pdfUrl: "/docs/maternal-guide.pdf",
      completed: false,
    },
    {
      id: 2,
      title: "Child Nutrition",
      description: "Learn how to prevent malnutrition in children.",
      videoUrl: "/videos/child.mp4",
      audioUrl: "/audio/child.mp3",
      pdfUrl: "/docs/child-guide.pdf",
      completed: false,
    },
    {
      id: 3,
      title: "Hygiene & Food Safety",
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

  const progress = (modules.filter((m) => m.completed).length / modules.length) * 100;

  useEffect(() => {
    localStorage.setItem("eduModules", JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    const saved = localStorage.getItem("eduModules");
    if (saved) setModules(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nutrition Education Hub</h1>
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
            <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}% Completed</p>
            {progress === 100 && (
              <p className="text-green-700 font-semibold mt-2">
                🎉 Congratulations! You've completed all modules and earned a badge!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Education Modules */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card
              key={module.id}
              className={`bg-white/90 shadow-lg border ${
                module.completed ? "border-green-500" : "border-gray-200"
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  {module.title}
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Listen to description"
                  onClick={() => {
                    const speech = new SpeechSynthesisUtterance(module.description);
                    speech.lang = "en-IN";
                    window.speechSynthesis.speak(speech);
                  }}
                >
                  🔊 Listen
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <Button asChild variant="outline" size="sm" aria-label="Watch video">
                    <a href={module.videoUrl} target="_blank" rel="noopener noreferrer">
                      <PlayCircle className="w-4 h-4" /> Video
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" aria-label="Listen to audio">
                    <a href={module.audioUrl} target="_blank" rel="noopener noreferrer">
                      <Headphones className="w-4 h-4" /> Audio
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" aria-label="Download PDF">
                    <a href={module.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="w-4 h-4" /> PDF
                    </a>
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  {!module.completed ? (
                    <Button
                      className="bg-green-600 text-white w-full"
                      onClick={() => handleComplete(module.id)}
                    >
                      Mark as Completed
                    </Button>
                  ) : (
                    <span className="flex items-center gap-1 text-green-700 font-medium">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </span>
                  )}
                </div>
                <Button asChild variant="ghost" className="text-orange-600 w-full mt-2">
                  <Link to={`/quiz/${module.id}`}>Take Quiz →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Download All Guides */}
        <Button asChild className="bg-green-600 text-white mt-4">
          <a href="/all-guides.zip" download>
            Download All Guides
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Education;
