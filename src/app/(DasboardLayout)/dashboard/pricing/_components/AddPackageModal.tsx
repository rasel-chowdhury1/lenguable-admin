import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PricingPackage } from "@/types";
import { emptyPackage } from "@/utils";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const AddPackageModal = ({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (pkg: PricingPackage) => void;
}) => {
  const [newPkg, setNewPkg] = useState<PricingPackage>(emptyPackage());

  const handleClose = () => {
    setNewPkg(emptyPackage());
    onClose();
  };

  const handleSave = () => {
    onSave({ ...newPkg, features: newPkg.features.filter((f) => f.trim()) });
    setNewPkg(emptyPackage());
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Package</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Package Name</Label>
              <Input
                value={newPkg.name}
                onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
                placeholder="e.g. 5 Classes"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Validity</Label>
              <Input
                value={newPkg.validity}
                onChange={(e) =>
                  setNewPkg({ ...newPkg, validity: e.target.value })
                }
                placeholder="e.g. Valid for 3 months"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Price ($)</Label>
              <Input
                type="number"
                min={0}
                value={newPkg.price}
                onChange={(e) =>
                  setNewPkg({ ...newPkg, price: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Credits</Label>
              <Input
                type="number"
                min={1}
                value={newPkg.credits}
                onChange={(e) =>
                  setNewPkg({ ...newPkg, credits: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Per Class ($)</Label>
              <Input
                type="number"
                min={0}
                value={newPkg.perClassPrice ?? ""}
                placeholder="Optional"
                onChange={(e) =>
                  setNewPkg({
                    ...newPkg,
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
              checked={newPkg.isMostPopular}
              onCheckedChange={(v) =>
                setNewPkg({ ...newPkg, isMostPopular: v })
              }
            />
            <Label className="cursor-pointer">Mark as Most Popular</Label>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            {newPkg.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => {
                    const updated = [...newPkg.features];
                    updated[index] = e.target.value;
                    setNewPkg({ ...newPkg, features: updated });
                  }}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    setNewPkg({
                      ...newPkg,
                      features: newPkg.features.filter((_, i) => i !== index),
                    })
                  }
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                setNewPkg({ ...newPkg, features: [...newPkg.features, ""] })
              }
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!newPkg.name.trim()}>
            <Plus className="w-4 h-4" />
            Create Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddPackageModal;
