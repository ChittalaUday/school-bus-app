"use client";

import { motion } from "framer-motion";
import { BusIcon, GraduationCapIcon, MapIcon, RouteIcon, TrendingUpIcon, UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";

const ease = [0, 0, 0.2, 1] as const;

const STATS = [
  { label: "Total Students", value: "—", icon: GraduationCapIcon, description: "Registered across all schools" },
  { label: "Active Buses", value: "—", icon: BusIcon, description: "In service today" },
  { label: "Ongoing Trips", value: "—", icon: MapIcon, description: "Currently in progress" },
  { label: "Registered Routes", value: "—", icon: RouteIcon, description: "Across all schools" },
  { label: "Schools", value: "—", icon: UsersIcon, description: "Onboarded to the platform" },
  { label: "On-Time Rate", value: "—", icon: TrendingUpIcon, description: "Last 7 days" },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
      >
        <h1 className="text-2xl font-bold tracking-tight">
          {user ? `Welcome, ${user.email.split("@")[0]}` : "Dashboard"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Govexa school bus operations overview
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease }}
          >
            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease }}
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
