/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Check, Plus, Sparkles, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingPackage } from "@/types";
import PackageModal from "./_components/PackageModal";
import {
  useGetAllPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} from "@/redux/features/packageApi";
import { toast } from "sonner";

export default function ManagePricingPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editPkg, setEditPkg] = useState<PricingPackage | null>(null);

  const { data, refetch } = useGetAllPackagesQuery(undefined);
  const [createPackage] = useCreatePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const packages: PricingPackage[] = data?.data || [];

  const savePackage = async (pkg: PricingPackage) => {
    try {
      if (pkg._id) {
        const { _id, ...data } = pkg;
        const res = await updatePackage({ id: _id, ...data }).unwrap();
        toast.success(res.message || "Package updated successfully!");
      } else {
        const res = await createPackage(pkg).unwrap();
        toast.success(res.message || "Package created successfully!");
      }
      setAddOpen(false);
      setEditPkg(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save package!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deletePackage(id).unwrap();
      toast.success(res.message || "Package deleted successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete package!");
    }
  };

  const handleEdit = (pkg: PricingPackage) => {
    setEditPkg(pkg);
    setAddOpen(true);
  };

  return (
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
        <Button
          onClick={() => {
            setEditPkg(null);
            setAddOpen(true);
          }}
          className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </Button>
      </div>

      {/* Packages List */}
      {packages.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg border border-border flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <p className="font-semibold text-foreground">No packages available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={`relative flex flex-col rounded-xl border overflow-hidden transition-colors duration-200
                ${pkg.isMostPopular ? "border-[#A9F877]" : "border-border"}`}
            >
              {pkg.isMostPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[#A9F877] text-white text-xs font-semibold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-foreground">
                  {pkg.name}
                </h3>

                <div className="mb-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {pkg.discount ? (
                      <>
                        {/* Discounted current price */}
                        <span className="text-4xl font-extrabold text-foreground tracking-tight">
                          $
                          {(
                            pkg.price -
                            (pkg.price * pkg.discount) / 100
                          ).toFixed(2)}
                        </span>
                        {/* Original price crossed out */}
                        <span className="text-lg text-muted-foreground line-through">
                          ${pkg.price}
                        </span>
                        {/* Discount badge */}
                        <span className="text-xs font-semibold bg-orange-400/10 text-orange-400 px-2 py-0.5 rounded-full">
                          {pkg.discount}% off
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-extrabold text-foreground tracking-tight">
                        ${pkg.price}
                      </span>
                    )}
                    {pkg.perClassPrice && (
                      <span className="text-sm text-muted-foreground font-medium">
                        ({pkg.perClassPrice.toFixed(0)} credit per class)
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#A9F877] mt-1">
                    {pkg.credits} Credit
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mt-4 border-t pt-4">
                    {pkg.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="w-5 h-5 text-[#A9F877] mt-0.5 shrink-0" />
                        <span className="font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => handleEdit(pkg)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 text-destructive"
                    onClick={() => pkg._id && handleDelete(pkg._id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Package Modal */}
      <PackageModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={savePackage}
        editPackage={editPkg || undefined}
      />
    </div>
  );
}
