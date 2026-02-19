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
];

export default function ManageTeachersPage() {
  /* Helper */
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Teacher Management</h1>

        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Hours This Week</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {teachers.map((t, i) => (
                  <TableRow key={i}>
                    {/* Teacher */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                          {getInitials(t.name)}
                        </div>
                        {t.name}
                      </div>
                    </TableCell>

                    <TableCell>{t.email}</TableCell>
                    <TableCell>{t.hours}</TableCell>
                    <TableCell>{t.totalHours}</TableCell>
                    <TableCell className="font-medium">{t.totalPaid}</TableCell>

                    {/* Status */}
                    <TableCell>
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
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
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
