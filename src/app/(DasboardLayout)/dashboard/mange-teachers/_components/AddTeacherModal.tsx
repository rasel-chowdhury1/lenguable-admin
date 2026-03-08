/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreateTeacherMutation } from "@/redux/features/userApi";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const teacherSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(30, { message: "Name cannot exceed 30 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

interface AddTeacherModalProps {
  open: boolean;
  onClose: () => void;
}

const AddTeacherModal = ({ open, onClose }: AddTeacherModalProps) => {
  const [createTeacher, { isLoading }] = useCreateTeacherMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await createTeacher(data).unwrap();
      toast.success(res?.data?.message || "Teacher created successfully!");
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Teacher</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label className="mb-1 block">Name</Label>
            <Input {...register("name")} placeholder="Name" />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label className="mb-1 block">Email</Label>
            <Input type="email" {...register("email")} placeholder="Email" />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label className="mb-1 block">Password</Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherModal;
