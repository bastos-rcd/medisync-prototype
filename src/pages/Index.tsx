import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { NotificationCard } from "@/components/NotificationCard";
import { mockEmployees, mockShifts, mockLeaves } from "@/data/mockData";
import { Users, UserCheck, Clock, CalendarOff } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Dashboard = () => {
  const activeEmployees = mockEmployees.filter(e => e.is_active);
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayShifts = mockShifts.filter(s => s.date_debut.startsWith(todayStr));
  const pendingLeaves = mockLeaves.filter(l => l.statut === "En_attente");
  const totalHoursThisWeek = mockShifts.reduce((sum, s) => sum + s.duree_heures, 0);

  return (
    <AppLayout title="Tableau de bord">
      {/* Mobile title */}
      <h1 className="md:hidden text-xl font-heading font-bold text-foreground mb-4">Tableau de bord</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Personnel présent" value={todayShifts.length} sublabel={`sur ${activeEmployees.length} employés`} variant="primary" />
        <StatCard icon={CalendarOff} label="Demandes en attente" value={pendingLeaves.length} sublabel="à traiter aujourd'hui" variant="warning" />
        <StatCard icon={UserCheck} label="Taux de couverture" value="75 %" sublabel="cette semaine" variant="success" />
        <StatCard icon={Clock} label="Heures supplémentaires" value={`${totalHoursThisWeek} h`} sublabel="cette semaine" variant="default" />
      </div>

      {/* Notifications */}
      <div className="space-y-2 mb-8">
        <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Notifications</h2>
        <NotificationCard type="warning" message="Heures supplémentaires" detail="Sophie dépasse le quota hebdomadaire" />
        <NotificationCard type="danger" message="Heures supplémentaires" detail="Sophie dépasse le quota hebdomadaire" />
        <NotificationCard type="success" message="Aucune heure supplémentaire" />
      </div>

      {/* Pending Leave Requests */}
      <div>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Demandes d'absence en attente</h2>
        <div className="space-y-3">
          {pendingLeaves.map(leave => {
            const emp = mockEmployees.find(e => e.id === leave.user_id);
            if (!emp) return null;
            return (
              <div key={leave.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {emp.prenom[0]}{emp.nom[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{emp.prenom} {emp.nom}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(leave.date_debut), "dd/MM/yyyy")} – {format(new Date(leave.date_fin), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-success text-success-bg text-xs font-semibold hover:opacity-90 transition-opacity">
                    Valider
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
                    Refuser
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
