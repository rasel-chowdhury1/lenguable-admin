"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingPackage } from "@/types";
import PackageCard from "./_components/PackageCard";
import EditPackageModal from "./_components/EditPackageModal";
import DeletePackageModal from "./_components/DeletePackageModal";
import AddPackageModal from "./_components/AddPackageModal";


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
      <div className="max-w-6xl mx-auto p-5 my-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Manage Pricing Packages
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Edit existing packages or create new ones
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="bg-[#A9F877] hover:bg-[#C1FF72] text-black">
            <Plus className="w-4 h-4" />
            Add Package
          </Button>
        </div>

        {/* Package Cards */}
        {packages.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg border border-border flex items-center justify-center">
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

      <EditPackageModal
        pkg={editTarget}
        open={!!editTarget}
        onClose={closeEdit}
        onSave={saveEdit}
      />

      <DeletePackageModal
        pkg={deleteTarget}
        open={!!deleteTarget}
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />

      <AddPackageModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={saveAdd}
      />
    </div>
  );
}
