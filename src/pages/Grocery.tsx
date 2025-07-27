import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface GroceryItem {
  name: string;
  tip: string;
  category: string;
}

// ✅ Predefined nutrient categories for suggestions
const essentialNutrients = {
  Protein: ["Green Gram", "Lentils", "Eggs"],
  Iron: ["Spinach", "Drumstick Leaves", "Jaggery"],
  Calcium: ["Ragi", "Milk", "Curd"],
  Fiber: ["Vegetables", "Whole Grains"],
};

const rareFoods: GroceryItem[] = [
  { name: "Chia Seeds", tip: "Omega-3, fiber boost", category: "Rare" },
  { name: "Almond Powder", tip: "Vitamin E, healthy fats", category: "Rare" },
  { name: "Quinoa", tip: "Complete protein", category: "Rare" },
];

const Grocery: React.FC = () => {
  const [availableItems, setAvailableItems] = useState<string[]>([]);
  const [inputItem, setInputItem] = useState<string>("");
  const [familySize, setFamilySize] = useState<number>(1);
  const [ageGroup, setAgeGroup] = useState<string>("All");
  const [orderDialog, setOrderDialog] = useState<boolean>(false);
  const [selectedRareItem, setSelectedRareItem] = useState<GroceryItem | null>(null);

  // ✅ Load from localStorage on page load
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("availableItems") || "[]");
    const savedFamilySize = parseInt(localStorage.getItem("familySize") || "1");
    const savedAgeGroup = localStorage.getItem("ageGroup") || "All";
    setAvailableItems(savedItems);
    setFamilySize(savedFamilySize);
    setAgeGroup(savedAgeGroup);
  }, []);

  // ✅ Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("availableItems", JSON.stringify(availableItems));
    localStorage.setItem("familySize", familySize.toString());
    localStorage.setItem("ageGroup", ageGroup);
  }, [availableItems, familySize, ageGroup]);

  // ✅ Add new item to list
  const addItem = () => {
    if (inputItem.trim() !== "" && !availableItems.includes(inputItem)) {
      setAvailableItems([...availableItems, inputItem]);
      setInputItem("");
    }
  };

  const removeItem = (item: string) => {
    setAvailableItems(availableItems.filter((i) => i !== item));
  };

  // ✅ Calculate Health Score (based on diversity)
  const healthScore = Math.min(availableItems.length * 10, 100);

  // ✅ Identify missing nutrients
  const missingNutrients = Object.entries(essentialNutrients)
    .filter(([_, options]) => !options.some((o) => availableItems.includes(o)))
    .map(([nutrient]) => nutrient);

  // ✅ Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("NutriTrack Grocery Guide", 14, 15);
    doc.autoTable({
      head: [["Item", "Why Important"]],
      body: availableItems.map((item) => [item, "Essential for balanced diet"]),
    });
    doc.save("Grocery_Guide.pdf");
  };

  return (
    <div className="p-6 bg-lime-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Grocery Guide 🛒</h1>

      {/* ✅ Health Score */}
      <Card className="mb-6 p-4">
        <p className="text-lg font-semibold">Household Health Score: {healthScore}%</p>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
          <div className="h-full bg-green-500" style={{ width: `${healthScore}%` }}></div>
        </div>
      </Card>

      {/* ✅ User Inputs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What’s available in your local market?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add item (e.g., Rice)"
              value={inputItem}
              onChange={(e) => setInputItem(e.target.value)}
            />
            <Button onClick={addItem} className="bg-green-600 hover:bg-green-700">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableItems.map((item, idx) => (
              <Badge key={idx} variant="secondary" className="flex items-center gap-2">
                {item}
                <span
                  className="cursor-pointer text-red-500"
                  onClick={() => removeItem(item)}
                >
                  ✕
                </span>
              </Badge>
            ))}
          </div>

          {/* ✅ Family Size & Age Group */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div>
              <Label>Family Size</Label>
              <Input
                type="number"
                min={1}
                value={familySize}
                onChange={(e) => setFamilySize(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>Age Group</Label>
              <select
                className="border p-2 rounded"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Kids">Kids</option>
                <option value="Adults">Adults</option>
                <option value="Elderly">Elderly</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Suggestions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Suggestions for Better Nutrition</CardTitle>
        </CardHeader>
        <CardContent>
          {missingNutrients.length === 0 ? (
            <p className="text-green-600">✅ Great! You have all key nutrients covered.</p>
          ) : (
            <div>
              <p className="font-medium mb-2">You're missing:</p>
              {missingNutrients.map((nut, idx) => (
                <div key={idx} className="mb-2">
                  <span className="font-semibold">{nut}:</span>{" "}
                  {essentialNutrients[nut as keyof typeof essentialNutrients].join(", ")}
                </div>
              ))}
              <p className="text-gray-600 mt-2">
                Consider adding these or ordering special items below.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ✅ Rare Items with Order Option */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rare Nutrition Boost (Order Online)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {rareFoods.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.tip}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRareItem(item);
                    setOrderDialog(true);
                  }}
                >
                  Order
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ✅ Actions */}
      <div className="flex gap-4">
        <Button onClick={generatePDF} className="bg-green-600 hover:bg-green-700">
          Download Grocery List
        </Button>
      </div>

      {/* ✅ Order Dialog */}
      <Dialog open={orderDialog} onOpenChange={setOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order {selectedRareItem?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            We’ll connect you with a local supplier or courier. (Future feature)
          </p>
          <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">Submit Request</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Grocery;
