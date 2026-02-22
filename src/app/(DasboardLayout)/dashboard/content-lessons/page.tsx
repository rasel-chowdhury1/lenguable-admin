"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  FileText,
  Upload,
  Edit,
  Trash2,
} from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Resource = { id: number; title: string };
type Lesson = {
  id: number;
  title: string;
  level: string;
  resources: Resource[];
};

const initialLessonsData: Lesson[] = [
  {
    id: 1,
    title: "Greetings and Introductions",
    level: "A0",
    resources: [
      { id: 1, title: "Grammar PDF" },
      { id: 2, title: "Vocabulary Sheet" },
    ],
  },
  {
    id: 2,
    title: "Present Simple",
    level: "A1",
    resources: [{ id: 3, title: "Exercise File" }],
  },
  {
    id: 3,
    title: "Past Simple",
    level: "A2",
    resources: [
      { id: 4, title: "Grammar Notes" },
      { id: 5, title: "Exercises PDF" },
    ],
  },
  {
    id: 4,
    title: "Future Tense",
    level: "B1",
    resources: [{ id: 6, title: "Video Lesson" }],
  },
];

export default function ContentLessonsPage() {
  const [lessonsData, setLessonsData] = useState<Lesson[]>(initialLessonsData);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonLevel, setLessonLevel] = useState("");

  const toggleRow = (id: number) => setExpanded(expanded === id ? null : id);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      setLessonsData(lessonsData.filter((lesson) => lesson.id !== id));
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonLevel(lesson.level);
    setOpen(true);
  };

  const handleSaveLesson = () => {
    const newLesson: Lesson = {
      id: editingLesson ? editingLesson.id : Date.now(),
      title: lessonTitle || "New Lesson",
      level: lessonLevel || "A0",
      resources: [],
    };
    if (editingLesson) {
      setLessonsData(
        lessonsData.map((l) => (l.id === editingLesson.id ? newLesson : l)),
      );
    } else {
      setLessonsData([...lessonsData, newLesson]);
    }
    setEditingLesson(null);
    setLessonTitle("");
    setLessonLevel("");
    setOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Content & Lessons</h1>
        <Button
          onClick={() => {
            setEditingLesson(null);
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Lesson
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {lessonsData.map((lesson) => (
                <>
                  {/* Lesson Row */}
                  <TableRow key={lesson.id}>
                    <TableCell className="flex items-center gap-2">
                      <button onClick={() => toggleRow(lesson.id)}>
                        {expanded === lesson.id ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <FileText className="w-4 h-4 text-primary" />
                      {lesson.title}
                    </TableCell>
                    <TableCell>
                      <Badge>{lesson.level}</Badge>
                    </TableCell>
                    <TableCell>{lesson.resources.length} files</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(lesson)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(lesson.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Resources Row */}
                  {expanded === lesson.id &&
                    lesson.resources.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="flex items-center gap-2 text-sm bg-muted/40">
                          <Upload className="w-4 h-4 text-green-600" />
                          {r.title}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination>
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

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "Edit Lesson" : "Add Lesson"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Level */}
            <div>
              <p className="text-sm mb-1">Level</p>
              <Select value={lessonLevel} onValueChange={setLessonLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A0">A0</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <p className="text-sm mb-1">Title</p>
              <Input
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Lesson title"
              />
            </div>

            {/* Video */}
            <div>
              <p className="text-sm mb-1">Content (Video)</p>
              <Input type="file" accept="video/*" />
            </div>

            {/* Resources */}
            <div>
              <p className="text-sm mb-1">Resources</p>
              <Input type="file" multiple />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLesson}>Save Lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
