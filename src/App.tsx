
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Games from "./pages/Games";
import MealPlanner from "./pages/MealPlanner";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Quiz from "@/components/Quiz";
import Education from "@/pages/Education";
import GuessNutrientPage from "@/pages/GuessNutrientPage";
import BuildAPlate from "@/components/BuildAPlateCard";
import MemoryMatch from "@/components/MemoryMatchCard";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/education" element={<Education />} />
          <Route path="/games" element={<Games />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/guess" element={<GuessNutrientPage />} />
          <Route path="/build" element={<DndProvider backend={HTML5Backend}>
  <BuildAPlate />
</DndProvider>} />
          <Route path="/match" element={<MemoryMatch />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
