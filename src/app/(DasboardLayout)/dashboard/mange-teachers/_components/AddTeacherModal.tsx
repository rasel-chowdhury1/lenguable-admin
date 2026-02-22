"use client";

import { useForm } from "react-hook-form";
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

export type FormData = {
  name: string;
  email: string;
  password?: string;
};

type Mode = "create" | "edit" | "view";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: FormData) => void;
  defaultValues?: FormData;
  mode?: Mode;
};

export default function AddTeacherModal({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode = "create",
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
  });

  function submit(data: FormData) {
    onSubmit(data);
    reset();
    onOpenChange(false);
  }

  const isView = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create Teacher"
              : mode === "edit"
                ? "Edit Teacher"
                : "View Teacher"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <Label className="mb-3">Name</Label>
            <Input
              placeholder="Teacher name"
              {...register("name", { required: "Name is required" })}
              disabled={isView}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-3">Email</Label>
            <Input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email",
                },
              })}
              disabled={isView}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-3">Password</Label>
            <Input
              type="password"
              placeholder={
                mode === "edit" ? "Leave blank to keep password" : "Password"
              }
              {...register("password", {
                required: mode === "create" ? "Password is required" : false,
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              disabled={isView}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {isView ? "Close" : "Cancel"}
            </Button>
            {!isView && (
              <Button type="submit">
                {mode === "create" ? "Create" : "Update"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
