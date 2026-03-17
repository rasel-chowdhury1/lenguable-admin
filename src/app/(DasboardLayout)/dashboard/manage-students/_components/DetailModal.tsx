import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Student } from "@/types";
import { getInitials } from "@/utils";

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
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Student Details
          </DialogTitle>
        </DialogHeader>

        {/* Avatar + name */}
        <div className="flex items-center gap-3 mt-1 mb-4">
          <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
            {getInitials(student.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">
              {student.name}
            </p>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Credits</p>
            <p className="text-2xl font-bold text-gray-900">
              {student.credits}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Level</p>
            <p className="text-2xl font-bold text-gray-900">{student.level}</p>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 mb-2">
          <p className="text-xs text-gray-400 mb-1">Classes Completed</p>
          <p className="text-2xl font-bold text-gray-900">
            {student.classesCompleted}
          </p>
        </div>

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
}
