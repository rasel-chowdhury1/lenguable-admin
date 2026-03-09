import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Teacher } from "@/types";
import { getInitials } from "@/utils";
import { AlertTriangle } from "lucide-react";

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Teacher Details
          </DialogTitle>
        </DialogHeader>

        {/* Avatar + name */}
        <div className="flex items-center gap-3 mt-1 mb-3">
          <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
            {getInitials(teacher.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">
              {teacher.name}
            </p>
            <p className="text-sm text-gray-500">{teacher.email}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Hours This Week</p>
            <p className="text-2xl font-bold text-gray-900">
              {teacher.totalClasses}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total Hours</p>
            <p className="text-2xl font-bold text-gray-900">
              {teacher.totalClasses}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-gray-900">
              {teacher.totalEarnings}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Cancellations (24h)</p>
            <p className="text-2xl font-bold text-gray-900">
              {teacher.cancellationsWithin24Hours}
            </p>
          </div>
        </div>

        {/* Warning alert — only for Warning status */}
        {teacher.status === "WARNING" && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-1">
            <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-600">
                Warning: Multiple late cancellations
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                This teacher has {teacher.cancellationsWithin24Hours}{" "}
                cancellations within 24 hours.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="mt-2">
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
