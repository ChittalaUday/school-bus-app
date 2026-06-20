"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BusIcon, Loader2Icon } from "lucide-react";
import { loginRequestSchema, type LoginRequest, type AuthResponse } from "@govexa/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";
import api from "@/lib/api";

const ease = [0, 0, 0.2, 1] as const;

function fadeIn(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4, ease },
  };
}

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({ resolver: zodResolver(loginRequestSchema as any) });

  async function onSubmit(data: LoginRequest) {
    try {
      const res = await api.post<AuthResponse>("/auth/login", data);
      const { user, accessToken, refreshToken } = res.data;
      login(user, accessToken, refreshToken);
      toast.success(`Welcome back, ${user.email}`);
      router.push("/dashboard");
    } catch {
      toast.error("Invalid email or password. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6 p-4">
      <motion.div className="flex flex-col items-center gap-2" {...fadeIn(0)}>
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
          <BusIcon className="size-6" />
        </div>
        <p className="text-sm font-medium tracking-wide text-muted-foreground">GOVEXA</p>
      </motion.div>

      <motion.div {...fadeIn(0.1)}>
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>Enter your admin credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <motion.div className="space-y-2" {...fadeIn(0.18)}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@govexa.in"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </motion.div>

              <motion.div className="space-y-2" {...fadeIn(0.24)}>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </motion.div>

              <motion.div {...fadeIn(0.3)}>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
