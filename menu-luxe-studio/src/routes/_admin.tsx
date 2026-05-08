import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-store";
import { useEffect } from "react";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const role = useAuth((s) => s.role);
  const setRole = useAuth((s) => s.setRole);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === null) {
      // Auto-login as super admin for demo if accessed directly
      setRole("super_admin");
      useAuth.setState({ userName: "Admin Lovable", userEmail: "admin@qrmenu.io" });
    } else if (role === "restaurant_admin") {
      navigate({ to: "/dashboard" });
    }
  }, [role, navigate, setRole]);

  return (
    <AppShell variant="admin">
      <Outlet />
    </AppShell>
  );
}
