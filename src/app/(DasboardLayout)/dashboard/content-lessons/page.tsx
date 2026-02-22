"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { courseModules } from "../../../data/courseData";
import { Trash } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// --- Types ---
interface Lesson {
  id: string;
  title: string;
  videoId: string;
  description?: string;
}

interface Reference {
  title: string;
  url: string;
}

interface Module {
  id: number;
  title: string;
  description?: string;
  references?: Reference[];
  lessons: Lesson[];
}

// --- Page Component ---
export default function CourseModulesPage() {
  const [modules, setModules] = useState<Module[]>(courseModules);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control, reset } = useForm<Module>({
    defaultValues: {
      lessons: [{ title: "", videoId: "" }],
      references: [{ title: "", url: "" }],
    },
  });

  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: "lessons",
  });

  const {
    fields: referenceFields,
    append: appendReference,
    remove: removeReference,
  } = useFieldArray({
    control,
    name: "references",
  });

  const onSubmit = (data: Module) => {
    const newModule: Module = {
      ...data,
      id: Number(data.id),
    };

    setModules([...modules, newModule]);
    setOpen(false);
    reset();
    // You can also POST newModule to your API here
  };

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Course Modules</h2>
        <Button onClick={() => setOpen(true)}>Add Module</Button>
      </div>

      {/* --- Table --- */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Lessons</TableHead>
              <TableHead>References</TableHead>
              <TableHead className="text-end">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.slice(0, 5).map((module) => (
              <TableRow key={module.id}>
                <TableCell>{module.title.slice(0, 20)}</TableCell>
                <TableCell>{module.description?.slice(0, 20)}</TableCell>
                <TableCell>
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id}>{lesson.title}</div>
                  ))}
                </TableCell>
                <TableCell>
                  {module.references?.map((ref, idx) => (
                    <div key={idx}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        {ref.title}
                      </a>
                    </div>
                  ))}
                </TableCell>
                <TableCell className="text-end">
                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="mt-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* --- Modal --- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Module</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Module ID & Title */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Module ID"
                {...register("id", { required: true })}
                className="border p-2 rounded w-1/3"
              />
              <input
                placeholder="Module Title"
                {...register("title", { required: true })}
                className="border p-2 rounded w-2/3"
              />
            </div>

            {/* Module Description */}
            <textarea
              placeholder="Module Description"
              {...register("description")}
              className="border p-2 rounded w-full"
            />

            {/* Lessons */}
            <div className="border p-2 rounded space-y-2">
              <h3 className="font-semibold">Lessons</h3>
              {lessonFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <input
                    placeholder="Lesson Title"
                    {...register(`lessons.${index}.title` as const)}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    placeholder="URL"
                    {...register(`lessons.${index}.videoId` as const)}
                    className="border p-2 rounded w-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeLesson(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  appendLesson({
                    id: "",
                    title: "",
                    videoId: "",
                  })
                }
              >
                Add Lesson
              </Button>
            </div>

            {/* References */}
            <div className="border p-2 rounded space-y-2">
              <h3 className="font-semibold">References</h3>
              {referenceFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <input
                    placeholder="Reference Title"
                    {...register(`references.${index}.title` as const)}
                    className="border p-2 rounded w-1/2"
                  />
                  <input
                    placeholder="URL"
                    {...register(`references.${index}.url` as const)}
                    className="border p-2 rounded w-1/2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeReference(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => appendReference({ title: "", url: "" })}
              >
                Add Reference
              </Button>
            </div>

            <DialogFooter className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Module</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
