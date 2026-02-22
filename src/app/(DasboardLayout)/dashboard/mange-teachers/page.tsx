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
import { Edit, Eye, Plus, Trash } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import AddTeacherModal, { FormData } from "./_components/AddTeacherModal";

/* Dummy data */
const initialTeachers = [
  { name: "John Smith", email: "john@lenguable.com", status: "Active" },
  { name: "Sarah Johnson", email: "sarah@lenguable.com", status: "Active" },
  { name: "Michael Brown", email: "michael@lenguable.com", status: "Active" },
];

export default function ManageTeachersPage() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [selectedTeacher, setSelectedTeacher] = useState<FormData | null>(null);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  // Create or update teacher
  const handleSubmitTeacher = (data: FormData) => {
    if (modalMode === "create") {
      setTeachers([
        ...teachers,
        { name: data.name, email: data.email, status: "Active" },
      ]);
    } else if (modalMode === "edit" && selectedTeacher) {
      setTeachers(
        teachers.map((t) =>
          t.email === selectedTeacher.email
            ? { ...t, name: data.name, email: data.email }
            : t,
        ),
      );
    }
  };

  const handleView = (teacher: FormData) => {
    setSelectedTeacher(teacher);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (teacher: FormData) => {
    setSelectedTeacher(teacher);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = (teacher: FormData) => {
    if (confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      setTeachers(teachers.filter((t) => t.email !== teacher.email));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Teacher Management</h1>
        <Button
          onClick={() => {
            setModalMode("create");
            setSelectedTeacher(null);
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Teacher
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {teachers.map((t, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                        {getInitials(t.name)}
                      </div>
                      {t.name}
                    </div>
                  </TableCell>

                  <TableCell>{t.email}</TableCell>

                  <TableCell>
                    <Badge
                      className={
                        t.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {t.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {/* View */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                        onClick={() => handleView(t)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary"
                        onClick={() => handleEdit(t)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(t)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
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
      <AddTeacherModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmitTeacher}
        defaultValues={selectedTeacher || undefined}
        mode={modalMode}
      />
    </div>
  );
}
