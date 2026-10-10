/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLoginMutation } from "@/redux/features/authApi";
import { Spinner } from "@/components/ui/spinner";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();

      if (res?.data?.user?.role && res.data.user.role !== "ADMIN") {
        toast.error("Access denied. You do not have permission to access the admin panel.");
        reset();
        return;
      }

      // Store tokens in cookies
      if (res?.data?.accessToken) {
        document.cookie = `accessToken=${res.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }
      if (res?.data?.refreshToken) {
        document.cookie = `refreshToken=${res.data.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }

      toast.success("Welcome back! You have successfully logged in.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed. Please check your credentials and try again.");
      reset();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Admin Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <Label className="mb-1 block">Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter Email"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label className="mb-1 block">Password</Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full bg-[#A9F877] hover:bg-[#C1FF72] text-black"
          >
            {isLoading ? <Spinner /> : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
