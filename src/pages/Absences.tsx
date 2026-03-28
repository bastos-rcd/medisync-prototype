import { AppLayout } from "@/components/AppLayout";
import { mockLeaves, mockEmployees, mockLeaveTypes } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

const statusStyles = {
  En_attente: "bg-warning-bg text-warning-foreground",
  Validee: "bg-success-bg text-success-foreground",
  Refusee: "bg-alert-bg text-alert-foreground",
};

const statusLabels = {
  En_attente: "En attente",
  Validee: "Validée",
  Refusee: "Refusée",
};

const Absences = () => {
  const [filter, setFilter] = useState<"all" | "En_attente" | "Validee" | "Refusee">("all");

  const filtered = filter === "all" ? mockLeaves : mockLeaves.filter(l => l.statut === filter);
  const getEmployee = (id: string) => mockEmployees.find(e => e.id === id);
  const getLeaveType = (id: string) => mockLeaveTypes.find(t => t.id === id);

  return (
    <AppLayout title="Absences">
      <h1 className="md:hidden text-xl font-heading font-bold text-foreground mb-4">Absences</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {([["all", "Toutes"], ["En_attente", "En attente"], ["Validee", "Validées"], ["Refusee", "Refusées"]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              filter === val ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-accent"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Leave list */}
      <div className="space-y-3">
        {filtered.map(leave => {
          const emp = getEmployee(leave.user_id);
          const type = getLeaveType(leave.type_absence_id);
          if (!emp) return null;

          return (
            <div key={leave.id} className="bg-card border border-border rounded-xl px-5 py-4 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                    {emp.prenom[0]}{emp.nom[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{emp.prenom} {emp.nom}</p>
                    <p className="text-xs text-muted-foreground">{type?.nom || "Congé"} · {leave.nombre_jours} jours</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(leave.date_debut), "dd/MM/yyyy")} – {format(new Date(leave.date_fin), "dd/MM/yyyy")}
                  </span>
                  <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", statusStyles[leave.statut])}>
                    {statusLabels[leave.statut]}
                  </span>
                </div>
                {leave.statut === "En_attente" && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-success text-success-bg text-xs font-semibold hover:opacity-90 transition-opacity">
                      Valider
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
                      Refuser
                    </button>
                  </div>
                )}
              </div>
              {leave.motif && (
                <p className="text-xs text-muted-foreground mt-2 pl-[52px]">Motif : {leave.motif}</p>
              )}
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Absences;
