import { useState, FormEvent } from "react";
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useInventoryStore } from '../stores/inventoryStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

export const Inventory = () => {
  const { items, addItem, updateItem, removeItem } = useInventoryStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
  });

  const isExpiringSoon = (d?: string) => {
    if (!d) return false;
    const diff = (new Date(d).getTime() - Date.now()) / 86400000;
    return diff <= 3 && diff >= 0;
  };
  const isExpired = (d?: string) => (d ? new Date(d).getTime() < Date.now() : false);
  
   /* ---------------- form submit -------------------- */
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = {
      id: editingItem?.id ?? Date.now().toString(),
      name: formData.name.trim(),
      quantity: parseFloat(formData.quantity) || 0,
      unit: formData.unit,
      expiryDate: formData.expiryDate,
    };
    editingItem ? updateItem(editingItem.id, data) : addItem(data);

    //reset
    setFormData({ name: '', quantity: '', unit: 'kg', expiryDate: ''});
    setEditingItem(null);
    setDialogOpen(false);
  }

   const startEdit = (it: any) => {
    setEditingItem(it);
    setFormData({
      name: it.name,
      quantity: String(it.quantity),
      unit: it.unit,
      expiryDate: it.expiryDate ?? "",
    });
    setDialogOpen(true);
  };

  return (
    
    <div className="p-4 space-y-6">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <div className="flex items-center justify-between mb-6">
  <div>
    <h2 className="text-2xl font-bold text-gray-900">🧺 Food Inventory</h2>
    <p className="text-gray-600">{items.length} items tracked</p>
  </div>

    <DialogTrigger asChild>
  <Button className="bg-green-600 hover:bg-green-700">
    <Plus className="w-4 h-4 mr-2" />
    Add Item
  </Button>
</DialogTrigger>

</div>

          
        {/* ========== TRIGGER ========== */}
        {items.length === 0 ? (
          <DialogTrigger asChild>
            <Card className="border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
              <CardContent className="flex flex-col items-center py-10 gap-4">
                <Package className="w-12 h-12 text-gray-400" />
                <p className="text-gray-600">Add your first item</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Start
                </Button>
              </CardContent>
            </Card>
          </DialogTrigger>
        ) : null }

        {/* ========== FORM DIALOG ========== */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Food Item" : "Add Food Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <Label>Food Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Unit</Label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="kg">kg</option>
                  <option value="grams">grams</option>
                  <option value="pieces">pieces</option>
                  <option value="liters">liters</option>
                </select>
              </div>
            </div>

            <Label>Expiry Date (optional)</Label>
            <Input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========== EXISTING ITEMS GRID ========== */}
      {items.length > 0 && (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className={`overflow-hidden border-0 shadow-lg rounded-xl transition hover:scale-[1.015] ${
                isExpired(item.expiryDate)
                  ? "bg-red-50"
                  : isExpiringSoon(item.expiryDate)
                  ? "bg-yellow-50"
                  : "bg-white"
              }`}
            >
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Quantity:</strong> {item.quantity} {item.unit}
                </p>
                {item.expiryDate && (
                  <p
                    className={`text-xs font-medium ${
                      isExpired(item.expiryDate)
                        ? "text-red-600"
                        : isExpiringSoon(item.expiryDate)
                        ? "text-yellow-600"
                        : "text-gray-500"
                    }`}
                  >
                    Expires: {new Date(item.expiryDate).toLocaleDateString()}
                    {isExpired(item.expiryDate) && " (Expired)"}
                    {isExpiringSoon(item.expiryDate) && " (Expiring Soon)"}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
