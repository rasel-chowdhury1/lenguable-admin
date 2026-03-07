"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Eye, AlertTriangle } from "lucide-react";

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
type Teacher = {
  name: string;
  email: string;
  hours: number;
  totalHours: number;
  totalPaid: string;
  status: "Active" | "Warning";
  cancellations: number;
};

type AddTeacherFormData = {
  name: string;
  email: string;
  password: string;
};

// ── Data ──────────────────────────────────────────────────────────────────────
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({
  teacher,
  open,
  onClose,
}: {
  teacher: Teacher | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Teacher Details
          </DialogTitle>
        </DialogHeader>

        {/* Avatar + name */}
        <div className="flex items-center gap-3 mt-1 mb-3">
          <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
            {getInitials(teacher.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">
              {teacher.name}
            </p>
            <p className="text-sm text-gray-500">{teacher.email}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Hours This Week</p>
            <p className="text-2xl font-bold text-gray-900">{teacher.hours}</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total Hours</p>
            <p className="text-2xl font-bold text-gray-900">
              {teacher.totalHours}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-gray-900">
              {teacher.totalPaid}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Cancellations (24h)</p>
            <p className="text-2xl font-bold text-gray-900">
              {teacher.cancellations}
            </p>
          </div>
        </div>

        {/* Warning alert — only for Warning status */}
        {teacher.status === "Warning" && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-1">
            <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-600">
                Warning: Multiple late cancellations
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                This teacher has {teacher.cancellations} cancellations within 24
                hours.
              </p>
            </div>
          </div>
        )}

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

// ── Add Teacher Modal (unchanged) ─────────────────────────────────────────────
function AddTeacherModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<AddTeacherFormData>();

  function onSubmit(data: AddTeacherFormData): void {
    console.log(data);
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Teacher</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-1 block">Name</Label>
            <Input
              {...register("name", { required: true })}
              placeholder="Name"
            />
          </div>
          <div>
            <Label className="mb-1 block">Email</Label>
            <Input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
            />
          </div>
          <div>
            <Label className="mb-1 block">Password</Label>
            <Input
              type="password"
              {...register("password", { required: true })}
              placeholder="Password"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherManagement() {
  const [teachers] = useState<Teacher[]>(initialTeachers);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [addOpen, setAddOpen] = useState<boolean>(false);

  return (
    <div className="max-w-6xl mx-auto P-5 my-10">
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
      <DetailModal
        teacher={selectedTeacher}
        open={!!selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
      <AddTeacherModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
