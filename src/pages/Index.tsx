import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { NotificationCard } from "@/components/NotificationCard";
import { useAppState } from "@/context/AppContext";
import { Users, UserCheck, Clock, CalendarOff } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { employees, shifts, leaves, approveLeave, refuseLeave, getEmployee, getRole } = useAppState();

  const activeEmployees = employees.filter(e => e.is_active);
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayShifts = shifts.filter(s => s.date_debut.startsWith(todayStr));
  const pendingLeaves = leaves.filter(l => l.statut === "En_attente");
  const totalHoursThisWeek = shifts.reduce((sum, s) => sum + s.duree_heures, 0);

  // Generate dynamic notifications based on actual data
  const notifications = [];
  
  // Check for part-time employees with too many hours
  const partTimeEmployees = employees.filter(e => e.statut_contrat !== "Temps_Plein" && e.is_active);
  partTimeEmployees.forEach(emp => {
    const empShifts = shifts.filter(s => s.user_id === emp.id);
    const totalHours = empShifts.reduce((sum, s) => sum + s.duree_heures, 0);
    const maxHours = emp.taux_temps_travail * 151; // 151h standard monthly
    if (totalHours > maxHours * 0.8) {
      notifications.push({
        type: "warning" as const,
        message: "Heures supplémentaires",
        detail: `${emp.prenom} ${emp.nom} dépasse le quota hebdomadaire`,
      });
    }
  });

  if (pendingLeaves.length > 0) {
    notifications.push({
      type: "info" as const,
      message: `${pendingLeaves.length} demande(s) d'absence en attente`,
      detail: "À traiter dès que possible",
    });
  }

  if (notifications.length === 0) {
    notifications.push({
      type: "success" as const,
      message: "Tout est en ordre",
      detail: "Aucune alerte en cours",
    });
  }

  return (
    <AppLayout title="Tableau de bord">
      <h1 className="md:hidden text-xl font-heading font-bold text-foreground mb-4">Tableau de bord</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Personnel présent" value={todayShifts.length} sublabel={`sur ${activeEmployees.length} employés`} variant="primary" />
        <StatCard icon={CalendarOff} label="Demandes en attente" value={pendingLeaves.length} sublabel="à traiter aujourd'hui" variant={pendingLeaves.length > 0 ? "warning" : "success"} />
        <StatCard icon={UserCheck} label="Effectif actif" value={activeEmployees.length} sublabel={`sur ${employees.length} total`} variant="success" />
        <StatCard icon={Clock} label="Heures planifiées" value={`${totalHoursThisWeek} h`} sublabel="ce mois" variant="default" />
      </div>

      {/* Notifications */}
      <div className="space-y-2 mb-8">
        <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Notifications</h2>
        {notifications.map((n, i) => (
          <NotificationCard key={i} type={n.type} message={n.message} detail={n.detail} />
        ))}
      </div>

      {/* Pending Leave Requests */}
      <div>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-3">
          Demandes d'absence en attente
          {pendingLeaves.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-warning text-warning-bg text-xs font-bold">
              {pendingLeaves.length}
            </span>
          )}
        </h2>
        {pendingLeaves.length === 0 ? (
          <div className="bg-card border border-border rounded-xl px-5 py-8 text-center">
            <p className="text-muted-foreground">Aucune demande en attente 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingLeaves.map(leave => {
              const emp = getEmployee(leave.user_id);
              if (!emp) return null;
              const role = getRole(emp.role_id);
              return (
                <div key={leave.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border rounded-xl px-5 py-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {emp.prenom[0]}{emp.nom[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{emp.prenom} {emp.nom}</p>
                      <p className="text-xs text-muted-foreground">{role?.nom} · {leave.nombre_jours} jours · {leave.motif}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(leave.date_debut), "dd/MM/yyyy")} – {format(new Date(leave.date_fin), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-auto sm:ml-0">
                    <button
                      onClick={() => approveLeave(leave.id)}
                      className="px-4 py-2 rounded-lg bg-success text-success-bg text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      ✓ Valider
                    </button>
                    <button
                      onClick={() => refuseLeave(leave.id)}
                      className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      ✗ Refuser
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
