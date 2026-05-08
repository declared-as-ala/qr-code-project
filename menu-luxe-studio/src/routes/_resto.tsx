import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/_resto")({
  component: RestoLayout,
});

function RestoLayout() {
  const role = useAuth((s) => s.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === null) {
      // demo auto-login
      useAuth.setState({
        role: "restaurant_admin",
        userName: "Karim Bennani",
        userEmail: "karim@elgrotte.ma",
        enseigneId: "ens_1",
      });
    } else if (role === "super_admin") {
      navigate({ to: "/admin" });
    }
  }, [role, navigate]);

  return (
    <AppShell variant="resto">
      <Outlet />
    </AppShell>
  );
}
