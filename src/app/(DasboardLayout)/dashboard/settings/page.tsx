/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Copy, Trash2, Tag } from "lucide-react";
import {
  useGetAnnouncementQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "@/redux/features/announcementApi";
import {
  useGenerateDiscountCodeMutation,
  useGetAllDiscountCodesQuery,
  useDeleteDiscountCodeMutation,
} from "@/redux/features/discountCodeApi";
import { useGetAllPackagesQuery } from "@/redux/features/packageApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type SettingsFormData = {
  announcementTitle: string;
  announcementText: string;
};

export default function SettingsPage() {
  const [enableAnnouncement, setEnableAnnouncement] = useState<boolean>(false);

  // Coupon state
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [customCode, setCustomCode] = useState<string>("");

  const { data, refetch } = useGetAnnouncementQuery(undefined);
  const announcement = data?.data;

  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();

  const { data: packagesData } = useGetAllPackagesQuery(undefined);
  const packages = packagesData?.data || [];

  const { data: codesData, refetch: refetchCodes } =
    useGetAllDiscountCodesQuery(undefined);
  const discountCodes = codesData?.data || [];

  const [generateDiscountCode, { isLoading: isGenerating }] =
    useGenerateDiscountCodeMutation();
  const [deleteDiscountCode] = useDeleteDiscountCodeMutation();

  const { register, handleSubmit, reset } = useForm<SettingsFormData>({
    defaultValues: {
      announcementTitle: "Important Update",
      announcementText: "",
    },
  });

  useEffect(() => {
    if (announcement) {
      reset({
        announcementTitle: announcement.title,
        announcementText: announcement.text,
      });
      setEnableAnnouncement(announcement.isEnabled);
    }
  }, [announcement, reset]);

  async function onSubmit(data: SettingsFormData): Promise<void> {
    try {
      const payload = {
        title: data.announcementTitle,
        text: data.announcementText,
        isEnabled: enableAnnouncement,
      };

      if (announcement?._id) {
        const res = await updateAnnouncement({
          id: announcement._id,
          ...payload,
        }).unwrap();
        toast.success(res.message || "Announcement updated successfully!");
      } else {
        const res = await createAnnouncement(payload).unwrap();
        toast.success(res.message || "Announcement created successfully!");
      }

      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save announcement!");
    }
  }

  const handleGenerateCode = async () => {
    if (!customCode.trim()) {
      toast.error("Please enter a discount code");
      return;
    }
    if (!selectedPackageId) {
      toast.error("Please select a package");
      return;
    }
    if (
      !discountPercent ||
      Number(discountPercent) < 1 ||
      Number(discountPercent) > 100
    ) {
      toast.error("Please enter a valid discount percentage (1-100)");
      return;
    }

    try {
      const payload = {
        code: customCode.trim().toUpperCase(),
        packageId: selectedPackageId,
        discountPercent: Number(discountPercent),
      };

      const res = await generateDiscountCode(payload).unwrap();

      toast.success("Discount code generated successfully!");
      setSelectedPackageId("");
      setDiscountPercent("");
      setCustomCode("");
      refetchCodes();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to generate code");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleDeleteCode = async (id: string) => {
    try {
      await deleteDiscountCode(id).unwrap();
      toast.success("Discount code deleted");
      refetchCodes();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete code");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5 my-10 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* ✅ Discount Codes Section */}
      <div className="border border-gray-200 rounded-xl bg-white p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#A9F877]" />
          <h2 className="text-base font-semibold text-gray-900">
            Discount Codes
          </h2>
        </div>

        <p className="text-sm text-gray-500">
          Generate one-time discount codes for students. Each code can only be
          used once per student.
        </p>

        {/* Generate Code Form */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Custom Code (Required) */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Discount Code <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g. SAVE50"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="bg-gray-50 border-gray-200"
              maxLength={50}
            />
            <p className="text-xs text-gray-500">
              {customCode.length}/50
            </p>
          </div>

          {/* Package Select */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Package <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedPackageId}
              onValueChange={setSelectedPackageId}
            >
              <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select package" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg: any) => (
                  <SelectItem key={pkg._id} value={pkg._id}>
                    {pkg.name} (${pkg.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Discount % */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Discount % <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={1}
              max={100}
              placeholder="e.g. 50"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="bg-gray-50 border-gray-200"
            />
          </div>

          {/* Generate Button */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800 invisible">
              Action
            </Label>
            <Button
              type="button"
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="w-full bg-[#A9F877] hover:bg-[#C1FF72] text-black"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>

        {/* Generated Codes List */}
        {discountCodes.length > 0 && (
          <div className="space-y-2 pt-2">
            <Label className="text-sm font-semibold text-gray-800">
              Generated Codes
            </Label>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {discountCodes.map((item: any) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                >
                  {/* Code */}
                  <code className="text-sm font-bold text-gray-800 tracking-wider shrink-0">
                    {item.code}
                  </code>

                  {/* Package name */}
                  <span className="text-xs text-gray-500 truncate flex-1">
                    {item.packageId?.name}
                  </span>

                  {/* Discount % */}
                  <span className="text-xs font-semibold text-orange-500 shrink-0">
                    {item.discountPercent}% off
                  </span>

                  {/* Status badge */}
                  <Badge
                    className={
                      item.isUsed
                        ? "bg-gray-200 text-gray-500 text-xs"
                        : "bg-[#A9F877]/20 text-green-700 text-xs"
                    }
                  >
                    {item.isUsed ? "Used" : "Active"}
                  </Badge>

                  {/* Copy button — only if not used */}
                  {!item.isUsed && (
                    <button
                      type="button"
                      onClick={() => handleCopyCode(item.code)}
                      className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteCode(item._id)}
                    className="text-gray-400 hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Announcements Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="border border-gray-200 rounded-xl bg-white p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">
            Announcements
          </h2>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Create announcements for students and teachers
            </p>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-gray-800">
                Enable Announcement
              </Label>
              <Switch
                checked={enableAnnouncement}
                onCheckedChange={setEnableAnnouncement}
                className="data-[state=checked]:bg-[#A9F877]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Announcement Title
            </Label>
            <Input
              {...register("announcementTitle")}
              placeholder="Important Update"
              className="bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Announcement Text
            </Label>
            <Textarea
              {...register("announcementText")}
              placeholder="Enter your announcement message here..."
              className="bg-gray-50 border-gray-200 resize-none h-24"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#A9F877] hover:bg-[#C1FF72] text-black"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}
