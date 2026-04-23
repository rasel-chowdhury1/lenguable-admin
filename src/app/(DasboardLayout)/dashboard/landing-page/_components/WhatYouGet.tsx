/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useCreateWhatYouGetMutation,
  useGetAllWhatYouGetQuery,
  useUpdateWhatYouGetMutation,
  useDeleteWhatYouGetMutation,
} from "@/redux/features/whatYouGetApi";
import { BookOpen, Calendar, Award, User } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

const VALID_ICONS = ["User", "BookOpen", "Calendar", "Award"] as const;
type IconName = (typeof VALID_ICONS)[number];

interface IOffering {
  icon: IconName;
  title: string;
  description: string;
}

interface IWhatYouGetData {
  _id: string;
  sectionTitle: string;
  sectionSubtitle: string;
  offerings: IOffering[];
}

// ─── Icon Renderer ────────────────────────────────────────────────────────────

const iconMap: Record<IconName, React.ReactNode> = {
  User: <User className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
};

// ─── Offering Fields ──────────────────────────────────────────────────────────

const OfferingFields = ({
  offerings,
  setOfferings,
}: {
  offerings: IOffering[];
  setOfferings: (v: IOffering[]) => void;
}) => {
  const handleChange = (
    index: number,
    field: keyof IOffering,
    value: string,
  ) => {
    const updated = [...offerings];
    updated[index] = { ...updated[index], [field]: value };
    setOfferings(updated);
  };

  const addOffering = () =>
    setOfferings([...offerings, { icon: "User", title: "", description: "" }]);

  const removeOffering = (index: number) =>
    setOfferings(offerings.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Offerings</label>
        <Button type="button" variant="outline" size="sm" onClick={addOffering}>
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      <div className="space-y-3">
        {offerings.map((offering, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 bg-muted/30 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Offering {index + 1}
              </span>
              {offerings.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOffering(index)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            <Select
              value={offering.icon}
              onValueChange={(value) =>
                handleChange(index, "icon", value as IconName)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                {VALID_ICONS.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    <div className="flex items-center gap-2">
                      {iconMap[icon]}
                      <span>{icon}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Offering title"
              value={offering.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
            />
            <Input
              placeholder="Offering description"
              value={offering.description}
              onChange={(e) =>
                handleChange(index, "description", e.target.value)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Form Fields ──────────────────────────────────────────────────────────────

interface FormFieldsProps {
  sectionTitleVal: string;
  setSectionTitleVal: (v: string) => void;
  sectionSubtitleVal: string;
  setSectionSubtitleVal: (v: string) => void;
  offeringsVal: IOffering[];
  setOfferingsVal: (v: IOffering[]) => void;
}

const FormFields = ({
  sectionTitleVal,
  setSectionTitleVal,
  sectionSubtitleVal,
  setSectionSubtitleVal,
  offeringsVal,
  setOfferingsVal,
}: FormFieldsProps) => (
  <div className="space-y-4 mt-2">
    <div className="space-y-1">
      <label className="text-sm font-medium">Section Title</label>
      <Input
        placeholder="e.g. What You Get"
        value={sectionTitleVal}
        onChange={(e) => setSectionTitleVal(e.target.value)}
      />
    </div>
    <div className="space-y-1">
      <label className="text-sm font-medium">Section Subtitle</label>
      <Input
        placeholder="e.g. Expert tutors, flexible classes, and a clear learning path"
        value={sectionSubtitleVal}
        onChange={(e) => setSectionSubtitleVal(e.target.value)}
      />
    </div>
    <OfferingFields offerings={offeringsVal} setOfferings={setOfferingsVal} />
  </div>
);

// ─── Default Offering ─────────────────────────────────────────────────────────

const defaultOffering: IOffering = { icon: "User", title: "", description: "" };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WhatYouGet() {
  const { data, isLoading } = useGetAllWhatYouGetQuery(undefined);
  const [createWhatYouGet, { isLoading: isCreating }] =
    useCreateWhatYouGetMutation();
  const [updateWhatYouGet, { isLoading: isUpdating }] =
    useUpdateWhatYouGetMutation();
  const [deleteWhatYouGet, { isLoading: isDeleting }] =
    useDeleteWhatYouGetMutation();

  const sections: IWhatYouGetData[] = data?.data || [];

  // ── Create State ──
  const [createOpen, setCreateOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionSubtitle, setSectionSubtitle] = useState("");
  const [offerings, setOfferings] = useState<IOffering[]>([defaultOffering]);

  // ── Edit State ──
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editSectionTitle, setEditSectionTitle] = useState("");
  const [editSectionSubtitle, setEditSectionSubtitle] = useState("");
  const [editOfferings, setEditOfferings] = useState<IOffering[]>([
    defaultOffering,
  ]);

  // ── Delete State ──
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const resetCreateForm = () => {
    setSectionTitle("");
    setSectionSubtitle("");
    setOfferings([defaultOffering]);
  };

  const handleCreate = async () => {
    if (!sectionTitle || !sectionSubtitle) {
      toast.error("All fields are required");
      return;
    }
    if (offerings.some((o) => !o.title || !o.description)) {
      toast.error("All offering fields are required");
      return;
    }
    try {
      await createWhatYouGet({
        sectionTitle,
        sectionSubtitle,
        offerings,
      }).unwrap();
      toast.success("Section created successfully");
      resetCreateForm();
      setCreateOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create section");
    }
  };

  const handleEditOpen = (section: IWhatYouGetData) => {
    setEditId(section._id);
    setEditSectionTitle(section.sectionTitle);
    setEditSectionSubtitle(section.sectionSubtitle);
    setEditOfferings(section.offerings);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editSectionTitle || !editSectionSubtitle) {
      toast.error("All fields are required");
      return;
    }
    if (editOfferings.some((o) => !o.title || !o.description)) {
      toast.error("All offering fields are required");
      return;
    }
    try {
      await updateWhatYouGet({
        id: editId,
        data: {
          sectionTitle: editSectionTitle,
          sectionSubtitle: editSectionSubtitle,
          offerings: editOfferings,
        },
      }).unwrap();
      toast.success("Section updated successfully");
      setEditOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update section");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteWhatYouGet(id).unwrap();
      toast.success("Section deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete section");
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">What You Get</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your What You Get section
          </p>
        </div>
        {!sections && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-3 h-3 mr-1" /> Add Section
          </Button>
        )}
      </div>

      {/* SECTIONS LIST */}
      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-20 border rounded-xl">
          <BookOpen className="w-10 h-10 mb-3 text-muted-foreground/40" />
          <p className="font-medium">No sections created yet</p>
          <p className="text-sm mt-1">
            Click &quot;Add Section&quot; to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section._id}>
              <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">
                      {section.sectionTitle}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {section.sectionSubtitle}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOpen(section)}
                      disabled={isUpdating}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(section._id)}
                      disabled={deletingId === section._id}
                    >
                      {deletingId === section._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Offerings grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t pt-4">
                  {section.offerings?.map((offering, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center text-center gap-2 p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-[#A9F877] rounded-lg flex items-center justify-center text-black">
                        {iconMap[offering.icon]}
                      </div>
                      <p className="text-sm font-medium leading-tight">
                        {offering.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {offering.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="w-[95vw] max-w-lg rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create What You Get Section</DialogTitle>
          </DialogHeader>
          <FormFields
            sectionTitleVal={sectionTitle}
            setSectionTitleVal={setSectionTitle}
            sectionSubtitleVal={sectionSubtitle}
            setSectionSubtitleVal={setSectionSubtitle}
            offeringsVal={offerings}
            setOfferingsVal={setOfferings}
          />
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleCreate}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-[95vw] max-w-lg rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit What You Get Section</DialogTitle>
          </DialogHeader>
          <FormFields
            sectionTitleVal={editSectionTitle}
            setSectionTitleVal={setEditSectionTitle}
            sectionSubtitleVal={editSectionSubtitle}
            setSectionSubtitleVal={setEditSectionSubtitle}
            offeringsVal={editOfferings}
            setOfferingsVal={setEditOfferings}
          />
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
