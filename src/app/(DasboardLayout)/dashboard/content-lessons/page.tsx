"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, FileText, SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ── Types ─────────────────────────────────────────────────────────────────────
type Lesson = {
  title: string;
  level: string;
};

type Resource = {
  title: string;
  type: string;
};

type LessonFormData = {
  level: string;
  title: string;
  content: string;
  exercises: string;
};

type ResourceFormData = {
  title: string;
  type: string;
};

// ── Initial Data ──────────────────────────────────────────────────────────────
const initialLessons: Lesson[] = [
  { title: "Greetings and Introductions", level: "A0" },
  { title: "Numbers and Colors", level: "A0" },
  { title: "Present Simple", level: "A1" },
  { title: "Daily Routines", level: "A1" },
];

const initialResources: Resource[] = [
  { title: "Grammar Reference Guide", type: "PDF" },
  { title: "Vocabulary Lists", type: "Document" },
  { title: "Pronunciation Videos", type: "Video" },
];

// ── Add Lesson Modal ──────────────────────────────────────────────────────────
function AddLessonModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { register, handleSubmit, reset, setValue } = useForm<LessonFormData>();

  function onSubmit(data: LessonFormData): void {
    console.log("New lesson:", data);
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Add New Lesson</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500 -mt-3 mb-1">Create a new lesson for students</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Level + Title side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1 block text-sm font-medium">Level</Label>
              <Select onValueChange={(val) => setValue("level", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  {["A0", "A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block text-sm font-medium">Title</Label>
              <Input
                {...register("title", { required: true })}
                placeholder="e.g., Present Simple"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1 block text-sm font-medium">Lesson Content</Label>
            <Textarea
              {...register("content")}
              placeholder="Enter lesson content..."
              className="resize-none"
            />
          </div>

          <div>
            <Label className="mb-1 block text-sm font-medium">Practice Exercises</Label>
            <Textarea
              {...register("exercises")}
              placeholder="Enter practice exercises..."
              className="resize-none"
            />
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
            >
              Create Lesson
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Add Resource Modal ────────────────────────────────────────────────────────
function AddResourceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { register, handleSubmit, reset, setValue } = useForm<ResourceFormData>();

  function onSubmit(data: ResourceFormData): void {
    console.log("New resource:", data);
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Add Resource</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500 -mt-3 mb-1">Add a new learning resource</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-1 block text-sm font-medium">Title</Label>
            <Input
              {...register("title", { required: true })}
              placeholder="Resource title"
            />
          </div>

          <div>
            <Label className="mb-1 block text-sm font-medium">Type</Label>
            <Select onValueChange={(val) => setValue("type", val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {["PDF", "Document", "Video", "Audio", "Link"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
            >
              Create Lesson
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CoursePage() {
  const [lessons] = useState<Lesson[]>(initialLessons);
  const [resources] = useState<Resource[]>(initialResources);
  const [lessonOpen, setLessonOpen] = useState<boolean>(false);
  const [resourceOpen, setResourceOpen] = useState<boolean>(false);

  return (
    <div className="max-w-6xl mx-auto p-5 my-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Title</h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setLessonOpen(true)}
            className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
          >
            <Plus size={15} /> Add Lesson
          </Button>
          <Button
            variant="outline"
            onClick={() => setResourceOpen(true)}
            className="gap-2 text-gray-700 font-medium"
          >
            <Plus size={15} /> Add Resource
          </Button>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="border border-gray-200 rounded-lg bg-white mb-5">
        <p className="text-sm text-gray-500 font-medium px-5 pt-4 pb-3">Lessons</p>
        <div className="px-3 pb-3 space-y-2">
          {lessons.map((lesson, i) => (
            <div
              key={i}
              className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-blue-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-900">
                  {lesson.title}{" "}
                  <span className="text-gray-400 font-normal">({lesson.level})</span>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                <SquarePen size={14} /> Edit
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources Section */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <p className="text-sm text-gray-500 font-medium px-5 pt-4 pb-3">Additional Resources</p>
        <div className="px-3 pb-3 space-y-2">
          {resources.map((res, i) => (
            <div
              key={i}
              className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-green-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-900">
                  {res.title}{" "}
                  <span className="text-gray-400 font-normal">({res.type})</span>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                <SquarePen size={14} /> Edit
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddLessonModal open={lessonOpen} onClose={() => setLessonOpen(false)} />
      <AddResourceModal open={resourceOpen} onClose={() => setResourceOpen(false)} />
    </div>
  );
}