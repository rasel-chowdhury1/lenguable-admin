"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateResourceMutation,
  useUpdateResourceMutation,
} from "@/redux/features/resourceApi";

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

import { ResourceFormData, Resource } from "@/types";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  resource?: Resource | null;
};

const AddResourceModal = ({ open, onClose, resource }: Props) => {
  const { register, handleSubmit, reset, setValue } =
    useForm<ResourceFormData>();

  const [createResource] = useCreateResourceMutation();
  const [updateResource] = useUpdateResourceMutation();

  useEffect(() => {
    if (resource) {
      setValue("title", resource.title);
      setValue("url", resource.url);
      setValue("type", resource.type);
    }
  }, [resource, setValue]);

  const onSubmit = async (data: ResourceFormData) => {
    try {
      if (resource?._id) {
        const res = await updateResource({ id: resource._id, data }).unwrap();
        toast.success(res?.message || "Resource updated successfully !");
      } else {
        const res = await createResource(data).unwrap();
        toast.success(res?.message || "Resource created successfully !");
      }

      reset();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {resource ? "Edit Resource" : "Add Resource"}
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
            <Label className="mb-1 block text-sm font-medium">URL</Label>

            <Input
              {...register("url", { required: true })}
              placeholder="Resource URL"
            />
          </div>

          <div>
            <Label className="mb-1 block text-sm font-medium">Type</Label>

            <Select
              onValueChange={(val) => setValue("type", val)}
              defaultValue={resource?.type}
            >
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
              {resource ? "Update Resource" : "Create Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResourceModal;
