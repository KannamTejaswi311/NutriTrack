import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";          // 🆕
import { speechLocale } from "@/utils/speechLocale";     // 🆕
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plus, Edit, Trash2, Package, Mic } from 'lucide-react';  //iocn
import { useInventoryStore } from '../stores/inventoryStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

export const Inventory = () => {
   const { i18n } = useTranslation();          // 🆕 current UI language
  const { items, addItem, updateItem, removeItem } = useInventoryStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
  });

   /* ---------------- NEW: voice‑recognition state -------------------------- */
  const [listening, setListening] = useState(false);

  const isExpiringSoon = (d?: string) => {
    if (!d) return false;
    const diff = (new Date(d).getTime() - Date.now()) / 86_400_000;
    return diff <= 3 && diff >= 0;
  };
  const isExpired = (d?: string) => (d ? new Date(d).getTime() < Date.now() : false);
  
  /* ----------------------- voice input handler ---------------------------- */
  const handleVoice = () => {
    const SpeechRec: any =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    
    const recog = new SpeechRec();
    recog.lang = speechLocale(i18n.language);   // <— picks hi‑IN, te‑IN, …
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    setListening(true);
    recog.onresult = (e: any) => {
      const spoken = e.results[0][0].transcript.trim();
      const cleaned = spoken.replace(/[.,!?।।،؛॥]+$/g, ""); // remove punctuation at the end
      const merged = formData.name
        ? `${formData.name}, ${cleaned}`
        : cleaned;
      setFormData({ ...formData, name: merged });
      setListening(false);
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);

    recog.start();
  };
  
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

    {/* Show this button only after at least one item exists */}
  {items.length > 0 && (
    <DialogTrigger asChild>
      <Button className="bg-green-600 hover:bg-green-700">
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </DialogTrigger>
  )}

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
{/* ------------- Food name + mic ------------- */}
          {/* --- form wrapper: add this line --- */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <Label className="flex items-center justify-between">
              <span>Food Name</span>

              {/* 🎤 mic button */}
              <Button
                type="button"
                size="icon"
                variant="outline"
                className={`border ${listening ? "animate-pulse" : ""}`}
                onClick={handleVoice}
                aria-label="Speak"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </Label>

            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            {/* ------------- Quantity & unit ------------- */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Unit</Label>
                <select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
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
