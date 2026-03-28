import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Users, CalendarOff, Settings, Menu, X } from "lucide-react";
import logoMobile from "@/assets/logo-mobile.webp";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/planning", icon: CalendarDays, label: "Planning" },
  { to: "/absences", icon: CalendarOff, label: "Absences" },
  { to: "/equipe", icon: Users, label: "Équipe" },
  { to: "/parametres", icon: Settings, label: "Paramètres" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <img src={logoMobile} alt="MediSync" className="h-8 w-auto" />
          <span className="font-heading font-bold text-base text-sidebar-primary-foreground">
            medi<span className="text-sidebar-primary">sync</span>
          </span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-sidebar-foreground p-1">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 top-[57px] z-50 bg-sidebar/95 backdrop-blur-sm animate-fade-in">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "text-sidebar-primary")} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
