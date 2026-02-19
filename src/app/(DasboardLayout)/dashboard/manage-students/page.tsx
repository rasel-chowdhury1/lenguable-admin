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
import { Eye, Plus } from "lucide-react";

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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold">Student Management</h1>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Classes Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {students.map((s, i) => (
                  <TableRow key={i}>
                    {/* Student */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                          {getInitials(s.name)}
                        </div>
                        {s.name}
                      </div>
                    </TableCell>

                    <TableCell>{s.email}</TableCell>

                    {/* Credits */}
                    <TableCell>
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
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">
                        {s.level}
                      </Badge>
                    </TableCell>

                    <TableCell>{s.completed}</TableCell>

                    {/* Actions */}
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>

                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Credits
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
