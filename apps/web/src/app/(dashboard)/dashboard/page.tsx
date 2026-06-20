"use client";

import { motion } from "framer-motion";
import {
  BusIcon,
  GraduationCapIcon,
  MapIcon,
  RouteIcon,
  UsersIcon,
  Building2Icon,
  UserPlusIcon,
  AlertTriangleIcon,
  ActivityIcon,
  ShieldCheckIcon,
  ClockIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";
import { UserRole } from "@govexa/shared";

const ease = [0, 0, 0.2, 1] as const;

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
  description: string;
  accent?: string;
}

const SUPER_ADMIN_STATS: StatCard[] = [
  { label: "Total Schools", value: "—", icon: Building2Icon, description: "Onboarded to the platform" },
  { label: "Total Users", value: "—", icon: UsersIcon, description: "Across all institutions" },
  { label: "Pending Invitations", value: "—", icon: UserPlusIcon, description: "Awaiting account activation" },
  { label: "Active Routes", value: "—", icon: RouteIcon, description: "Platform-wide" },
  { label: "Active Trips Today", value: "—", icon: MapIcon, description: "Currently in progress" },
  { label: "Platform Uptime", value: "—", icon: ShieldCheckIcon, description: "Last 30 days" },
];

const SCHOOL_ADMIN_STATS: StatCard[] = [
  { label: "Students Enrolled", value: "—", icon: GraduationCapIcon, description: "In transportation this year" },
  { label: "Buses in Fleet", value: "—", icon: BusIcon, description: "Active vehicles" },
  { label: "Routes Configured", value: "—", icon: RouteIcon, description: "Morning + evening" },
  { label: "Drivers on Duty", value: "—", icon: UsersIcon, description: "Today" },
  { label: "Missed Pickups", value: "—", icon: AlertTriangleIcon, description: "Today", accent: "text-amber-600" },
  { label: "Active Incidents", value: "—", icon: AlertTriangleIcon, description: "Unresolved", accent: "text-destructive" },
];

const TRANSPORT_MANAGER_STATS: StatCard[] = [
  { label: "Active Trips", value: "—", icon: ActivityIcon, description: "Currently running" },
  { label: "Drivers On Duty", value: "—", icon: UsersIcon, description: "On active trips" },
  { label: "Delayed Routes", value: "—", icon: ClockIcon, description: "Running late", accent: "text-amber-600" },
  { label: "Missed Pickups", value: "—", icon: AlertTriangleIcon, description: "Today", accent: "text-amber-600" },
  { label: "Active Incidents", value: "—", icon: AlertTriangleIcon, description: "Unresolved", accent: "text-destructive" },
  { label: "On-Time Rate", value: "—", icon: TrendingUpIcon, description: "Last 7 days" },
];

const ROLE_STAT_MAP: Record<UserRole, StatCard[]> = {
  [UserRole.SUPER_ADMIN]: SUPER_ADMIN_STATS,
  [UserRole.SCHOOL_ADMIN]: SCHOOL_ADMIN_STATS,
  [UserRole.TRANSPORT_MANAGER]: TRANSPORT_MANAGER_STATS,
  [UserRole.DRIVER]: [],
  [UserRole.PARENT]: [],
};

const ROLE_HEADLINES: Record<UserRole, { title: string; subtitle: string }> = {
  [UserRole.SUPER_ADMIN]: {
    title: "Platform Overview",
    subtitle: "Monitor all institutions and platform activity",
  },
  [UserRole.SCHOOL_ADMIN]: {
    title: "School Transportation Overview",
    subtitle: "Today's fleet, students, and safety status",
  },
  [UserRole.TRANSPORT_MANAGER]: {
    title: "Live Operations Dashboard",
    subtitle: "Monitor active trips, drivers, and exceptions in real time",
  },
  [UserRole.DRIVER]: { title: "Dashboard", subtitle: "" },
  [UserRole.PARENT]: { title: "Dashboard", subtitle: "" },
};

const ROLE_QUICK_ACTIONS: Record<UserRole, { label: string; href: string }[]> = {
  [UserRole.SUPER_ADMIN]: [
    { label: "Invite a School Admin", href: "/invite" },
    { label: "View all schools", href: "/schools" },
  ],
  [UserRole.SCHOOL_ADMIN]: [
    { label: "Add a student", href: "/students/new" },
    { label: "Invite staff", href: "/invite" },
    { label: "Configure a route", href: "/routes/new" },
  ],
  [UserRole.TRANSPORT_MANAGER]: [
    { label: "View live map", href: "/live" },
    { label: "Review incidents", href: "/incidents" },
  ],
  [UserRole.DRIVER]: [],
  [UserRole.PARENT]: [],
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? UserRole.SCHOOL_ADMIN;

  const stats = ROLE_STAT_MAP[role] ?? [];
  const { title, subtitle } = ROLE_HEADLINES[role];
  const quickActions = ROLE_QUICK_ACTIONS[role] ?? [];
  const greeting = user?.email.split("@")[0] ?? "there";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
      >
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {greeting}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle || title}</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease }}
          >
            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon
                  className={`size-4 ${stat.accent ?? "text-muted-foreground"}`}
                />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.accent ?? ""}`}>
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {quickActions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4, ease }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {action.label}
                </a>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.4, ease }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity feed will appear here once trips are live.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
