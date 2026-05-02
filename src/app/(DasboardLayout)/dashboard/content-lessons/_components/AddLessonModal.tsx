/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lesson, LessonFormData } from "@/types";
import { useForm } from "react-hook-form";
import {
  useCreateLessonMutation,
  useUpdateLessonMutation,
} from "@/redux/features/LessonApi";
import { toast } from "sonner";
import { FileText, X, Upload } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  lesson?: Lesson | null;
};

// Helper to get a short display name
const getShortFileName = (name: string) => {
  if (name.length <= 20) return name;
  const ext = name.split(".").pop();
  return name.substring(0, 20) + "..." + ext;
};

const AddLessonModal = ({ open, onClose, lesson }: Props) => {
  const { register, handleSubmit, reset, setValue } = useForm<LessonFormData>();
  const [createLesson] = useCreateLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();
  const [exerciseList, setExerciseList] = useState<string[]>([""]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFileName, setExistingFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lesson) {
      setValue("title", lesson.title);
      setValue("level", lesson.level);
      setExerciseList(
        Array.isArray(lesson.exercises) && lesson.exercises.length > 0
          ? lesson.exercises
          : [""],
      );
      if (lesson.file) {
        const parts = lesson.file.split("/");
        setExistingFileName(parts[parts.length - 1]);
      } else {
        setExistingFileName(""); // ✅ Clear if no file
      }
      setSelectedFile(null); // ✅ Always clear selected file on edit open
    } else {
      reset();
      setExerciseList([""]);
      setSelectedFile(null);
      setExistingFileName("");
    }
  }, [lesson, setValue, reset, open]); // ✅ Add `open` as dependency

  const handleExerciseChange = (index: number, value: string) => {
    const updated = [...exerciseList];
    updated[index] = value;
    setExerciseList(updated);
  };

  const addExercise = () => setExerciseList([...exerciseList, ""]);

  const removeExercise = (index: number) => {
    setExerciseList(exerciseList.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setExistingFileName("");
  };

  const removeFile = () => {
    setSelectedFile(null);
    setExistingFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: LessonFormData) => {
    try {
      // Build FormData — matches your Postman structure
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          ...data,
          exercises: exerciseList.filter((ex) => ex.trim() !== ""),
        }),
      );

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (lesson?._id) {
        const res = await updateLesson({
          id: lesson._id,
          data: formData,
        }).unwrap();
        toast.success(res?.message || "Lesson updated successfully!");
      } else {
        const res = await createLesson(formData).unwrap();
        toast.success(res?.message || "Lesson created successfully!");
      }

      reset();
      setExerciseList([""]);
      setSelectedFile(null);
      setExistingFileName("");
      onClose();
    } catch (error) {
      console.error("Lesson error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {lesson ? "Edit Lesson" : "Add New Lesson"}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500 -mt-3 mb-1">
          Create or update lesson
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Level + Title */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1 block text-sm font-medium">Level</Label>
              <Select
                value={lesson?.level || ""}
                onValueChange={(val) => setValue("level", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  {["A0", "A1", "A2", "B1", "B2", "C1"].map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
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

          {/* PDF Upload */}
          <div>
            <Label className="mb-1 block text-sm font-medium">Lesson PDF</Label>

            {/* Show selected or existing file */}
            {selectedFile || existingFileName ? (
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/40">
                <FileText className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-sm flex-1 truncate">
                  {selectedFile
                    ? getShortFileName(selectedFile.name)
                    : getShortFileName(existingFileName)}
                </span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-[#A9F877] hover:bg-[#A9F877]/5 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Click to upload PDF
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF only, max 10MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Dynamic Exercises */}
          <div>
            <Label className="mb-1 block text-sm font-medium">
              Practice Exercises
            </Label>
            <div className="space-y-2">
              {exerciseList.map((ex, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ex}
                    onChange={(e) =>
                      handleExerciseChange(index, e.target.value)
                    }
                    placeholder={`Exercise ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeExercise(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addExercise}
              className="mt-2"
            >
              + Add Exercise
            </Button>
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
            >
              {lesson ? "Update Lesson" : "Create Lesson"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLessonModal;
