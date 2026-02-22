"use client";

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
import { Eye, Trash } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const students = [
  {
    name: "Maria Garcia",
    email: "maria@example.com",
    credits: 5,
    level: "A1",
    completed: 12,
  },
  {
    name: "Carlos Rodriguez",
    email: "carlos@example.com",
    credits: 10,
    level: "A2",
    completed: 24,
  },
  {
    name: "Ana Martinez",
    email: "ana@example.com",
    credits: 0,
    level: "B1",
    completed: 35,
  },
  {
    name: "Maria Garcia",
    email: "maria@example.com",
    credits: 5,
    level: "A1",
    completed: 12,
  },
  {
    name: "Carlos Rodriguez",
    email: "carlos@example.com",
    credits: 10,
    level: "A2",
    completed: 24,
  },
  {
    name: "Ana Martinez",
    email: "ana@example.com",
    credits: 0,
    level: "B1",
    completed: 35,
  },
  {
    name: "Maria Garcia",
    email: "maria@example.com",
    credits: 5,
    level: "A1",
    completed: 12,
  },
  {
    name: "Carlos Rodriguez",
    email: "carlos@example.com",
    credits: 10,
    level: "A2",
    completed: 24,
  },
  {
    name: "Ana Martinez",
    email: "ana@example.com",
    credits: 0,
    level: "B1",
    completed: 35,
  },
];

export default function ManageStudentsPage() {
  /* helper */
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }
  return (
    <div className="max-w-7xl mx-auto my-10">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-5">Student Management</h1>

      {/* Table */}
      <div className="border rounded-md overflow-x-auto mb-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">Photo</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Credits</TableHead>
              <TableHead className="text-center">Level</TableHead>
              <TableHead className="text-center">Completed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((s, i) => (
              <TableRow key={i}>
                {/* Student */}
                <TableCell className="text-start">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                    {getInitials(s.name)}
                  </div>
                </TableCell>
                <TableCell className="text-center"> {s.name}</TableCell>
                <TableCell className="text-center">{s.email}</TableCell>
                {/* Credits */}
                <TableCell className="text-center">
                  <Badge
                    className={
                      s.credits === 0
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }
                  >
                    {s.credits}
                  </Badge>
                </TableCell>

                {/* Level */}
                <TableCell className="text-center">
                  <Badge className="bg-green-100 text-green-700">
                    {s.level}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">{s.completed}</TableCell>

                {/* Actions */}
                <TableCell className="text-right">
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
    </div>
  );
}
