"use client";

import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Lesson, LessonFormData } from "@/types";
import { useForm } from "react-hook-form";
import {
  useCreateLessonMutation,
  useUpdateLessonMutation,
} from "@/redux/features/LessonApi";

type Props = {
  open: boolean;
  onClose: () => void;
  lesson?: Lesson | null;
};

const AddLessonModal = ({ open, onClose, lesson }: Props) => {
  const { register, handleSubmit, reset, setValue } = useForm<LessonFormData>();

  const [createLesson] = useCreateLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();

  // Prefill form when editing
  useEffect(() => {
    if (lesson) {
      setValue("title", lesson.title);
      setValue("level", lesson.level);
      setValue("content", lesson.content);
      setValue("exercises", lesson.exercises);
    } else {
      reset();
    }
  }, [lesson, setValue, reset]);

  const onSubmit = async (data: LessonFormData) => {
    try {
      if (lesson?._id) {
        await updateLesson({
          id: lesson._id,
          data,
        }).unwrap();
      } else {
        await createLesson(data).unwrap();
      }

      reset();
      onClose();
    } catch (error) {
      console.error("Lesson error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
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
                defaultValue={lesson?.level}
                onValueChange={(val) => setValue("level", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>

                <SelectContent>
                  {["A0", "A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
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

          {/* Content */}
          <div>
            <Label className="mb-1 block text-sm font-medium">
              Lesson Content
            </Label>

            <Textarea
              {...register("content")}
              placeholder="Enter lesson content..."
              className="resize-none"
            />
          </div>

          {/* Exercises */}
          <div>
            <Label className="mb-1 block text-sm font-medium">
              Practice Exercises
            </Label>

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
              {lesson ? "Update Lesson" : "Create Lesson"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLessonModal;