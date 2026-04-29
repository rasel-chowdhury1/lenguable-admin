/* eslint-disable @typescript-eslint/no-unused-vars */
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

// ShadCN AlertDialog
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

  // Delete dialog state
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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  // =========================
  // OPEN DELETE DIALOG
  // =========================
  const openDeleteLesson = (id: string) => {
    setDeleteType("lesson");
    setDeleteId(id);
  };

  const openDeleteResource = (id: string) => {
    setDeleteType("resource");
    setDeleteId(id);
  };

  // =========================
  // CONFIRM DELETE
  // =========================
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
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
      setDeleteType(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5 my-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Course Lessons</h1>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setSelectedLesson(null);
              setLessonOpen(true);
            }}
            className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
          >
            <Plus size={15} /> Add Lesson
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setSelectedResource(null);
              setResourceOpen(true);
            }}
          >
            <Plus size={15} /> Add Resource
          </Button>
        </div>
      </div>

      {/* LESSONS */}
      <div className="border border-gray-200 rounded-lg bg-white mb-5">
        <p className="text-sm text-gray-500 font-medium px-5 pt-4 pb-3">
          Lessons
        </p>

        <div className="px-3 pb-3 space-y-2">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="flex items-center justify-between border rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-blue-500" />
                <span className="text-sm font-semibold">
                  {lesson.title}
                  <span className="text-gray-400"> ({lesson.level})</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setLessonOpen(true);
                  }}
                >
                  <SquarePen size={14} /> Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDeleteLesson(lesson._id)}
                >
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESOURCES */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <p className="text-sm text-gray-500 font-medium px-5 pt-4 pb-3">
          Additional Resources
        </p>

        <div className="px-3 pb-3 space-y-2">
          {resources.map((res) => (
            <div
              key={res._id}
              className="flex items-center justify-between border rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-green-500" />
                <span className="text-sm font-semibold">
                  {res.title}
                  <span className="text-gray-400"> ({res.type})</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedResource(res);
                    setResourceOpen(true);
                  }}
                >
                  <SquarePen size={14} /> Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDeleteResource(res._id)}
                >
                  <Trash2 size={14} /> Delete
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

      {/* =========================
          SHADCN DELETE CONFIRM MODAL
          ========================= */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => {
          setDeleteId(null);
          setDeleteType(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this{" "}
              {deleteType} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteId(null);
                setDeleteType(null);
              }}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction onClick={confirmDelete}>
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
