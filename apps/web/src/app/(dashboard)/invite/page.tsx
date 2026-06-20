"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2Icon, UserPlusIcon, CheckCircle2Icon, CopyIcon } from "lucide-react";
import {
  inviteUserRequestSchema,
  type InviteUserRequest,
  UserRole,
} from "@govexa/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";
import api from "@/lib/api";

const ease = [0, 0, 0.2, 1] as const;

const INVITABLE_ROLES: { value: UserRole; label: string; description: string }[] = [
  {
    value: UserRole.SCHOOL_ADMIN,
    label: "School Admin",
    description: "Manages students, routes, buses, and staff for an institution",
  },
  {
    value: UserRole.TRANSPORT_MANAGER,
    label: "Transport Manager",
    description: "Monitors live operations, trips, and incidents",
  },
];

const SUPER_ADMIN_EXTRA_ROLES: { value: UserRole; label: string; description: string }[] = [
  {
    value: UserRole.SUPER_ADMIN,
    label: "Super Admin",
    description: "Full platform access — institution setup and global settings",
  },
];

interface InviteResult {
  userId: string;
  email: string;
  role: string;
  expiresAt: string;
}

export default function InvitePage() {
  const user = useAuthStore((s) => s.user);
  const [inviteResult, setInviteResult] = useState<InviteResult | null>(null);

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const availableRoles = isSuperAdmin
    ? [...SUPER_ADMIN_EXTRA_ROLES, ...INVITABLE_ROLES]
    : INVITABLE_ROLES;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteUserRequest>({
    resolver: zodResolver(inviteUserRequestSchema as any),
    defaultValues: { role: UserRole.SCHOOL_ADMIN },
  });

  async function onSubmit(data: InviteUserRequest) {
    try {
      const res = await api.post<InviteResult>("/auth/invite", data);
      setInviteResult(res.data);
      toast.success(`Invitation sent to ${data.email}`);
      reset();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? "Failed to send invitation. The email may already be registered.");
    }
  }

  function handleSendAnother() {
    setInviteResult(null);
  }

  if (inviteResult) {
    return (
      <div className="max-w-lg space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          <h1 className="text-2xl font-bold tracking-tight">Invite Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Send an invitation to grant platform access
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease }}
        >
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="size-5 text-emerald-600" />
                <CardTitle className="text-base text-emerald-800">Invitation sent</CardTitle>
              </div>
              <CardDescription className="text-emerald-700">
                An email has been dispatched to{" "}
                <span className="font-medium">{inviteResult.email}</span>. The link
                expires in 48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-white border border-emerald-200 p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Role assigned</p>
                <p className="text-sm font-medium">{inviteResult.role.replace("_", " ")}</p>
              </div>
              <div className="rounded-md bg-white border border-emerald-200 p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Expires</p>
                <p className="text-sm font-medium">
                  {new Date(inviteResult.expiresAt).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" className="w-full" onClick={handleSendAnother}>
                <UserPlusIcon className="mr-2 size-4" />
                Invite another user
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Invite Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Send an invitation to grant platform access. The recipient sets their own password.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlusIcon className="size-4" />
              New invitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@schoolname.edu"
                  autoComplete="off"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("role")}
                >
                  {availableRoles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-xs text-destructive">{errors.role.message}</p>
                )}
                <div className="rounded-md border border-dashed border-border bg-muted/30 p-3 space-y-2">
                  {availableRoles.map((r) => (
                    <div key={r.value} className="text-xs">
                      <span className="font-medium">{r.label}</span>
                      <span className="text-muted-foreground"> — {r.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Sending invitation…
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="mr-2 size-4" />
                    Send invitation
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease }}
      >
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CopyIcon className="size-3.5" />
              How invitations work
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1.5">
            <p>1. An email is sent to the address with a secure one-time link.</p>
            <p>2. The recipient clicks the link and sets their password.</p>
            <p>3. Their account is activated and they can sign in immediately.</p>
            <p>4. Links expire after 48 hours — resend if they miss it.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
