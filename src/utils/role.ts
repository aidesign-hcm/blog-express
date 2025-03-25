type Role = "admin" | "editor" | "manager" | "user";

// Role hierarchy for permission checking
const roleHierarchy: Record<Role, Role[]> = {
  admin: ["admin", "editor", "manager", "user"],
  editor: ["editor", "user"],
  manager: ["manager","editor", "user"],
  user: ["user"],
};

// Function to validate if a string is a valid Role
export const isValidRole = (role: string): role is Role => {
  return ["admin", "editor", "manager", "user"].includes(role);
};

// Safe permission check with role validation
export const hasPermission = (userRole: string, requiredRole: Role) => {
  if (!isValidRole(userRole)) return false; // Ensure it's a valid role
  return roleHierarchy[userRole]?.includes(requiredRole) ?? false;
};
