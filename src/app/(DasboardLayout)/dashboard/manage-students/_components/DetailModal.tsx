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
import { Student } from "@/types";
import { getInitials } from "@/utils";
import { BookOpen, CalendarClock, Clock, CreditCard, ExternalLink } from "lucide-react";

const BOOKING_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_COLORS: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
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
  const timeStr = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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

export function DetailModal({
  student,
  open,
  onClose,
}: {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!student) return null;

  const sortedBookings = [...(student.booking ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const sortedPayments = [...(student.payment ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const totalSpent = student.payment
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Student Details
          </DialogTitle>
        </DialogHeader>

        {/* Avatar + name */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
            {getInitials(student.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 leading-tight truncate">
              {student.name}
            </p>
            <p className="text-sm text-gray-500 truncate">{student.email}</p>
            {student.user?.timezone && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {student.user.timezone}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground shrink-0">
            Joined {formatCreatedAt(student.createdAt)}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Credits</p>
            <p className="text-xl font-bold text-gray-900">{student.credits}</p>
          </div>
          <div className="border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Classes Done</p>
            <p className="text-xl font-bold text-gray-900">
              {student.totalCompletedClasses}
            </p>
          </div>
          <div className="border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Total Spent</p>
            <p className="text-xl font-bold text-gray-900">${totalSpent}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="mt-3">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="bookings" className="gap-1.5 text-xs">
              <CalendarClock size={12} /> Bookings ({student.booking?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-1.5 text-xs">
              <CreditCard size={12} /> Payments ({student.payment?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="lessons" className="gap-1.5 text-xs">
              <BookOpen size={12} /> Lessons ({student.unlockedLessons?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
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
                      {b.teacherId.name}
                    </p>
                    <Badge
                      className={`capitalize text-xs font-medium border-0 shrink-0 ${BOOKING_COLORS[b.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{b.teacherId.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(b.startTime)} — {formatDate(b.endTime)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> Booked {formatCreatedAt(b.createdAt)}
                  </p>
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

          {/* Payments Tab */}
          <TabsContent value="payments" className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
            {sortedPayments.length === 0 ? (
              <EmptyState message="No payments yet." />
            ) : (
              sortedPayments.map((p) => (
                <div
                  key={p._id}
                  className="border border-gray-100 rounded-lg px-3 py-2.5 bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-800">
                      {p.packageId.name}
                    </p>
                    <Badge
                      className={`capitalize text-xs font-medium border-0 shrink-0 ${PAYMENT_COLORS[p.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {p.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {p.packageId.credits} credits
                      {p.packageId.discount
                        ? ` · ${p.packageId.discount}% off`
                        : ""}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      ${p.amount}{" "}
                      <span className="text-xs font-normal text-muted-foreground uppercase">
                        {p.currency}
                      </span>
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    {p.paidAt
                      ? `Paid ${formatCreatedAt(p.paidAt)}`
                      : `Created ${formatCreatedAt(p.createdAt)}`}
                  </p>
                </div>
              ))
            )}
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
            {(student.unlockedLessons ?? []).length === 0 ? (
              <EmptyState message="No lessons unlocked yet." />
            ) : (
              [...(student.unlockedLessons ?? [])]
                .sort((a, b) => a.order - b.order)
                .map((l) => (
                  <div
                    key={l._id}
                    className="border border-gray-100 rounded-lg px-3 py-2.5 bg-gray-50 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {l.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Level: {l.level}
                      </p>
                    </div>
                    {l.exercises.length > 0 && (
                      <a
                        href={l.exercises[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline shrink-0"
                      >
                        <ExternalLink size={10} /> Practice
                      </a>
                    )}
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
}
