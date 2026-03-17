/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { Eye, Plus } from "lucide-react";
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
import { Student } from "@/types";
import { DetailModal } from "./_components/DetailModal";
import { AddCreditsModal } from "./_components/AddCreditsModal";
import { getInitials } from "@/utils";
import { useGetStudentQuery } from "@/redux/features/studentApi";

// Helper: get current level based on unlockedLessons
const getCurrentLevel = (unlockedCount: number) => {
  if (unlockedCount === 1) return "A0";
  if (unlockedCount === 2) return "A1";
  if (unlockedCount === 3) return "A2";
  if (unlockedCount === 4) return "B1";
  if (unlockedCount === 5) return "B2";
  if (unlockedCount === 6) return "C1";
  return "A0";
};

//  Helper: count completed classes based on bookings
const getCompletedClasses = (bookings: Student["booking"] = []) => {
  const now = new Date();
  return bookings.filter(
    (b) => new Date(b.date) < now && b.status !== "cancelled",
  ).length;
};

export default function StudentManagement() {
  const { data, isLoading } = useGetStudentQuery(undefined);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [creditsStudent, setCreditsStudent] = useState<Student | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);

  const student = data?.data || [];
  console.log(student, "from student management ==>");
  // Process API data for table
  const students: Student[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((s: any) => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      credits: s.credits,
      level: getCurrentLevel(s.unlockedLessons?.length || 0),
      classesCompleted: getCompletedClasses(s.booking || []),
      aboutMe: s.aboutMe,
      unlockedLessons: s.unlockedLessons || [],
      booking: s.booking || [],
      packages: s.packages || [],
      interests: s.interests || [],
    }));
  }, [data]);

  function openDetail(student: Student): void {
    setSelectedStudent(student);
    setDetailOpen(true);
  }

  function openCredits(student: Student): void {
    setCreditsStudent(student);
    setCreditsOpen(true);
  }

  if (isLoading) return <p>Loading students...</p>;

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
            {students.map((s) => (
              <TableRow
                key={s._id}
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

                {/* Credits */}
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

                {/* Level */}
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
