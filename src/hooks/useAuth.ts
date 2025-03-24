
import { useAppContext } from "@/app/app-provider";
import { hasPermission, isValidRole } from "@/utils/role";

export const useAuth = () => {
  const { user } = useAppContext();
  return {
    user,
    isAuthenticated: !!user,
    hasPermission: (requiredRole: "admin" | "editor" | "manager" | "user") =>
      user && isValidRole(user.rule) ? hasPermission(user.rule, requiredRole) : false,
  };
};
