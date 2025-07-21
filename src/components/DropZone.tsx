import React from "react";
import { useDrop } from "react-dnd";
import { Badge } from "@/components/ui/badge";

type FoodItem = {
  name: string;
  category: "Protein" | "Vegetable" | "Grain" | "Fruit" | "Dairy";
};
type Props = {
  label: "Protein" | "Vegetable" | "Grain";
  items: FoodItem[];
  onDrop: (label: "Protein" | "Vegetable" | "Grain", item: FoodItem) => void;
};
type Plate = {
  Protein: FoodItem[];
  Vegetable: FoodItem[];
  Grain: FoodItem[];
};

type DropZoneProps = {
  category: keyof Plate;
  plate: Plate;
  onDrop: (category: keyof Plate, item: FoodItem) => void;
};

const DropZone: React.FC<DropZoneProps> = ({ category, plate, onDrop }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: "FOOD_ITEM",
    drop: (item: FoodItem) => {
      onDrop(category, item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

const bgColor =
    category === "Protein" ? "bg-red-50" :
    category === "Vegetable" ? "bg-green-50" :
    category === "Grain" ? "bg-purple-100" :
    "bg-gray-100";

   return (
    <div
      ref={dropRef}
      className={`border-2 border-dashed p-4 rounded min-h-[100px] transition-colors ${
        isOver ? "bg-opacity-80" : ""
      } ${bgColor}`}
    >
      <div className="font-semibold text-gray-700 mb-2">{category}</div>
      {plate[category].length === 0 ? (
        <p className="text-sm text-gray-400">Drop items here</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {plate[category].map((item) => (
            <div
              key={item.name}
              className="px-2 py-1 bg-white border rounded text-sm"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropZone;