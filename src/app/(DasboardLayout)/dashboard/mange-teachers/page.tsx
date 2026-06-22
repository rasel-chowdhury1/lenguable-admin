"use client";

import { useState, useMemo } from "react";
import { Plus, Eye, AlertTriangle, Trash2 } from "lucide-react";

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

import AddTeacherModal from "./_components/AddTeacherModal";
import TeacherDetailModal from "./_components/TeacherDetailModal";

import { Teacher } from "@/types";
import { getInitials } from "@/utils";

import {
  useGetTeacherQuery,
  useDeleteTeacherMutation,
} from "@/redux/features/teacherApi";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function TeacherManagement() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useGetTeacherQuery(undefined);
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const teachers: Teacher[] = useMemo(() => {
    if (!data?.data) return [];
    const keyword = searchTerm.toLowerCase();
    return (data.data as Teacher[]).filter(
      (t) =>
        t.name.toLowerCase().includes(keyword) ||
        t.email.toLowerCase().includes(keyword),
    );
  }, [data, searchTerm]);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTeacher(deleteId).unwrap();
      toast.success("Teacher deleted successfully");
    } catch {
      toast.error("Failed to delete teacher");
    } finally {
      setDeleteId(null);
    }
  };

    if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-64">
        <Spinner className="size-8 text-primary" />
      </div>
    );
    
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load teachers</p>
    );

  return (
    <div className="w-[90%] mx-auto p-5 my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search teachers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 border px-3 py-2 rounded-md text-sm"
          />
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
          >
            <Plus size={15} /> Add Teacher
          </Button>
        </div>
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
                Total Classes
              </TableHead>
              <TableHead className="text-gray-500 text-sm">
                Total Paid
              </TableHead>
              <TableHead className="text-gray-500 text-sm">
                Pending Amount
              </TableHead>
              <TableHead className="text-gray-500 text-sm">Status</TableHead>
              <TableHead className="text-gray-500 text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle size={30} className="text-gray-400" />
                    <p>No teachers found</p>
                    <p>Please add a new teacher to get started.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((t: any) => (
                <TableRow
                  key={t._id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                >
                  <TableCell className="pl-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {getInitials(t.name)}
                      </div>
                      <span className="text-sm text-gray-900">{t.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-gray-600 py-4">
                    {t.email}
                  </TableCell>
                  <TableCell className="text-sm text-gray-800 py-4">
                    {t.totalClasses}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-gray-900 py-4">
                    ${t.totalPaidOut}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-orange-500 py-4">
                    ${t.unpaidEarnings}
                  </TableCell>

                  <TableCell className="py-4">
                    {t.status === "ACTIVE" ? (
                      <Badge className="bg-[#A9F877] text-black rounded-full border-0 px-3">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-600 rounded-full border-0 px-3 gap-1">
                        <AlertTriangle size={11} /> Warning
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setSelectedTeacher(t)}
                      >
                        <Eye size={14} /> View Details
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(t._id)}
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
      <TeacherDetailModal
        teacher={selectedTeacher}
        open={!!selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
      <AddTeacherModal open={addOpen} onClose={() => setAddOpen(false)} />

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this teacher? This action cannot
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
