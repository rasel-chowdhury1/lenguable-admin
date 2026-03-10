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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResourceFormData } from "@/types";
import { useForm } from "react-hook-form";

const AddResourceModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { register, handleSubmit, reset, setValue } =
    useForm<ResourceFormData>();

  function onSubmit(data: ResourceFormData): void {
    console.log("New resource:", data);
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Add Resource
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500 -mt-3 mb-1">
          Add a new learning resource
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-1 block text-sm font-medium">Title</Label>
            <Input
              {...register("title", { required: true })}
              placeholder="Resource title"
            />
          </div>

          <div>
            <Label className="mb-1 block text-sm font-medium">Type</Label>
            <Select onValueChange={(val) => setValue("type", val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {["PDF", "Document", "Video", "Audio", "Link"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#A9F877] hover:bg-[#C1FF72] text-black"
            >
              Create Lesson
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddResourceModal;
