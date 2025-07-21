import { useDrag } from "react-dnd";
import React from "react";

type FoodItem = {
  name: string;
  category: "Protein" | "Vegetable" | "Grain" | "Fruit" | "Dairy";
};
type DraggableItemProps = {
  item: FoodItem;
};

const DraggableItem: React.FC<DraggableItemProps> = ({ item }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "FOOD_ITEM",
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <button
      ref={dragRef}
      className="px-3 py-1 border rounded bg-white shadow hover:scale-105 transition-transform cursor-move"
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      {item.name}
    </button>
  );
};

export default DraggableItem;
