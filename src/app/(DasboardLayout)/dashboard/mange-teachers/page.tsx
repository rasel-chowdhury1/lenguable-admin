"use client";
import { useState } from "react";
import { Plus, Eye, AlertTriangle } from "lucide-react";

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
import AddTeacherModal from "./_components/AddTeacherModal";
import { Teacher } from "@/types";
import { getInitials } from "@/utils";
import TeacherDetailModal from "./_components/TeacherDetailModal";


const initialTeachers: Teacher[] = [
  {
    name: "John Smith",
    email: "john@lenguable.com",
    hours: 8,
    totalHours: 67,
    totalPaid: "$670",
    status: "Active",
    cancellations: 0,
  },
  {
    name: "Sarah Johnson",
    email: "sarah@lenguable.com",
    hours: 12,
    totalHours: 94,
    totalPaid: "$940",
    status: "Active",
    cancellations: 1,
  },
  {
    name: "Michael Brown",
    email: "michael@lenguable.com",
    hours: 5,
    totalHours: 43,
    totalPaid: "$430",
    status: "Warning",
    cancellations: 2,
  },
];


export default function TeacherManagement() {
  const [teachers] = useState<Teacher[]>(initialTeachers);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [addOpen, setAddOpen] = useState<boolean>(false);

  return (
    <div className="max-w-6xl mx-auto p-5 my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
        >
          <Plus size={15} /> Add Teacher
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="text-gray-500 text-sm pl-5">
                Teacher
              </TableHead>
              <TableHead className="text-gray-500 text-sm">Email</TableHead>
              <TableHead className="text-gray-500 text-sm">
                Hours This Week
              </TableHead>
              <TableHead className="text-gray-500 text-sm">
                Total Hours
              </TableHead>
              <TableHead className="text-gray-500 text-sm">
                Total Paid
              </TableHead>
              <TableHead className="text-gray-500 text-sm">Status</TableHead>
              <TableHead className="text-gray-500 text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teachers.map((t, i) => (
              <TableRow
                key={i}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
              >
                {/* Avatar + Name */}
                <TableCell className="pl-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                      {getInitials(t.name)}
                    </div>
                    <span className="text-sm text-gray-900">{t.name}</span>
                  </div>
                </TableCell>

                <TableCell className="text-sm text-gray-600 py-4">
                  {t.email}
                </TableCell>
                <TableCell className="text-sm text-gray-800 py-4">
                  {t.hours}
                </TableCell>
                <TableCell className="text-sm text-gray-800 py-4">
                  {t.totalHours}
                </TableCell>
                <TableCell className="text-sm font-bold text-gray-900 py-4">
                  {t.totalPaid}
                </TableCell>

                {/* Status Badge */}
                <TableCell className="py-4">
                  {t.status === "Active" ? (
                    <Badge className="bg-[#A9F877] hover:bg-[#C1FF72] text-black rounded-full border-0 px-3">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-600 rounded-full border-0 px-3 gap-1">
                      <AlertTriangle size={11} /> Warning
                    </Badge>
                  )}
                </TableCell>

                {/* View Details */}
                <TableCell className="py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setSelectedTeacher(t)}
                  >
                    <Eye size={14} /> View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <TeacherDetailModal
        teacher={selectedTeacher}
        open={!!selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
      <AddTeacherModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
