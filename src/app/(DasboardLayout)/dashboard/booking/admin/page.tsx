"use client";

import { useState } from "react";
import { Eye, Trash2, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Spinner } from "@/components/ui/spinner";
import { Booking } from "@/types";
import {
  useGetAllBookingsQuery,
  useDeleteBookingMutation,
} from "@/redux/features/bookingApi";
import { toast } from "sonner";
import BookingDetailModal from "./_components/BookingDetailModal";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function ManageBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetAllBookingsQuery(undefined);
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
  const bookings: Booking[] = data?.data || [];

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.studentId.name.toLowerCase().includes(search.toLowerCase()) ||
      b.studentId.email.toLowerCase().includes(search.toLowerCase()) ||
      (b.teacherId?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (b.teacherId?.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBooking(deleteId).unwrap();
      toast.success("Booking deleted successfully.");
    } catch {
      toast.error("Failed to delete booking. Please try again.");
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
      <div className="flex items-center justify-center w-full h-64">
        <p className="text-sm text-destructive">
          Failed to load bookings. Please try again.
        </p>
      </div>
    );

  return (
    <div className="w-[90%] mx-auto p-3 my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} booking{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarClock size={16} />
          <span>All Sessions</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Input
          placeholder="Search by student or teacher name / email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-8">#</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-16 text-muted-foreground"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((booking, index) => (
                <TableRow key={booking._id}>
                  <TableCell className="text-muted-foreground text-sm">
                    {index + 1}
                  </TableCell>

                  {/* Student */}
                  <TableCell>
                    <p className="font-medium text-sm">
                      {booking.studentId.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.studentId.email}
                    </p>
                  </TableCell>

                  {/* Teacher */}
                  <TableCell>
                    <p className="font-medium text-sm">
                      {booking.teacherId ? booking.teacherId.name : "—"}
                    </p>
                    {booking.teacherId && (
                      <p className="text-xs text-muted-foreground">
                        {booking.teacherId.email}
                      </p>
                    )}
                  </TableCell>

                  {/* Times */}
                  <TableCell className="text-sm whitespace-nowrap">
                    {formatDateTime(booking.startTime)}
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {formatDateTime(booking.endTime)}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      className={`capitalize text-xs font-medium border-0 ${STATUS_COLORS[booking.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {booking.status}
                    </Badge>
                    {booking.status === "cancelled" &&
                      booking.cancellationReason && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          By {booking.cancelledBy} —{" "}
                          {booking.cancellationReason}
                        </p>
                      )}
                  </TableCell>

                  {/* Joined */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span
                        className={
                          booking.teacherJoined
                            ? "text-green-600 font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        Teacher: {booking.teacherJoined ? "Joined" : "—"}
                      </span>
                      <span
                        className={
                          booking.studentJoined
                            ? "text-green-600 font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        Student: {booking.studentJoined ? "Joined" : "—"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs gap-1"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Eye size={13} />
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(booking._id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The booking will be permanently
              removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
