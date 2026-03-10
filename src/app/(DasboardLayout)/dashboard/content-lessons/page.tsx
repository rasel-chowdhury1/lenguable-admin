"use client";

import { useState } from "react";
import { Plus, FileText, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lesson, Resource } from "@/types";
import AddLessonModal from "./_components/AddLessonModal";
import AddResourceModal from "./_components/AddResourceModal";
import { useGetAllLessonsQuery } from "@/redux/features/LessonApi";

const initialResources: Resource[] = [
  { title: "Grammar Reference Guide", type: "PDF" },
  { title: "Vocabulary Lists", type: "Document" },
  { title: "Pronunciation Videos", type: "Video" },
];

export default function CoursePage() {
  const [resources] = useState<Resource[]>(initialResources);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);

  //  selected lesson for edit
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { data, isLoading, isError } = useGetAllLessonsQuery(undefined);
  const lessons: Lesson[] = data?.data || [];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  return (
    <div className="max-w-6xl mx-auto p-5 my-10">
      {/* Header */}
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
            onClick={() => setResourceOpen(true)}
            className="gap-2 text-gray-700 font-medium"
          >
            <Plus size={15} /> Add Resource
          </Button>
        </div>
      </div>

      {/* Lessons */}
      <div className="border border-gray-200 rounded-lg bg-white mb-5">
        <p className="text-sm text-gray-500 font-medium px-5 pt-4 pb-3">
          Lessons
        </p>

        <div className="px-3 pb-3 space-y-2">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-blue-500 shrink-0" />

                <span className="text-sm font-semibold text-gray-900">
                  {lesson.title}{" "}
                  <span className="text-gray-400 font-normal">
                    ({lesson.level})
                  </span>
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
                onClick={() => {
                  setSelectedLesson(lesson); 
                  setLessonOpen(true);
                }}
              >
                <SquarePen size={14} /> Edit
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <p className="text-sm text-gray-500 font-medium px-5 pt-4 pb-3">
          Additional Resources
        </p>

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
                  <span className="text-gray-400 font-normal">
                    ({res.type})
                  </span>
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
      <AddLessonModal
        open={lessonOpen}
        lesson={selectedLesson}
        onClose={() => {
          setLessonOpen(false);
          setSelectedLesson(null);
        }}
      />

      <AddResourceModal
        open={resourceOpen}
        onClose={() => setResourceOpen(false)}
      />
    </div>
  );
}