"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Booking } from "@/types";

interface Props {
  booking: Booking | null;
  onClose: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b last:border-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

export default function BookingDetailModal({ booking, onClose }: Props) {
  if (!booking) return null;

  const teacher = booking.teacherId;

  return (
    <Dialog open={!!booking} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="mt-2 divide-y">
          {/* Status */}
          <div className="flex justify-between items-center py-2.5 border-b">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge
              className={`capitalize text-xs font-medium border-0 ${STATUS_COLORS[booking.status] ?? "bg-gray-100 text-gray-600"}`}
            >
              {booking.status}
            </Badge>
          </div>

          {/* Participants */}
          <Row
            label="Student"
            value={
              <span>
                {booking.studentId.name}
                <br />
                <span className="text-xs text-muted-foreground font-normal">
                  {booking.studentId.email}
                </span>
              </span>
            }
          />
          <Row
            label="Teacher"
            value={
              teacher ? (
                <span>
                  {teacher.name}
                  <br />
                  <span className="text-xs text-muted-foreground font-normal">
                    {teacher.email}
                  </span>
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )
            }
          />

          {/* Times */}
          <Row label="Start Time" value={formatDateTime(booking.startTime)} />
          <Row label="End Time" value={formatDateTime(booking.endTime)} />

          {/* Attendance */}
          <Row
            label="Teacher Joined"
            value={
              booking.teacherJoined && booking.teacherFirstJoinedAt ? (
                <span className="text-green-600">
                  Yes — {formatDateTime(booking.teacherFirstJoinedAt)}
                </span>
              ) : (
                <span className="text-muted-foreground">No</span>
              )
            }
          />
          <Row
            label="Student Joined"
            value={
              booking.studentJoined && booking.studentFirstJoinedAt ? (
                <span className="text-green-600">
                  Yes — {formatDateTime(booking.studentFirstJoinedAt)}
                </span>
              ) : (
                <span className="text-muted-foreground">No</span>
              )
            }
          />

          {/* Cancellation */}
          {booking.status === "cancelled" && (
            <>
              <Row
                label="Cancelled By"
                value={
                  <span className="capitalize">
                    {booking.cancelledBy ?? "—"}
                  </span>
                }
              />
              <Row
                label="Reason"
                value={booking.cancellationReason ?? "—"}
              />
            </>
          )}

          {/* Reminders */}
          <Row
            label="24h Reminder"
            value={
              booking.reminder24hSent ? (
                <span className="text-green-600">Sent</span>
              ) : (
                <span className="text-muted-foreground">Not sent</span>
              )
            }
          />
          <Row
            label="2h Reminder"
            value={
              booking.reminder2hSent ? (
                <span className="text-green-600">Sent</span>
              ) : (
                <span className="text-muted-foreground">Not sent</span>
              )
            }
          />

          {/* Dates */}
          <Row label="Created At" value={formatDateTime(booking.createdAt)} />
        </div>

        {/* Meet Link */}
        <div className="mt-4">
          <Button className="w-full gap-2" asChild>
            <a
              href={booking.meetLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={14} />
              Open Google Meet
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
