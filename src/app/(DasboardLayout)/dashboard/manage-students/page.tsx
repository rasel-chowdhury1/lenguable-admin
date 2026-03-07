"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ── Types ─────────────────────────────────────────────────────────────────────
type Student = {
  name: string;
  email: string;
  credits: number;
  level: string;
  classesCompleted: number;
};

type AddCreditsFormData = {
  credits: number;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const initialStudents: Student[] = [
  {
    name: "Maria Garcia",
    email: "maria@example.com",
    credits: 5,
    level: "A1",
    classesCompleted: 12,
  },
  {
    name: "Carlos Rodriguez",
    email: "carlos@example.com",
    credits: 10,
    level: "A2",
    classesCompleted: 24,
  },
  {
    name: "Ana Martinez",
    email: "ana@example.com",
    credits: 0,
    level: "B1",
    classesCompleted: 35,
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

// ── Student Detail Modal ──────────────────────────────────────────────────────
function DetailModal({
  student,
  open,
  onClose,
}: {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!student) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Student Details
          </DialogTitle>
        </DialogHeader>

        {/* Avatar + name */}
        <div className="flex items-center gap-3 mt-1 mb-4">
          <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
            {getInitials(student.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">
              {student.name}
            </p>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Credits</p>
            <p className="text-2xl font-bold text-gray-900">
              {student.credits}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Level</p>
            <p className="text-2xl font-bold text-gray-900">{student.level}</p>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 mb-2">
          <p className="text-xs text-gray-400 mb-1">Classes Completed</p>
          <p className="text-2xl font-bold text-gray-900">
            {student.classesCompleted}
          </p>
        </div>

        <DialogFooter className="mt-2">
          <Button
            onClick={onClose}
            className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Add Credits Modal ─────────────────────────────────────────────────────────
function AddCreditsModal({
  student,
  open,
  onClose,
}: {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<AddCreditsFormData>();

  function onSubmit(data: AddCreditsFormData): void {
    console.log("Add credits:", data);
    reset();
    onClose();
  }

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Add Credits
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500 -mt-2 mb-2">
          Add class credits to student account: {student.name}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-1 block text-sm font-medium">
              Number of Credits
            </Label>
            <Input
              type="number"
              placeholder="Enter number of credits"
              {...register("credits", { required: true, min: 1 })}
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
              Add Credits
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentManagement() {
  const [students] = useState<Student[]>(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [creditsStudent, setCreditsStudent] = useState<Student | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [creditsOpen, setCreditsOpen] = useState<boolean>(false);

  function openDetail(student: Student): void {
    setSelectedStudent(student);
    setDetailOpen(true);
  }

  function openCredits(student: Student): void {
    setCreditsStudent(student);
    setCreditsOpen(true);
  }

  return (
    <div className="max-w-6xl mx-auto p-5 my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="text-gray-500 font-medium text-sm pl-5">
                Student
              </TableHead>
              <TableHead className="text-gray-500 font-medium text-sm">
                Email
              </TableHead>
              <TableHead className="text-gray-500 font-medium text-sm">
                Credits
              </TableHead>
              <TableHead className="text-gray-500 font-medium text-sm">
                Level
              </TableHead>
              <TableHead className="text-gray-500 font-medium text-sm">
                Classes Completed
              </TableHead>
              <TableHead className="text-gray-500 font-medium text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((s, i) => (
              <TableRow
                key={i}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
              >
                {/* Avatar + Name */}
                <TableCell className="pl-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                      {getInitials(s.name)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {s.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-sm text-gray-600 py-4">
                  {s.email}
                </TableCell>

                {/* Credits badge */}
                <TableCell className="py-4">
                  <Badge
                    className={`rounded-full border-0 font-semibold px-2.5 text-xs ${
                      s.credits === 0
                        ? "bg-red-600 text-white"
                        : "bg-[#C1FF72] text-black"
                    }`}
                  >
                    {s.credits}
                  </Badge>
                </TableCell>

                {/* Level badge */}
                <TableCell className="py-4">
                  <Badge className="rounded-full border-0 font-semibold px-2.5 text-xs bg-[#A9F877] text-black">
                    {s.level}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm text-gray-800 py-4">
                  {s.classesCompleted}
                </TableCell>

                {/* Actions */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => openDetail(s)}
                    >
                      <Eye size={14} /> View Details
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5 bg-[#A9F877] hover:bg-[#C1FF72] text-black"
                      onClick={() => openCredits(s)}
                    >
                      <Plus size={14} /> Add Credits
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <DetailModal
        student={selectedStudent}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
      <AddCreditsModal
        student={creditsStudent}
        open={creditsOpen}
        onClose={() => setCreditsOpen(false)}
      />
    </div>
  );
}
