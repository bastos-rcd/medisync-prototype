import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Users, CalendarOff, Settings, LogOut } from "lucide-react";
import logoDesktop from "@/assets/logo-desktop.webp";
import logoMobile from "@/assets/logo-mobile.webp";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/planning", icon: CalendarDays, label: "Planning" },
  { to: "/absences", icon: CalendarOff, label: "Absences" },
  { to: "/equipe", icon: Users, label: "Équipe" },
  { to: "/parametres", icon: Settings, label: "Paramètres" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <img src={logoMobile} alt="MediSync" className="h-10 w-auto" />
        <span className="font-heading font-bold text-lg text-sidebar-primary-foreground tracking-tight">
          medi<span className="text-sidebar-primary">sync</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-sidebar-primary")} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold">
            CM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">Claire Marie</p>
            <p className="text-xs text-sidebar-foreground truncate">Chef de Service</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
