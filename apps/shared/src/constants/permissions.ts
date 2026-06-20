import { UserRole } from "./roles";

export const Permission = {
  MANAGE_USERS: "MANAGE_USERS",
  MANAGE_ROUTES: "MANAGE_ROUTES",
  VIEW_LIVE_OPS: "VIEW_LIVE_OPS",
  EXECUTE_TRIPS: "EXECUTE_TRIPS",
  VIEW_CHILD_STATUS: "VIEW_CHILD_STATUS",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

// Single source of truth for all route authorization — never hardcode role checks in handlers
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.MANAGE_ROUTES,
    Permission.VIEW_LIVE_OPS,
    Permission.EXECUTE_TRIPS,
    Permission.VIEW_CHILD_STATUS,
  ],
  [UserRole.SCHOOL_ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.MANAGE_ROUTES,
    Permission.VIEW_LIVE_OPS,
  ],
  [UserRole.TRANSPORT_MANAGER]: [
    Permission.MANAGE_ROUTES,
    Permission.VIEW_LIVE_OPS,
  ],
  [UserRole.DRIVER]: [
    Permission.EXECUTE_TRIPS,
    Permission.VIEW_LIVE_OPS,
  ],
  [UserRole.PARENT]: [
    Permission.VIEW_CHILD_STATUS,
  ],
};
