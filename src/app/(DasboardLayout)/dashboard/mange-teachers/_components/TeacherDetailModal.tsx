"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Teacher } from "@/types";
import { getInitials } from "@/utils";
import {
  AlertTriangle,
  CalendarClock,
  Clock,
  ExternalLink,
  LayoutGrid,
  Star,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCreatedAt(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const toMidnight = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (toMidnight(now).getTime() - toMidnight(date).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const timeStr = formatTime(iso);
  const absolute = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  if (diffDays === 0) return `Today at ${timeStr}`;
  if (diffDays === 1) return `Yesterday at ${timeStr}`;
  if (diffDays < 7) return `${diffDays} days ago · ${absolute}`;
  return absolute;
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-center py-8 text-sm text-muted-foreground">{message}</p>
  );
}

const TeacherDetailModal = ({
  teacher,
  open,
  onClose,
}: {
  teacher: Teacher | null;
  open: boolean;
  onClose: () => void;
}) => {
  if (!teacher) return null;

  const sortedBookings = [...(teacher.bookings ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const totalSlots = teacher.availabilities.reduce(
    (sum, a) => sum + a.slots.length,
    0,
  );
  const bookedSlots = teacher.availabilities.reduce(
    (sum, a) => sum + a.slots.filter((s) => s.isBooked).length,
    0,
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Teacher Details
          </DialogTitle>
        </DialogHeader>

        {/* Avatar + name */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
            {getInitials(teacher.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 leading-tight truncate">
              {teacher.name}
            </p>
            <p className="text-sm text-gray-500 truncate">{teacher.email}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Joined {formatCreatedAt(teacher.createdAt)}
            </p>
          </div>
          <div className="shrink-0">
            {teacher.status === "ACTIVE" ? (
              <Badge className="bg-[#A9F877] text-black rounded-full border-0 px-3">
                Active
              </Badge>
            ) : (
              <Badge className="bg-red-600 text-white rounded-full border-0 px-3 gap-1">
                <AlertTriangle size={11} /> Warning
              </Badge>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Classes</p>
            <p className="text-xl font-bold text-gray-900">
              {teacher.totalClasses}
            </p>
          </div>
          <div className="border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Total Paid</p>
            <p className="text-xl font-bold text-gray-900">
              ${teacher.totalPaidOut}
            </p>
          </div>
          <div className="border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Pending</p>
            <p className="text-xl font-bold text-orange-500">
              ${teacher.unpaidEarnings}
            </p>
          </div>
        </div>

        {/* Warning alert */}
        {teacher.status === "WARNING" && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-3">
            <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-600">
                Warning: Multiple late cancellations
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                This teacher has {teacher.totalCanceledClasses} cancellations.
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mt-3">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview" className="gap-1.5 text-xs">
              <LayoutGrid size={12} /> Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-1.5 text-xs">
              <CalendarClock size={12} /> Bookings ({teacher.bookings?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="availability" className="gap-1.5 text-xs">
              <Clock size={12} /> Availability ({teacher.availabilities?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${teacher.totalEarnings}
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Cancellations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teacher.totalCanceledClasses}
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  Rating
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {teacher.averageRating > 0
                    ? teacher.averageRating.toFixed(1)
                    : "—"}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    ({teacher.totalReviews})
                  </span>
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Availability</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookedSlots}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    / {totalSlots} booked
                  </span>
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent
            value="bookings"
            className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1"
          >
            {sortedBookings.length === 0 ? (
              <EmptyState message="No bookings yet." />
            ) : (
              sortedBookings.map((b) => (
                <div
                  key={b._id}
                  className="border border-gray-100 rounded-lg px-3 py-2.5 bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {b.studentId.name}
                    </p>
                    <Badge
                      className={`capitalize text-xs font-medium border-0 shrink-0 ${STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{b.studentId.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDateTime(b.startTime)} — {formatDateTime(b.endTime)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> Booked {formatCreatedAt(b.createdAt)}
                  </p>

                  {/* Join status */}
                  <div className="flex gap-3 mt-1">
                    <span
                      className={`text-xs ${b.teacherJoined ? "text-green-600 font-medium" : "text-muted-foreground"}`}
                    >
                      Teacher:{" "}
                      {b.teacherJoined
                        ? `Joined ${formatTime(b.teacherFirstJoinedAt!)}`
                        : "Not joined"}
                    </span>
                    <span
                      className={`text-xs ${b.studentJoined ? "text-green-600 font-medium" : "text-muted-foreground"}`}
                    >
                      Student:{" "}
                      {b.studentJoined
                        ? `Joined ${formatTime(b.studentFirstJoinedAt!)}`
                        : "Not joined"}
                    </span>
                  </div>

                  {b.status === "cancelled" && b.cancellationReason && (
                    <p className="text-xs text-red-400 mt-0.5">
                      Cancelled by {b.cancelledBy}: {b.cancellationReason}
                    </p>
                  )}

                  <a
                    href={b.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mt-1"
                  >
                    <ExternalLink size={10} /> Join Meet
                  </a>
                </div>
              ))
            )}
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent
            value="availability"
            className="mt-3 space-y-3 max-h-72 overflow-y-auto pr-1"
          >
            {(teacher.availabilities ?? []).length === 0 ? (
              <EmptyState message="No availability set." />
            ) : (
              teacher.availabilities.map((avail) => (
                <div key={avail.date} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                    <p className="text-sm font-semibold text-gray-800">
                      {avail.day}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(avail.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3">
                    {avail.slots.map((slot) => (
                      <span
                        key={slot._id}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          slot.isBooked
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {formatTime(slot.startTime)} — {formatTime(slot.endTime)}
                        {slot.isBooked && " · Booked"}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
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
};

export default TeacherDetailModal;
