"use client";

import { useState } from "react";
import { Plus, FileText, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lesson, Resource } from "@/types";
import AddLessonModal from "./_components/AddLessonModal";
import AddResourceModal from "./_components/AddResourceModal";
import { toast } from "sonner";

import {
  useGetAllLessonsQuery,
  useDeleteLessonMutation,
} from "@/redux/features/LessonApi";

import {
  useGetAllResourcesQuery,
  useDeleteResourceMutation,
} from "@/redux/features/resourceApi";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CoursePage() {
  const [lessonOpen, setLessonOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [deleteType, setDeleteType] = useState<"lesson" | "resource" | null>(
    null,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetAllLessonsQuery(undefined);
  const lessons: Lesson[] = data?.data || [];

  const { data: resourceData } = useGetAllResourcesQuery(undefined);
  const resources: Resource[] = resourceData?.data || [];

  const [deleteLesson] = useDeleteLessonMutation();
  const [deleteResource] = useDeleteResourceMutation();

  if (isLoading)
    return <p className="p-4 text-sm text-muted-foreground">Loading...</p>;
  if (isError)
    return <p className="p-4 text-sm text-destructive">Something went wrong</p>;

  const openDeleteLesson = (id: string) => {
    setDeleteType("lesson");
    setDeleteId(id);
  };
  const openDeleteResource = (id: string) => {
    setDeleteType("resource");
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId || !deleteType) return;
    try {
      if (deleteType === "lesson") {
        await deleteLesson(deleteId).unwrap();
        toast.success("Lesson deleted successfully");
      }
      if (deleteType === "resource") {
        await deleteResource(deleteId).unwrap();
        toast.success("Resource deleted successfully");
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
      setDeleteType(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-5 my-6 sm:my-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Course Lessons
        </h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            onClick={() => {
              setSelectedLesson(null);
              setLessonOpen(true);
            }}
            className="bg-[#A9F877] hover:bg-[#C1FF72] text-black text-sm flex-1 sm:flex-none"
          >
            <Plus size={14} className="mr-1" /> Add Lesson
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedResource(null);
              setResourceOpen(true);
            }}
            className="text-sm flex-1 sm:flex-none"
          >
            <Plus size={14} className="mr-1" /> Add Resource
          </Button>
        </div>
      </div>

      {/* LESSONS */}
      <div className="border border-gray-200 rounded-lg bg-white mb-5">
        <p className="text-sm text-gray-500 font-medium px-4 sm:px-5 pt-4 pb-3">
          Lessons
        </p>
        <div className="px-3 pb-3 space-y-2">
          {lessons.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No lessons yet.
            </p>
          )}
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border rounded-lg px-4 py-3"
            >
              {/* Left: icon + title */}
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <FileText
                  size={16}
                  className="text-blue-500 mt-0.5 sm:mt-0 shrink-0"
                />
                <span className="text-sm font-semibold wrap-break-word">
                  {lesson.title}
                  <span className="text-gray-400 font-normal">
                    {" "}
                    ({lesson.level})
                  </span>
                </span>
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm h-8 px-2 sm:px-3"
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setLessonOpen(true);
                  }}
                >
                  <SquarePen size={13} className="mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm h-8 px-2 sm:px-3 text-destructive hover:text-destructive"
                  onClick={() => openDeleteLesson(lesson._id)}
                >
                  <Trash2 size={13} className="mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESOURCES */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <p className="text-sm text-gray-500 font-medium px-4 sm:px-5 pt-4 pb-3">
          Additional Resources
        </p>
        <div className="px-3 pb-3 space-y-2">
          {resources.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No resources yet.
            </p>
          )}
          {resources.map((res) => (
            <div
              key={res._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border rounded-lg px-4 py-3"
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <FileText
                  size={16}
                  className="text-green-500 mt-0.5 sm:mt-0 shrink-0"
                />
                <span className="text-sm font-semibold wrap-break-word">
                  {res.title}
                  <span className="text-gray-400 font-normal">
                    {" "}
                    ({res.type})
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm h-8 px-2 sm:px-3"
                  onClick={() => {
                    setSelectedResource(res);
                    setResourceOpen(true);
                  }}
                >
                  <SquarePen size={13} className="mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm h-8 px-2 sm:px-3 text-destructive hover:text-destructive"
                  onClick={() => openDeleteResource(res._id)}
                >
                  <Trash2 size={13} className="mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      <AddLessonModal
        open={lessonOpen}
        lesson={selectedLesson}
        onClose={() => setLessonOpen(false)}
      />
      <AddResourceModal
        open={resourceOpen}
        resource={selectedResource}
        onClose={() => setResourceOpen(false)}
      />

      {/* DELETE CONFIRM */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => {
          setDeleteId(null);
          setDeleteType(null);
        }}
      >
        <AlertDialogContent className="max-w-sm sm:max-w-md mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this{" "}
              {deleteType} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel
              className="w-full sm:w-auto"
              onClick={() => {
                setDeleteId(null);
                setDeleteType(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto"
              onClick={confirmDelete}
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
