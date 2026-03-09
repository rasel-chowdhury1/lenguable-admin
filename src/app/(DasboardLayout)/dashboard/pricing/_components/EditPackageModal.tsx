import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PricingPackage } from "@/types";
import { emptyPackage } from "@/utils";
import { Check, Plus, X } from "lucide-react";
import { useState } from "react";

const EditPackageModal = ({
  pkg,
  open,
  onClose,
  onSave,
}: {
  pkg: PricingPackage | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: PricingPackage) => void;
}) => {
  const [form, setForm] = useState<PricingPackage>(pkg ?? emptyPackage());

  useState(() => {
    if (pkg) setForm(pkg);
  });

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm({ ...form, features: updated });
  };

  const addFeature = () =>
    setForm({ ...form, features: [...form.features, ""] });

  const removeFeature = (index: number) =>
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });

  const handleSave = () => {
    onSave({ ...form, features: form.features.filter((f) => f.trim() !== "") });
  };

  if (!pkg) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit Package
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Package Name</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. 5 Classes"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-validity">Validity</Label>
              <Input
                id="edit-validity"
                value={form.validity}
                onChange={(e) => setForm({ ...form, validity: e.target.value })}
                placeholder="e.g. Valid for 3 months"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-credits">Credits</Label>
              <Input
                id="edit-credits"
                type="number"
                min={1}
                value={form.credits}
                onChange={(e) =>
                  setForm({ ...form, credits: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-perClass">Per Class ($)</Label>
              <Input
                id="edit-perClass"
                type="number"
                min={0}
                value={form.perClassPrice ?? ""}
                placeholder="Optional"
                onChange={(e) =>
                  setForm({
                    ...form,
                    perClassPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="edit-popular"
              checked={form.isMostPopular}
              onCheckedChange={(v) => setForm({ ...form, isMostPopular: v })}
            />
            <Label htmlFor="edit-popular" className="cursor-pointer">
              Mark as Most Popular
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="space-y-2">
              {form.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={addFeature}
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="w-4 h-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default EditPackageModal;