/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, Eye, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Student } from "@/types";
import { DetailModal } from "./_components/DetailModal";
import { AddCreditsModal } from "./_components/AddCreditsModal";
import { RemoveCreditsModal } from "./_components/RemoveCreditsModal";
import { getInitials } from "@/utils";
import { Spinner } from "@/components/ui/spinner";
import {
  useGetStudentQuery,
  useDeleteStudentMutation,
} from "@/redux/features/studentApi";
import { toast } from "sonner";

const LEVEL_ORDER = ["A0", "A1", "A2", "B1", "B2", "C1"];

function getCurrentLevel(unlockedLessons: { level?: string }[] = []) {
  if (!unlockedLessons.length) return "A0";
  let highestIndex = 0;
  for (const lesson of unlockedLessons) {
    const idx = LEVEL_ORDER.indexOf(lesson.level || "A0");
    if (idx > highestIndex) highestIndex = idx;
  }
  return LEVEL_ORDER[highestIndex];
}

export default function StudentManagement() {
  const { data, isLoading } = useGetStudentQuery(undefined);
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [creditsStudent, setCreditsStudent] = useState<Student | null>(null);
  const [removeCreditsStudent, setRemoveCreditsStudent] =
    useState<Student | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [removeCreditsOpen, setRemoveCreditsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const students: Student[] = useMemo(() => {
    if (!data?.data) return [];
    const keyword = searchTerm.toLowerCase();
    return (data.data as Student[]).filter(
      (s) =>
        s.name?.toLowerCase().includes(keyword) ||
        s.email?.toLowerCase().includes(keyword),
    );
  }, [data, searchTerm]);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteStudent(deleteId).unwrap();
      toast.success("Student deleted successfully");
    } catch {
      toast.error("Failed to delete student");
    } finally {
      setDeleteId(null);
    }
  };

  function openDetail(student: Student): void {
    setSelectedStudent(student);
    setDetailOpen(true);
  }

  function openCredits(student: Student): void {
    setCreditsStudent(student);
    setCreditsOpen(true);
  }

  function openRemoveCredits(student: Student): void {
    setRemoveCreditsStudent(student);
    setRemoveCreditsOpen(true);
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-64">
        <Spinner className="size-8 text-primary" />
      </div>
    );

  return (
    <div className="w-[90%] mx-auto p-3 my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
        <div className="mb-4 w-96">
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>
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
            {students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle size={30} className="text-gray-400" />
                    <p>No students found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              students.map((s) => (
                <TableRow
                  key={s._id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                >
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

                  <TableCell className="py-4">
                    <Badge className="rounded-full border-0 font-semibold px-2.5 text-xs bg-[#A9F877] text-black">
                      {getCurrentLevel(s.unlockedLessons)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-gray-800 py-4">
                    {s.totalCompletedClasses}
                  </TableCell>

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
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => openRemoveCredits(s)}
                        disabled={s.credits === 0}
                      >
                        <Minus size={14} /> Remove Credits
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(s._id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
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
      <RemoveCreditsModal
        student={removeCreditsStudent}
        open={removeCreditsOpen}
        onClose={() => setRemoveCreditsOpen(false)}
      />

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot
              be undone and will also remove their user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
