/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, SquarePen, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lesson, Resource } from "@/types";
import AddLessonModal from "./_components/AddLessonModal";
import AddResourceModal from "./_components/AddResourceModal";
import { toast } from "sonner";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  useGetAllLessonsQuery,
  useDeleteLessonMutation,
  useReorderLessonsMutation,
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

// Sortable Lesson Row

function SortableLessonRow({
  lesson,
  onEdit,
  onDelete,
}: {
  lesson: Lesson;
  onEdit: (l: Lesson) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border rounded-lg px-4 py-3 bg-white"
    >
      {/* Left: drag handle + icon + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors shrink-0"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>

        <FileText size={16} className="text-blue-500 shrink-0" />

        <span className="text-sm font-semibold wrap-break-word">
          {lesson.title}
          <span className="text-gray-400 font-normal"> ({lesson.level})</span>
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs sm:text-sm h-8 px-2 sm:px-3"
          onClick={() => onEdit(lesson)}
        >
          <SquarePen size={13} className="mr-1" /> Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs sm:text-sm h-8 px-2 sm:px-3 text-destructive hover:text-destructive"
          onClick={() => onDelete(lesson._id)}
        >
          <Trash2 size={13} className="mr-1" /> Delete
        </Button>
      </div>
    </div>
  );
}

// Main Page
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
  const [orderedLessons, setOrderedLessons] = useState<Lesson[]>([]);

  const { data, isLoading, isError } = useGetAllLessonsQuery(undefined);
  const lessons: Lesson[] = data?.data || [];

  const { data: resourceData } = useGetAllResourcesQuery(undefined);
  const resources: Resource[] = resourceData?.data || [];

  const [deleteLesson] = useDeleteLessonMutation();
  const [deleteResource] = useDeleteResourceMutation();
  const [reorderLessons] = useReorderLessonsMutation();

  // Sync server data → local state
  useEffect(() => {
    setOrderedLessons(lessons);
  }, [lessons]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedLessons.findIndex((l) => l._id === active.id);
    const newIndex = orderedLessons.findIndex((l) => l._id === over.id);
    const reordered = arrayMove(orderedLessons, oldIndex, newIndex);

    setOrderedLessons(reordered); // optimistic update

    try {
      await reorderLessons(reordered.map((l) => l._id)).unwrap();
      toast.success("Order saved");
    } catch {
      setOrderedLessons(lessons); // rollback on failure
      toast.error("Failed to save order");
    }
  };

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

  if (isLoading)
    return <p className="p-4 text-sm text-muted-foreground">Loading...</p>;
  if (isError)
    return <p className="p-4 text-sm text-destructive">Something went wrong</p>;

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
        <p className="text-sm text-gray-500 font-medium px-4 sm:px-5 pt-4 pb-3 flex items-center gap-1">
          Lessons
          <span className="text-xs text-gray-400 font-normal ml-1">
            — drag <GripVertical size={11} className="inline -mt-0.5" /> to
            reorder
          </span>
        </p>

        <div className="px-3 pb-3 space-y-2">
          {orderedLessons.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No lessons yet.
            </p>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedLessons.map((l) => l._id)}
              strategy={verticalListSortingStrategy}
            >
              {orderedLessons.map((lesson) => (
                <SortableLessonRow
                  key={lesson._id}
                  lesson={lesson}
                  onEdit={(l) => {
                    setSelectedLesson(l);
                    setLessonOpen(true);
                  }}
                  onDelete={openDeleteLesson}
                />
              ))}
            </SortableContext>
          </DndContext>
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
