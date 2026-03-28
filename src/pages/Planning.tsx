import { AppLayout } from "@/components/AppLayout";
import { useAppState } from "@/context/AppContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, differenceInHours, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShiftType } from "@/types/medisync";

const shiftColors: Record<string, { bg: string; text: string; dot: string }> = {
  Jour: { bg: "bg-shift-day-bg", text: "text-shift-day", dot: "bg-shift-day" },
  Nuit: { bg: "bg-shift-night-bg", text: "text-shift-night", dot: "bg-shift-night" },
  Garde_WE: { bg: "bg-shift-weekend-bg", text: "text-shift-weekend", dot: "bg-shift-weekend" },
  Astreinte: { bg: "bg-shift-astreinte-bg", text: "text-shift-astreinte", dot: "bg-shift-astreinte" },
};

const services = ["Urgences", "Bloc Opératoire", "Hospitalisation", "Consultation"];
const shiftTypes: ShiftType[] = ["Jour", "Nuit", "Garde_WE", "Astreinte"];

const Planning = () => {
  const { shifts, employees, addShift, deleteShift, getEmployee } = useAppState();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    type_shift: "Jour" as ShiftType,
    heure_debut: "07:00",
    heure_fin: "19:00",
    service: "Urgences",
  });
  const [filterService, setFilterService] = useState<string>("all");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = (getDay(monthStart) + 6) % 7;
  const activeEmployees = employees.filter(e => e.is_active);

  const getShiftsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return shifts.filter(s => {
      const matchDate = s.date_debut.startsWith(dateStr);
      const matchService = filterService === "all" || s.service === filterService;
      return matchDate && matchService;
    });
  };

  const handleCreateShift = () => {
    if (!formData.user_id || !selectedDate) return;
    const dateDebut = `${selectedDate}T${formData.heure_debut}:00`;
    const dateFin = formData.type_shift === "Nuit"
      ? `${format(new Date(new Date(selectedDate).getTime() + 86400000), "yyyy-MM-dd")}T${formData.heure_fin}:00`
      : `${selectedDate}T${formData.heure_fin}:00`;

    const duree = differenceInHours(parseISO(dateFin), parseISO(dateDebut));

    addShift({
      user_id: formData.user_id,
      date_debut: dateDebut,
      date_fin: dateFin,
      duree_heures: duree > 0 ? duree : 12,
      type_shift: formData.type_shift,
      service: formData.service,
    });

    setShowCreateForm(false);
    setFormData({ user_id: "", type_shift: "Jour", heure_debut: "07:00", heure_fin: "19:00", service: "Urgences" });
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setShowCreateForm(false);
  };

  return (
    <AppLayout title="Planning">
      <h1 className="md:hidden text-xl font-heading font-bold text-foreground mb-4">Planning</h1>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h2 className="text-lg font-heading font-semibold text-foreground capitalize min-w-[160px] text-center">
            {format(currentMonth, "MMMM yyyy", { locale: fr })}
          </h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={filterService}
            onChange={e => setFilterService(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
          >
            <option value="all">Tous les services</option>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
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

      {/* Selected day panel */}
      {selectedDate && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground">
              {format(new Date(selectedDate), "EEEE d MMMM yyyy", { locale: fr })}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Ajouter un shift
              </button>
              <button onClick={() => setSelectedDate(null)} className="p-1.5 rounded-lg hover:bg-muted">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Create shift form */}
          {showCreateForm && (
            <div className="bg-muted/30 rounded-lg p-4 mb-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <select value={formData.user_id} onChange={e => setFormData(p => ({ ...p, user_id: e.target.value }))} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
                  <option value="">Employé...</option>
                  {activeEmployees.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                </select>
                <select value={formData.type_shift} onChange={e => setFormData(p => ({ ...p, type_shift: e.target.value as ShiftType }))} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
                  {shiftTypes.map(t => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                </select>
                <input type="time" value={formData.heure_debut} onChange={e => setFormData(p => ({ ...p, heure_debut: e.target.value }))} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
                <input type="time" value={formData.heure_fin} onChange={e => setFormData(p => ({ ...p, heure_fin: e.target.value }))} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
                <select value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end mt-3">
                <button onClick={handleCreateShift} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                  Créer le shift
                </button>
              </div>
            </div>
          )}

          {/* Day shifts */}
          {(() => {
            const dayShifts = shifts.filter(s => s.date_debut.startsWith(selectedDate));
            if (dayShifts.length === 0) return <p className="text-sm text-muted-foreground">Aucun shift planifié</p>;
            return (
              <div className="space-y-2">
                {dayShifts.map(shift => {
                  const emp = getEmployee(shift.user_id);
                  const colors = shiftColors[shift.type_shift] || shiftColors.Jour;
                  return (
                    <div key={shift.id} className="flex items-center justify-between bg-background rounded-lg px-4 py-2.5 border border-border">
                      <div className="flex items-center gap-3">
                        <span className={cn("h-3 w-3 rounded-full shrink-0", colors.dot)} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{emp?.prenom} {emp?.nom}</p>
                          <p className="text-xs text-muted-foreground">
                            {shift.type_shift.replace("_", " ")} · {shift.service} · {shift.duree_heures}h
                          </p>
                        </div>
                      </div>
                      <button onClick={() => deleteShift(shift.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Calendar grid */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => (
            <div key={day} className="px-2 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: startPadding }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[100px] border-b border-r border-border bg-muted/30" />
          ))}

          {days.map(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            const dayShifts = getShiftsForDay(day);
            const isToday = dateStr === format(new Date(), "yyyy-MM-dd");
            const isWeekend = getDay(day) === 0 || getDay(day) === 6;
            const isSelected = selectedDate === dateStr;

            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDayClick(dateStr)}
                className={cn(
                  "min-h-[100px] border-b border-r border-border p-1.5 transition-colors cursor-pointer hover:bg-accent/30",
                  isWeekend && "bg-muted/20",
                  isSelected && "ring-2 ring-primary ring-inset bg-accent/20"
                )}
              >
                <span className={cn(
                  "inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-medium",
                  isToday ? "bg-primary text-primary-foreground font-bold" : "text-foreground"
                )}>
                  {format(day, "d")}
                </span>
                <div className="mt-1 space-y-1">
                  {dayShifts.slice(0, 3).map(shift => {
                    const emp = getEmployee(shift.user_id);
                    const colors = shiftColors[shift.type_shift] || shiftColors.Jour;
                    return (
                      <div key={shift.id} className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium truncate", colors.bg, colors.text)}>
                        {emp ? `${emp.prenom[0]}. ${emp.nom}` : "?"} · {shift.type_shift.replace("_", " ")}
                      </div>
                    );
                  })}
                  {dayShifts.length > 3 && (
                    <p className="text-[10px] text-muted-foreground px-1">+{dayShifts.length - 3} autres</p>
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
