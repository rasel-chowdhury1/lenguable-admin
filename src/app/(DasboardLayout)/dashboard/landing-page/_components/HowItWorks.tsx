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
  useCreateHowItWorksMutation,
  useDeleteHowItWorksMutation,
  useGetAllHowItWorksQuery,
  useUpdateHowItWorksMutation,
} from "@/redux/features/workApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IStep {
  title: string;
  description: string;
}

interface IHowItWorksData {
  _id: string;
  sectionTitle: string;
  sectionSubtitle: string;
  image: string;
  badge: {
    label: string;
    tagline: string;
  };
  steps: IStep[];
}

// ─── Step Fields Component ────────────────────────────────────────────────────

const StepFields = ({
  steps,
  setSteps,
}: {
  steps: IStep[];
  setSteps: (steps: IStep[]) => void;
}) => {
  const handleChange = (index: number, field: keyof IStep, value: string) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const addStep = () => setSteps([...steps, { title: "", description: "" }]);

  const removeStep = (index: number) =>
    setSteps(steps.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Steps</label>
        <Button type="button" variant="outline" size="sm" onClick={addStep}>
          <Plus className="w-3 h-3 mr-1" /> Add Step
        </Button>
      </div>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 bg-muted/30 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Step {index + 1}
              </span>
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            <Input
              placeholder="Step title"
              value={step.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
            />
            <Input
              placeholder="Step description"
              value={step.description}
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
  sectionTitleVal: string;
  setSectionTitleVal: (v: string) => void;
  sectionSubtitleVal: string;
  setSectionSubtitleVal: (v: string) => void;
  badgeLabelVal: string;
  setBadgeLabelVal: (v: string) => void;
  badgeTaglineVal: string;
  setBadgeTaglineVal: (v: string) => void;
  stepsVal: IStep[];
  setStepsVal: (v: IStep[]) => void;
  fileVal: File | null;
  setFileVal: (v: File | null) => void;
  currentImage?: string;
}

const FormFields = ({
  sectionTitleVal,
  setSectionTitleVal,
  sectionSubtitleVal,
  setSectionSubtitleVal,
  badgeLabelVal,
  setBadgeLabelVal,
  badgeTaglineVal,
  setBadgeTaglineVal,
  stepsVal,
  setStepsVal,
  fileVal,
  setFileVal,
  currentImage,
}: FormFieldsProps) => (
  <div className="space-y-4 mt-2">
    <div className="space-y-1">
      <label className="text-sm font-medium">Section Title</label>
      <Input
        placeholder="e.g. How It Works"
        value={sectionTitleVal}
        onChange={(e) => setSectionTitleVal(e.target.value)}
      />
    </div>

    <div className="space-y-1">
      <label className="text-sm font-medium">Section Subtitle</label>
      <Textarea
        placeholder="e.g. Simple steps to start your English learning journey"
        rows={2}
        value={sectionSubtitleVal}
        onChange={(e) => setSectionSubtitleVal(e.target.value)}
      />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <label className="text-sm font-medium">Badge Label</label>
        <Input
          placeholder="e.g. Guaranteed"
          value={badgeLabelVal}
          onChange={(e) => setBadgeLabelVal(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Badge Tagline</label>
        <Input
          placeholder="e.g. Connect with Native English Tutors"
          value={badgeTaglineVal}
          onChange={(e) => setBadgeTaglineVal(e.target.value)}
        />
      </div>
    </div>

    <StepFields steps={stepsVal} setSteps={setStepsVal} />

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

export default function HowItWork() {
  const { data, isLoading } = useGetAllHowItWorksQuery(undefined);
  const [createHowItWorks, { isLoading: isCreating }] =
    useCreateHowItWorksMutation();
  const [updateHowItWorks, { isLoading: isUpdating }] =
    useUpdateHowItWorksMutation();
  const [deleteHowItWorks, { isLoading: isDeleting }] =
    useDeleteHowItWorksMutation();

  const sections: IHowItWorksData[] = data?.data || [];

  // ── Create State ──
  const [createOpen, setCreateOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionSubtitle, setSectionSubtitle] = useState("");
  const [badgeLabel, setBadgeLabel] = useState("");
  const [badgeTagline, setBadgeTagline] = useState("");
  const [steps, setSteps] = useState<IStep[]>([{ title: "", description: "" }]);
  const [file, setFile] = useState<File | null>(null);

  // ── Edit State ──
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editSectionTitle, setEditSectionTitle] = useState("");
  const [editSectionSubtitle, setEditSectionSubtitle] = useState("");
  const [editBadgeLabel, setEditBadgeLabel] = useState("");
  const [editBadgeTagline, setEditBadgeTagline] = useState("");
  const [editSteps, setEditSteps] = useState<IStep[]>([
    { title: "", description: "" },
  ]);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editCurrentImage, setEditCurrentImage] = useState("");

  // ── Delete State ──
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const resetCreateForm = () => {
    setSectionTitle("");
    setSectionSubtitle("");
    setBadgeLabel("");
    setBadgeTagline("");
    setSteps([{ title: "", description: "" }]);
    setFile(null);
  };

  const handleCreate = async () => {
    if (!sectionTitle || !sectionSubtitle || !badgeLabel || !badgeTagline) {
      toast.error("All fields are required");
      return;
    }
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    if (steps.some((s) => !s.title || !s.description)) {
      toast.error("All step fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("sectionTitle", sectionTitle);
    formData.append("sectionSubtitle", sectionSubtitle);
    formData.append("badge[label]", badgeLabel);
    formData.append("badge[tagline]", badgeTagline);
    formData.append("file", file);
    steps.forEach((step, i) => {
      formData.append(`steps[${i}][title]`, step.title);
      formData.append(`steps[${i}][description]`, step.description);
    });

    try {
      await createHowItWorks(formData).unwrap();
      toast.success("Section created successfully");
      resetCreateForm();
      setCreateOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create section");
    }
  };

  const handleEditOpen = (section: IHowItWorksData) => {
    setEditId(section._id);
    setEditSectionTitle(section.sectionTitle);
    setEditSectionSubtitle(section.sectionSubtitle);
    setEditBadgeLabel(section.badge?.label || "");
    setEditBadgeTagline(section.badge?.tagline || "");
    setEditSteps(section.steps || [{ title: "", description: "" }]);
    setEditCurrentImage(section.image || "");
    setEditFile(null);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (
      !editSectionTitle ||
      !editSectionSubtitle ||
      !editBadgeLabel ||
      !editBadgeTagline
    ) {
      toast.error("All fields are required");
      return;
    }
    if (editSteps.some((s) => !s.title || !s.description)) {
      toast.error("All step fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("sectionTitle", editSectionTitle);
    formData.append("sectionSubtitle", editSectionSubtitle);
    formData.append("badge[label]", editBadgeLabel);
    formData.append("badge[tagline]", editBadgeTagline);
    if (editFile) formData.append("file", editFile);
    editSteps.forEach((step, i) => {
      formData.append(`steps[${i}][title]`, step.title);
      formData.append(`steps[${i}][description]`, step.description);
    });

    try {
      await updateHowItWorks({ id: editId, formData }).unwrap();
      toast.success("Section updated successfully");
      setEditOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update section");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteHowItWorks(id).unwrap();
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
          <h1 className="text-xl sm:text-2xl font-bold">How It Works</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your How It Works section
          </p>
        </div>
        {!sections && (
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
          <p className="font-medium">No sections created yet</p>
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
                        alt={section.sectionTitle}
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

                    {/* Badge */}
                    <div className="flex items-center gap-2">
                      <span className="inline-block bg-[#A9F877] rounded-full px-3 py-1 text-xs font-medium">
                        {section.badge?.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {section.badge?.tagline}
                      </span>
                    </div>

                    {/* Steps */}
                    <div className="border-t pt-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        STEPS ({section.steps?.length})
                      </p>
                      <div className="space-y-1">
                        {section.steps?.map((step, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#A9F877] text-black text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium">
                                {step.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
            <DialogTitle>Create How It Works Section</DialogTitle>
          </DialogHeader>
          <FormFields
            sectionTitleVal={sectionTitle}
            setSectionTitleVal={setSectionTitle}
            sectionSubtitleVal={sectionSubtitle}
            setSectionSubtitleVal={setSectionSubtitle}
            badgeLabelVal={badgeLabel}
            setBadgeLabelVal={setBadgeLabel}
            badgeTaglineVal={badgeTagline}
            setBadgeTaglineVal={setBadgeTagline}
            stepsVal={steps}
            setStepsVal={setSteps}
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
            <DialogTitle>Edit How It Works Section</DialogTitle>
          </DialogHeader>
          <FormFields
            sectionTitleVal={editSectionTitle}
            setSectionTitleVal={setEditSectionTitle}
            sectionSubtitleVal={editSectionSubtitle}
            setSectionSubtitleVal={setEditSectionSubtitle}
            badgeLabelVal={editBadgeLabel}
            setBadgeLabelVal={setEditBadgeLabel}
            badgeTaglineVal={editBadgeTagline}
            setBadgeTaglineVal={setEditBadgeTagline}
            stepsVal={editSteps}
            setStepsVal={setEditSteps}
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
