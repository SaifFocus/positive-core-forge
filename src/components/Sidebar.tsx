import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Orbit, Calendar, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/arenas", label: "Arenas", icon: Orbit, exact: false },
  { to: "/calendar", label: "Calendar", icon: Calendar, exact: true },
  { to: "/analytics", label: "Analytics", icon: BarChart3, exact: true },
  { to: "/settings", label: "Settings", icon: Settings, exact: true },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-56 lg:w-60 shrink-0 flex-col border-r bg-sidebar">
      <div className="flex items-center gap-2 px-5 h-16 border-b">
        <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-arena-purple grid place-items-center">
          <Orbit size={18} className="text-primary-foreground" />
        </div>
        <span className="font-semibold tracking-tight text-lg">Orbit</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <it.icon size={16} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-xs text-muted-foreground border-t">
        v0.1 · 3 arenas active
      </div>
    </aside>
  );
}

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-sidebar border-t flex justify-around py-2">
      {items.map((it) => {
        const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
        return (
          <Link
            key={it.to}
            to={it.to}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px]",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <it.icon size={18} />
            <span>{it.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
