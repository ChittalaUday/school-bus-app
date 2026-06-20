"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BusIcon, Loader2Icon, ShieldCheckIcon } from "lucide-react";
import {
  acceptInvitationRequestSchema,
  type AcceptInvitationRequest,
  type AuthResponse,
} from "@govexa/shared";
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

function AcceptForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const token = searchParams.get("token") ?? "";
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => {
    if (!token) setTokenMissing(true);
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInvitationRequest & { confirmPassword: string }>({
    resolver: zodResolver(
      acceptInvitationRequestSchema.extend({
        confirmPassword: acceptInvitationRequestSchema.shape.password,
      }).refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }) as any,
    ),
    defaultValues: { token },
  });

  async function onSubmit(data: AcceptInvitationRequest) {
    try {
      const res = await api.post<AuthResponse>("/auth/accept", {
        token: data.token,
        password: data.password,
      });
      const { user, accessToken, refreshToken } = res.data;
      login(user, accessToken, refreshToken);
      toast.success("Account created — welcome to Govexa!");
      router.push("/dashboard");
    } catch {
      toast.error("This invitation link is invalid or has expired.");
    }
  }

  if (tokenMissing) {
    return (
      <div className="w-full max-w-sm p-4 text-center space-y-3">
        <p className="text-sm font-medium text-destructive">
          No invitation token found. Check your email link and try again.
        </p>
      </div>
    );
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
            <div className="flex justify-center mb-1">
              <ShieldCheckIcon className="size-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Set your password</CardTitle>
            <CardDescription>
              You have been invited to Govexa. Create a password to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register("token")} />

              <motion.div className="space-y-2" {...fadeIn(0.18)}>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </motion.div>

              <motion.div className="space-y-2" {...fadeIn(0.24)}>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </motion.div>

              <motion.div {...fadeIn(0.3)}>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Activating account…
                    </>
                  ) : (
                    "Activate account"
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

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<Loader2Icon className="size-6 animate-spin text-muted-foreground" />}>
      <AcceptForm />
    </Suspense>
  );
}
