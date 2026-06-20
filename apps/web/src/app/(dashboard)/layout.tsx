"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bus, LayoutDashboard, LogOut, Map, Route, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/schools", icon: Users, label: "Schools" },
  { href: "/buses", icon: Bus, label: "Buses" },
  { href: "/routes", icon: Route, label: "Routes" },
  { href: "/trips", icon: Map, label: "Trips" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 flex flex-col border-r bg-sidebar">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <span className="font-bold text-sidebar-foreground">Govexa</span>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-foreground/60 mb-2 truncate">{user?.email}</p>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sidebar-foreground" onClick={handleLogout}>
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
