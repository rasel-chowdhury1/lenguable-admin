"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { PackageFormValues, PricingPackage } from "@/types";
import { Plus, X } from "lucide-react";

const defaultValues: PackageFormValues = {
  name: "",
  price: 0,
  credits: 0,
  perClassPrice: 0,
  discount: 0,
  isMostPopular: false,
  features: [],
};

const PackageModal = ({
  open,
  onClose,
  onSave,
  editPackage,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (pkg: PricingPackage) => void;
  editPackage?: PricingPackage;
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PackageFormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  useEffect(() => {
    if (editPackage) {
      reset({
        name: editPackage.name,
        price: editPackage.price,
        credits: editPackage.credits,
        perClassPrice: editPackage.perClassPrice,
        discount: editPackage.discount,
        isMostPopular: editPackage.isMostPopular,
        features: editPackage.features.map((f) => ({ value: f })),
      });
    } else {
      reset(defaultValues);
    }
  }, [editPackage, reset]);

  const onSubmit = (data: PackageFormValues) => {
    const pkg: PricingPackage = {
      ...(editPackage?._id && { _id: editPackage._id }),
      name: data.name.trim(),
      price: data.price,
      credits: data.credits,
      perClassPrice: data.perClassPrice,
      discount: data.discount,
      isMostPopular: data.isMostPopular,
      features: data.features.map((f) => f.value.trim()).filter(Boolean),
    };
    onSave(pkg);
    reset(defaultValues);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editPackage ? "Edit Package" : "Add Package"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Package Name *</Label>
              <Input {...register("name", { required: "Name is required" })} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Price ($) *</Label>
              <Input
                type="number"
                min={0}
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price cannot be negative" },
                  valueAsNumber: true,
                })}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Credits *</Label>
              <Input
                type="number"
                min={1}
                {...register("credits", {
                  required: "Credits are required",
                  min: { value: 1, message: "Credits must be at least 1" },
                  valueAsNumber: true,
                })}
              />
              {errors.credits && (
                <p className="text-red-500 text-sm">{errors.credits.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Per Class ($)</Label>
              <Input
                type="number"
                min={0}
                placeholder="Optional"
                {...register("perClassPrice", {
                  min: { value: 0, message: "Cannot be negative" },
                  valueAsNumber: true,
                })}
              />
              {errors.perClassPrice && (
                <p className="text-red-500 text-sm">
                  {errors.perClassPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Discount (%)</Label>
            <Input
              type="number"
              placeholder="Optional"
              {...register("discount", {
                valueAsNumber: true,
              })}
            />
            {errors.discount && (
              <p className="text-red-500 text-sm">{errors.discount.message}</p>
            )}
          </div>

          <Controller
            control={control}
            name="isMostPopular"
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v)}
                />
                <Label className="cursor-pointer">Mark as Most Popular</Label>
              </div>
            )}
          />

          <div className="space-y-2">
            <Label>Features</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Controller
                  control={control}
                  name={`features.${index}.value`}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1"
                    />
                  )}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              type="button"
              onClick={() => append({ value: "" })}
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </Button>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              {editPackage ? "Update Package" : "Create Package"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PackageModal;
