"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bus,
  LayoutDashboard,
  LogOut,
  Map,
  Route,
  Users,
  UserPlus,
  AlertTriangle,
  GraduationCap,
  Building2,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { UserRole } from "@govexa/shared";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TRANSPORT_MANAGER],
  },
  {
    href: "/schools",
    icon: Building2,
    label: "Schools",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    href: "/invite",
    icon: UserPlus,
    label: "Invite Users",
    roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN],
  },
  {
    href: "/students",
    icon: GraduationCap,
    label: "Students",
    roles: [UserRole.SCHOOL_ADMIN],
  },
  {
    href: "/drivers",
    icon: Users,
    label: "Drivers",
    roles: [UserRole.SCHOOL_ADMIN, UserRole.TRANSPORT_MANAGER],
  },
  {
    href: "/buses",
    icon: Bus,
    label: "Buses",
    roles: [UserRole.SCHOOL_ADMIN],
  },
  {
    href: "/routes",
    icon: Route,
    label: "Routes",
    roles: [UserRole.SCHOOL_ADMIN, UserRole.TRANSPORT_MANAGER],
  },
  {
    href: "/trips",
    icon: Map,
    label: "Trips",
    roles: [UserRole.SCHOOL_ADMIN, UserRole.TRANSPORT_MANAGER],
  },
  {
    href: "/live",
    icon: Activity,
    label: "Live Operations",
    roles: [UserRole.SCHOOL_ADMIN, UserRole.TRANSPORT_MANAGER],
  },
  {
    href: "/incidents",
    icon: AlertTriangle,
    label: "Incidents",
    roles: [UserRole.SCHOOL_ADMIN, UserRole.TRANSPORT_MANAGER],
  },
];

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "Super Admin",
  [UserRole.SCHOOL_ADMIN]: "School Admin",
  [UserRole.TRANSPORT_MANAGER]: "Transport Manager",
  [UserRole.DRIVER]: "Driver",
  [UserRole.PARENT]: "Parent",
};

const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "bg-violet-100 text-violet-700",
  [UserRole.SCHOOL_ADMIN]: "bg-blue-100 text-blue-700",
  [UserRole.TRANSPORT_MANAGER]: "bg-emerald-100 text-emerald-700",
  [UserRole.DRIVER]: "bg-amber-100 text-amber-700",
  [UserRole.PARENT]: "bg-rose-100 text-rose-700",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const role = user?.role as UserRole | undefined;

  const visibleNav = role
    ? NAV_ITEMS.filter((item) => item.roles.includes(role))
    : [];

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 flex flex-col border-r bg-sidebar">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4 gap-2">
          <Bus className="size-5 text-primary" />
          <span className="font-bold text-sidebar-foreground">Govexa</span>
        </div>

        <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
          {visibleNav.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4 space-y-3">
          {role && (
            <span
              className={cn(
                "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                ROLE_COLORS[role],
              )}
            >
              {ROLE_LABELS[role]}
            </span>
          )}
          <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
