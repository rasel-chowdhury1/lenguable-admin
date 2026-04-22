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
import { useAddCreditsMutation } from "@/redux/features/studentApi";
import { toast } from "sonner";

type AddCreditsFormData = {
  credits: number;
};

export function AddCreditsModal({
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
    formState: { errors },
  } = useForm<AddCreditsFormData>();
  const [addCredits, { isLoading }] = useAddCreditsMutation();

  async function onSubmit(data: AddCreditsFormData) {
    try {
      await addCredits({
        studentId: student?._id,
        credits: Number(data.credits),
      }).unwrap();

      toast.success(
        `${data.credits} credits added to ${student?.name}. New total: ${
          (student?.credits ?? 0) + Number(data.credits)
        }`,
      );
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add credits");
    }
  }

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Add Credits
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500 -mt-2 mb-2">
          Add class credits to:{" "}
          <span className="font-medium text-gray-900">{student.name}</span>
        </p>

        {/* Current credits */}
        <div className="bg-gray-50 rounded-md px-4 py-2 text-sm text-gray-600">
          Current credits:{" "}
          <span className="font-semibold text-gray-900">
            {student.credits ?? 0}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-1 block text-sm font-medium">
              Number of Credits to Add
            </Label>
            <Input
              type="number"
              placeholder="Enter number of credits"
              min={1}
              {...register("credits", {
                required: "Credits are required",
                min: { value: 1, message: "Must be at least 1 credit" },
              })}
            />
            {errors.credits && (
              <p className="text-red-500 text-sm mt-1">
                {errors.credits.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
            >
              {isLoading ? "Adding..." : "Add Credits"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
