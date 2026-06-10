/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Student } from "@/types";
import { useForm } from "react-hook-form";
import { useRemoveCreditsMutation } from "@/redux/features/studentApi";
import { toast } from "sonner";
import { MinusCircle, AlertTriangle } from "lucide-react";

type RemoveCreditsFormData = {
  credits: number;
};

export function RemoveCreditsModal({
  student,
  open,
  onClose,
}: {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RemoveCreditsFormData>();

  const [removeCredits, { isLoading }] = useRemoveCreditsMutation();

  const watchedCredits = Number(watch("credits") ?? 0);
  const currentCredits = student?.credits ?? 0;
  const willExceed = watchedCredits > currentCredits;
  const remaining = Math.max(0, currentCredits - watchedCredits);

  async function onSubmit(data: RemoveCreditsFormData) {
    try {
      await removeCredits({
        studentId: student?._id,
        credits: Number(data.credits),
      }).unwrap();

      toast.success(
        `${data.credits} credits removed from ${student?.name}. Remaining: ${remaining}`,
      );
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove credits");
    }
  }

  function handleClose() {
    reset();
    onClose();
  }

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
              <MinusCircle size={16} className="text-red-600" />
            </div>
            <DialogTitle className="text-base font-semibold text-gray-900">
              Remove Credits
            </DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-sm text-gray-500 -mt-1 mb-1">
          Remove class credits from:{" "}
          <span className="font-semibold text-gray-900">{student.name}</span>
        </p>

        {/* Credit summary */}
        <div className="grid grid-cols-2 gap-3 my-1">
          <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">Current Credits</p>
            <p className="text-2xl font-bold text-gray-900">{currentCredits}</p>
          </div>
          <div
            className={`rounded-lg px-4 py-3 text-center border transition-colors ${
              willExceed
                ? "bg-red-50 border-red-200"
                : watchedCredits > 0
                  ? "bg-orange-50 border-orange-200"
                  : "bg-gray-50 border-gray-100"
            }`}
          >
            <p className="text-xs text-gray-500 mb-0.5">After Removal</p>
            <p
              className={`text-2xl font-bold transition-colors ${
                willExceed
                  ? "text-red-500"
                  : watchedCredits > 0
                    ? "text-orange-600"
                    : "text-gray-900"
              }`}
            >
              {willExceed ? "–" : remaining}
            </p>
          </div>
        </div>

        {willExceed && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-700">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <span>
              Cannot remove more credits than the student currently has (
              {currentCredits}).
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-1">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700">
              Credits to Remove
            </Label>
            <Input
              type="number"
              placeholder="Enter number of credits"
              min={1}
              max={currentCredits}
              className="focus-visible:ring-red-400"
              {...register("credits", {
                required: "Credits are required",
                min: { value: 1, message: "Must be at least 1 credit" },
                max: {
                  value: currentCredits,
                  message: `Cannot exceed current balance of ${currentCredits}`,
                },
              })}
            />
            {errors.credits && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.credits.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-1 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || currentCredits === 0}
              className="bg-red-600 hover:bg-red-700 text-white gap-1.5"
            >
              <MinusCircle size={14} />
              {isLoading ? "Removing..." : "Remove Credits"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
