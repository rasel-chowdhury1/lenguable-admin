"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Trash } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/* Dummy data */
const teachers = [
  {
    name: "John Smith",
    email: "john@lenguable.com",
    hours: 8,
    totalHours: 67,
    totalPaid: "$670",
    status: "Active",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@lenguable.com",
    hours: 12,
    totalHours: 94,
    totalPaid: "$940",
    status: "Active",
  },
  {
    name: "Michael Brown",
    email: "michael@lenguable.com",
    hours: 5,
    totalHours: 43,
    totalPaid: "$430",
    status: "Warning",
  },
  {
    name: "John Smith",
    email: "john@lenguable.com",
    hours: 8,
    totalHours: 67,
    totalPaid: "$670",
    status: "Active",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@lenguable.com",
    hours: 12,
    totalHours: 94,
    totalPaid: "$940",
    status: "Active",
  },
  {
    name: "Michael Brown",
    email: "michael@lenguable.com",
    hours: 5,
    totalHours: 43,
    totalPaid: "$430",
    status: "Warning",
  },
  {
    name: "John Smith",
    email: "john@lenguable.com",
    hours: 8,
    totalHours: 67,
    totalPaid: "$670",
    status: "Active",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@lenguable.com",
    hours: 12,
    totalHours: 94,
    totalPaid: "$940",
    status: "Active",
  },
  {
    name: "Michael Brown",
    email: "michael@lenguable.com",
    hours: 5,
    totalHours: 43,
    totalPaid: "$430",
    status: "Warning",
  },
];

/* Form type */
type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function ManageTeachersPage() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();

  function onSubmit(data: FormData) {
    console.log(data);
    reset();
    setOpen(false);
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }

  return (
    <div className="max-w-7xl mx-auto my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold">Teacher Management</h1>

        {/* Open modal */}
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Teacher
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">Photo</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Hours This Week</TableHead>
              <TableHead className="text-center">Total Hours</TableHead>
              <TableHead className="text-center">Total Paid</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teachers.map((t, i) => (
              <TableRow key={i}>
                {/* Photo */}
                <TableCell className="text-start">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                    {getInitials(t.name)}
                  </div>
                </TableCell>

                {/* Name */}
                <TableCell className="text-center">{t.name}</TableCell>

                {/* Email */}
                <TableCell className="text-center">{t.email}</TableCell>

                {/* Hours This Week */}
                <TableCell className="text-center">{t.hours}</TableCell>

                {/* Total Hours */}
                <TableCell className="text-center">{t.totalHours}</TableCell>

                {/* Total Paid */}
                <TableCell className="text-center font-medium">
                  {t.totalPaid}
                </TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  <Badge
                    className={
                      t.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }
                  >
                    {t.status}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-primary">
                    <Edit className="w-4 h-4" />
                  </Button>
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

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Teacher</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="mb-3">Name</Label>
              <Input
                {...register("name", { required: true })}
                placeholder="Name"
              />
            </div>

            <div>
              <Label className="mb-3">Email</Label>
              <Input
                type="email"
                {...register("email", { required: true })}
                placeholder="Email"
              />
            </div>

            <div>
              <Label className="mb-3">Password</Label>
              <Input
                type="password"
                {...register("password", { required: true })}
                placeholder="Password"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
