"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PricingPackage {
  id: string;
  name: string;
  validity: string;
  price: number;
  credits: number;
  perClassPrice?: number;
  features: string[];
  isMostPopular: boolean;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const initialPackages: PricingPackage[] = [
  {
    id: "1",
    name: "Single Class",
    validity: "One-time",
    price: 20,
    credits: 1,
    features: [
      "1 hour individual lesson",
      "Personalized attention",
      "Flexible scheduling",
      "Progress tracking",
    ],
    isMostPopular: false,
  },
  {
    id: "2",
    name: "5 Classes",
    validity: "Valid for 3 months",
    price: 95,
    credits: 5,
    perClassPrice: 19,
    features: [
      "5 hours of lessons",
      "Save $5 per class",
      "Priority booking",
      "Progress reports",
      "Lesson materials included",
    ],
    isMostPopular: true,
  },
  {
    id: "3",
    name: "10 Classes",
    validity: "Valid for 6 months",
    price: 180,
    credits: 10,
    perClassPrice: 18,
    features: [
      "10 hours of lessons",
      "Save $20 total",
      "Priority booking",
      "Bi-weekly progress reports",
      "All lesson materials",
      "Free rescheduling",
    ],
    isMostPopular: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateId = () => Math.random().toString(36).slice(2, 9);

const emptyPackage = (): PricingPackage => ({
  id: generateId(),
  name: "",
  validity: "",
  price: 0,
  credits: 1,
  perClassPrice: undefined,
  features: [""],
  isMostPopular: false,
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="space-y-2 mt-4">
      {features.map((f, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-sm text-muted-foreground"
        >
          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

function PackageCard({
  pkg,
  onEdit,
  onDelete,
}: {
  pkg: PricingPackage;
  onEdit: (p: PricingPackage) => void;
  onDelete: (p: PricingPackage) => void;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border overflow-hidden transition-colors duration-200
        ${pkg.isMostPopular ? "border-primary ring-1 ring-primary" : "border-border"}`}
    >
      {pkg.isMostPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-xl flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{pkg.validity}</p>
        </div>

        <div className="mb-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-4xl font-extrabold text-foreground tracking-tight">
              ${pkg.price}
            </span>
            {pkg.perClassPrice && (
              <span className="text-sm text-muted-foreground font-medium">
                (${pkg.perClassPrice.toFixed(2)} per class)
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-primary mt-1">
            {pkg.credits} Credit{pkg.credits > 1 ? "s" : ""}
          </p>
        </div>

        <div className="h-px bg-border my-4" />

        <FeatureList features={pkg.features} />

        <div className="flex gap-2 mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onEdit(pkg)}
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-border"
            onClick={() => onDelete(pkg)}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({
  pkg,
  open,
  onClose,
  onSave,
}: {
  pkg: PricingPackage | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: PricingPackage) => void;
}) {
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
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Edit Package
          </DialogTitle>
          <DialogDescription>
            Update the details for{" "}
            <span className="font-medium text-foreground">{pkg.name}</span>
          </DialogDescription>
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
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
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
              className="w-full gap-1.5 border-dashed"
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
            <Check className="w-4 h-4 mr-1.5" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({
  pkg,
  open,
  onClose,
  onConfirm,
}: {
  pkg: PricingPackage | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!pkg) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete Package?</DialogTitle>
          <DialogDescription className="text-center">
            You&apos;re about to permanently delete{" "}
            <span className="font-medium text-foreground">{pkg.name}</span>.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border p-4 my-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-foreground">{pkg.name}</p>
              <p className="text-sm text-muted-foreground">{pkg.validity}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-foreground">${pkg.price}</p>
              <p className="text-xs text-primary font-medium">
                {pkg.credits} Credits
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-1.5"
            onClick={onConfirm}
          >
            <Trash2 className="w-4 h-4" />
            Delete Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add Modal ────────────────────────────────────────────────────────────────

function AddModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (pkg: PricingPackage) => void;
}) {
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
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Package
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new pricing package.
          </DialogDescription>
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
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
              className="w-full gap-1.5 border-dashed"
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
            <Plus className="w-4 h-4 mr-1.5" />
            Create Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManagePricingPage() {
  const [packages, setPackages] = useState<PricingPackage[]>(initialPackages);
  const [editTarget, setEditTarget] = useState<PricingPackage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PricingPackage | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const openEdit = (pkg: PricingPackage) => setEditTarget(pkg);
  const closeEdit = () => setEditTarget(null);
  const saveEdit = (updated: PricingPackage) => {
    setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    closeEdit();
  };

  const openDelete = (pkg: PricingPackage) => setDeleteTarget(pkg);
  const closeDelete = () => setDeleteTarget(null);
  const confirmDelete = () => {
    if (deleteTarget)
      setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    closeDelete();
  };

  const saveAdd = (pkg: PricingPackage) => {
    setPackages((prev) => [...prev, pkg]);
    setAddOpen(false);
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto my-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Pricing
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Manage Pricing Packages
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Edit existing packages or create new ones
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Package
          </Button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-rows-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {[
            { label: "Total Packages", value: packages.length },
            {
              label: "Most Popular",
              value: packages.find((p) => p.isMostPopular)?.name ?? "—",
            },
            {
              label: "Price Range",
              value:
                packages.length > 0
                  ? `$${Math.min(...packages.map((p) => p.price))} – $${Math.max(...packages.map((p) => p.price))}`
                  : "—",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-border rounded-xl px-5 py-4"
            >
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-foreground mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Package Cards */}
        {packages.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl border border-border flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="font-semibold text-foreground">No packages yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click &quot;Add New Package&quot; to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
          </div>
        )}
      </div>

      <EditModal
        pkg={editTarget}
        open={!!editTarget}
        onClose={closeEdit}
        onSave={saveEdit}
      />

      <DeleteModal
        pkg={deleteTarget}
        open={!!deleteTarget}
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />

      <AddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={saveAdd}
      />
    </div>
  );
}
