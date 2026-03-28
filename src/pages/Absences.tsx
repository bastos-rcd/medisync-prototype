import { AppLayout } from "@/components/AppLayout";
import { useAppState } from "@/context/AppContext";
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
  const { leaves, employees, approveLeave, refuseLeave, addLeaveRequest, getEmployee, getLeaveType, leaveTypes } = useAppState();
  const [filter, setFilter] = useState<"all" | "En_attente" | "Validee" | "Refusee">("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    type_absence_id: "ta1",
    date_debut: "",
    date_fin: "",
    nombre_jours: 1,
    motif: "",
  });

  const filtered = filter === "all" ? leaves : leaves.filter(l => l.statut === filter);
  const activeEmployees = employees.filter(e => e.is_active);

  const handleSubmitLeave = () => {
    if (!formData.user_id || !formData.date_debut || !formData.date_fin) return;
    addLeaveRequest(formData);
    setShowForm(false);
    setFormData({ user_id: "", type_absence_id: "ta1", date_debut: "", date_fin: "", nombre_jours: 1, motif: "" });
  };

  return (
    <AppLayout title="Absences">
      <h1 className="md:hidden text-xl font-heading font-bold text-foreground mb-4">Absences</h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Filters */}
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
        <button
          onClick={() => setShowForm(!showForm)}
          className="ml-auto px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          + Nouvelle demande
        </button>
      </div>

      {/* New leave form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6 animate-fade-in">
          <h3 className="font-heading font-semibold text-foreground mb-4">Nouvelle demande d'absence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Employé</label>
              <select
                value={formData.user_id}
                onChange={e => setFormData(p => ({ ...p, user_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              >
                <option value="">Sélectionner...</option>
                {activeEmployees.map(e => (
                  <option key={e.id} value={e.id}>{e.prenom} {e.nom} (CP: {e.solde_cp}j)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Type</label>
              <select
                value={formData.type_absence_id}
                onChange={e => setFormData(p => ({ ...p, type_absence_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              >
                {leaveTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Date début</label>
              <input
                type="date"
                value={formData.date_debut}
                onChange={e => setFormData(p => ({ ...p, date_debut: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Date fin</label>
              <input
                type="date"
                value={formData.date_fin}
                onChange={e => setFormData(p => ({ ...p, date_fin: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Nombre de jours</label>
              <input
                type="number"
                min={1}
                value={formData.nombre_jours}
                onChange={e => setFormData(p => ({ ...p, nombre_jours: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Motif</label>
              <input
                type="text"
                placeholder="Ex: Vacances scolaires"
                value={formData.motif}
                onChange={e => setFormData(p => ({ ...p, motif: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">
              Annuler
            </button>
            <button onClick={handleSubmitLeave} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
              Envoyer la demande
            </button>
          </div>
        </div>
      )}

      {/* Leave list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-xl px-5 py-8 text-center">
            <p className="text-muted-foreground">Aucune absence dans cette catégorie</p>
          </div>
        )}
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
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(leave.date_debut), "dd/MM/yyyy")} – {format(new Date(leave.date_fin), "dd/MM/yyyy")}
                  </span>
                  <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", statusStyles[leave.statut])}>
                    {statusLabels[leave.statut]}
                  </span>
                </div>
                {leave.statut === "En_attente" && (
                  <div className="flex gap-2 ml-auto md:ml-0">
                    <button onClick={() => approveLeave(leave.id)} className="px-3 py-1.5 rounded-lg bg-success text-success-bg text-xs font-semibold hover:opacity-90 transition-opacity">
                      ✓ Valider
                    </button>
                    <button onClick={() => refuseLeave(leave.id)} className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
                      ✗ Refuser
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
