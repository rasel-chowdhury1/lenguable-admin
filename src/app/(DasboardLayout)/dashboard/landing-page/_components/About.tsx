/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2, Plus, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import {
  useCreateAboutMutation,
  useDeleteAboutMutation,
  useGetAllAboutQuery,
  useUpdateAboutMutation,
} from "@/redux/features/aboutApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IStatItem {
  value: string;
  label: string;
  description: string;
}

interface IAboutData {
  _id: string;
  title: string;
  description: string;
  image: string;
  stats: IStatItem[];
}

// ─── Stat Fields Component ────────────────────────────────────────────────────

const StatFields = ({
  stats,
  setStats,
}: {
  stats: IStatItem[];
  setStats: (stats: IStatItem[]) => void;
}) => {
  const handleChange = (
    index: number,
    field: keyof IStatItem,
    value: string,
  ) => {
    // Fix: create a new object for the changed item instead of mutating
    const updated = stats.map((stat, i) =>
      i === index ? { ...stat, [field]: value } : stat,
    );
    setStats(updated);
  };

  const addStat = () =>
    setStats([...stats, { value: "", label: "", description: "" }]);

  const removeStat = (index: number) =>
    setStats(stats.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Stats</label>
        <Button type="button" variant="outline" size="sm" onClick={addStat}>
          <Plus className="w-3 h-3 mr-1" /> Add Stat
        </Button>
      </div>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 bg-muted/30 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Stat {index + 1}
              </span>
              {stats.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            <Input
              placeholder="Value (e.g. 10k+)"
              value={stat.value}
              onChange={(e) => handleChange(index, "value", e.target.value)}
            />
            <Input
              placeholder="Label (e.g. Students)"
              value={stat.label}
              onChange={(e) => handleChange(index, "label", e.target.value)}
            />
            <Input
              placeholder="Description (e.g. Active learners worldwide)"
              value={stat.description}
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

// ─── Form Fields Component ────────────────────────────────────────────────────

interface FormFieldsProps {
  titleVal: string;
  setTitleVal: (v: string) => void;
  descriptionVal: string;
  setDescriptionVal: (v: string) => void;
  statsVal: IStatItem[];
  setStatsVal: (v: IStatItem[]) => void;
  fileVal: File | null;
  setFileVal: (v: File | null) => void;
  currentImage?: string;
}

const FormFields = ({
  titleVal,
  setTitleVal,
  descriptionVal,
  setDescriptionVal,
  statsVal,
  setStatsVal,
  fileVal,
  setFileVal,
  currentImage,
}: FormFieldsProps) => (
  <div className="space-y-4 mt-2">
    <div className="space-y-1">
      <label className="text-sm font-medium">Title</label>
      <Input
        placeholder="e.g. About Us"
        value={titleVal}
        onChange={(e) => setTitleVal(e.target.value)}
      />
    </div>

    <div className="space-y-1">
      <label className="text-sm font-medium">Description</label>
      <Textarea
        placeholder="e.g. We help students connect with native English tutors..."
        rows={3}
        value={descriptionVal}
        onChange={(e) => setDescriptionVal(e.target.value)}
      />
    </div>

    <StatFields stats={statsVal} setStats={setStatsVal} />

    {currentImage && !fileVal && (
      <div className="space-y-1">
        <label className="text-sm font-medium">Current Image</label>
        <div className="rounded-lg overflow-hidden h-32 bg-muted">
          <Image
            src={currentImage}
            alt="current"
            width={400}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    )}

    <div className="space-y-1">
      <label className="text-sm font-medium">
        {currentImage ? "Replace Image (optional)" : "Image"}
      </label>
      <div className="flex items-center gap-2 border rounded-md px-3 py-2">
        <ImagePlus className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input
          type="file"
          accept="image/*"
          className="border-0 p-0 shadow-none text-sm"
          onChange={(e) => setFileVal(e.target.files?.[0] || null)}
        />
      </div>
      {fileVal && (
        <p className="text-xs text-muted-foreground">{fileVal.name} selected</p>
      )}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function About() {
  const { data, isLoading } = useGetAllAboutQuery(undefined);
  const [createAbout, { isLoading: isCreating }] = useCreateAboutMutation();
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();
  const [deleteAbout, { isLoading: isDeleting }] = useDeleteAboutMutation();

  const sections: IAboutData[] = data?.data || [];

  // ── Create State ──
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stats, setStats] = useState<IStatItem[]>([
    { value: "", label: "", description: "" },
  ]);
  const [file, setFile] = useState<File | null>(null);

  // ── Edit State ──
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStats, setEditStats] = useState<IStatItem[]>([
    { value: "", label: "", description: "" },
  ]);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editCurrentImage, setEditCurrentImage] = useState("");

  // ── Delete State ──
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const resetCreateForm = () => {
    setTitle("");
    setDescription("");
    setStats([{ value: "", label: "", description: "" }]);
    setFile(null);
  };

  const handleCreate = async () => {
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    if (stats.some((s) => !s.value || !s.label || !s.description)) {
      toast.error("All stat fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("stats", JSON.stringify(stats));

    try {
      await createAbout(formData).unwrap();
      toast.success("Section created successfully");
      resetCreateForm();
      setCreateOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create section");
    }
  };

  const handleEditOpen = (section: IAboutData) => {
    setEditId(section._id);
    setEditTitle(section.title);
    setEditDescription(section.description);
    // Fix: deep copy each stat object to avoid mutating Redux state
    setEditStats(
      section.stats?.length
        ? section.stats.map((s) => ({ ...s }))
        : [{ value: "", label: "", description: "" }],
    );
    setEditCurrentImage(section.image || "");
    setEditFile(null);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editTitle || !editDescription) {
      toast.error("Title and description are required");
      return;
    }
    if (editStats.some((s) => !s.value || !s.label || !s.description)) {
      toast.error("All stat fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("description", editDescription);
    if (editFile) formData.append("file", editFile);
    formData.append("stats", JSON.stringify(editStats));

    try {
      await updateAbout({ id: editId, formData }).unwrap();
      toast.success("Section updated successfully");
      setEditOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update section");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAbout(id).unwrap();
      toast.success("Section deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete section");
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

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
          <h1 className="text-xl sm:text-2xl font-bold">About</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your About section
          </p>
        </div>
        {sections.length === 0 && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        )}
      </div>

      {/* SECTIONS LIST */}
      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-20 border rounded-xl">
          <ImagePlus className="w-10 h-10 mb-3 text-muted-foreground/40" />
          <p className="font-medium">No section created yet</p>
          <p className="text-sm mt-1">
            Click &quot;Add Section&quot; to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section._id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  {section.image && (
                    <div className="rounded-xl overflow-hidden h-40 sm:h-auto sm:w-48 shrink-0 bg-muted">
                      <Image
                        src={section.image}
                        alt={section.title}
                        width={192}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold">{section.title}</h2>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {section.description}
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

                    {/* Stats */}
                    {section.stats?.length > 0 && (
                      <div className="border-t pt-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                          STATS ({section.stats.length})
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {section.stats.map((stat, i) => (
                            <div
                              key={i}
                              className="rounded-lg bg-muted/40 px-3 py-2"
                            >
                              <p className="text-base font-bold text-[#A9F877]">
                                {stat.value}
                              </p>
                              <p className="text-xs font-semibold">
                                {stat.label}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {stat.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
            <DialogTitle>Create About Section</DialogTitle>
          </DialogHeader>
          <FormFields
            titleVal={title}
            setTitleVal={setTitle}
            descriptionVal={description}
            setDescriptionVal={setDescription}
            statsVal={stats}
            setStatsVal={setStats}
            fileVal={file}
            setFileVal={setFile}
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
            <DialogTitle>Edit About Section</DialogTitle>
          </DialogHeader>
          <FormFields
            titleVal={editTitle}
            setTitleVal={setEditTitle}
            descriptionVal={editDescription}
            setDescriptionVal={setEditDescription}
            statsVal={editStats}
            setStatsVal={setEditStats}
            fileVal={editFile}
            setFileVal={setEditFile}
            currentImage={editCurrentImage}
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
