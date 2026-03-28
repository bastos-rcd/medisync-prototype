import { AppLayout } from "@/components/AppLayout";
import { mockShifts, mockEmployees, mockRoles } from "@/data/mockData";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const shiftColors: Record<string, { bg: string; text: string; dot: string }> = {
  Jour: { bg: "bg-shift-day-bg", text: "text-shift-day", dot: "bg-shift-day" },
  Nuit: { bg: "bg-shift-night-bg", text: "text-shift-night", dot: "bg-shift-night" },
  Garde_WE: { bg: "bg-shift-weekend-bg", text: "text-shift-weekend", dot: "bg-shift-weekend" },
  Astreinte: { bg: "bg-shift-astreinte-bg", text: "text-shift-astreinte", dot: "bg-shift-astreinte" },
};

const Planning = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startPadding = (getDay(monthStart) + 6) % 7; // Monday-based

  const getShiftsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return mockShifts.filter(s => s.date_debut.startsWith(dateStr));
  };

  const getEmployee = (id: string) => mockEmployees.find(e => e.id === id);

  return (
    <AppLayout title="Planning">
      <h1 className="md:hidden text-xl font-heading font-bold text-foreground mb-4">Planning</h1>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <h2 className="text-lg font-heading font-semibold text-foreground capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {Object.entries(shiftColors).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-2 text-xs">
            <span className={cn("h-3 w-3 rounded-full", colors.dot)} />
            <span className="text-muted-foreground">{type.replace("_", " ")}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => (
            <div key={day} className="px-2 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for padding */}
          {Array.from({ length: startPadding }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[100px] border-b border-r border-border bg-muted/30" />
          ))}

          {days.map(day => {
            const shifts = getShiftsForDay(day);
            const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            const isWeekend = getDay(day) === 0 || getDay(day) === 6;

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[100px] border-b border-r border-border p-1.5 transition-colors hover:bg-accent/30",
                  isWeekend && "bg-muted/20"
                )}
              >
                <span className={cn(
                  "inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-medium",
                  isToday ? "bg-primary text-primary-foreground font-bold" : "text-foreground"
                )}>
                  {format(day, "d")}
                </span>
                <div className="mt-1 space-y-1">
                  {shifts.slice(0, 3).map(shift => {
                    const emp = getEmployee(shift.user_id);
                    const colors = shiftColors[shift.type_shift] || shiftColors.Jour;
                    return (
                      <div key={shift.id} className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium truncate", colors.bg, colors.text)}>
                        {emp ? `${emp.prenom[0]}. ${emp.nom}` : "?"} · {shift.type_shift.replace("_", " ")}
                      </div>
                    );
                  })}
                  {shifts.length > 3 && (
                    <p className="text-[10px] text-muted-foreground px-1">+{shifts.length - 3} autres</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Planning;
