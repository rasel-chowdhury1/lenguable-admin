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
import { AddCreditsFormData, Student } from "@/types";
import { useForm } from "react-hook-form";

export function AddCreditsModal({
  student,
  open,
  onClose,
}: {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<AddCreditsFormData>();

  function onSubmit(data: AddCreditsFormData): void {
    console.log("Add credits:", data);
    reset();
    onClose();
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
          Add class credits to student account: {student.name}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-1 block text-sm font-medium">
              Number of Credits
            </Label>
            <Input
              type="number"
              placeholder="Enter number of credits"
              {...register("credits", { required: true, min: 1 })}
            />
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
            >
              Add Credits
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
