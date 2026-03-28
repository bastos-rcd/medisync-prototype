import { AppLayout } from "@/components/AppLayout";
import { mockEmployees, mockRoles } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

const Equipe = () => {
  const [search, setSearch] = useState("");
  const filtered = mockEmployees.filter(e =>
    `${e.prenom} ${e.nom} ${e.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const getRole = (id: string) => mockRoles.find(r => r.id === id);

  return (
    <AppLayout title="Équipe">
      <h1 className="md:hidden text-xl font-heading font-bold text-foreground mb-4">Équipe</h1>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un employé..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Employee list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-6 gap-4 px-5 py-3 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-muted-foreground uppercase col-span-2">Employé</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase">Rôle</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase">Contrat</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase">Solde CP</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase">Statut</span>
        </div>

        {filtered.map(emp => {
          const role = getRole(emp.role_id);
          return (
            <div key={emp.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-accent/20 transition-colors animate-fade-in">
              <div className="flex items-center gap-3 col-span-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                  {emp.prenom[0]}{emp.nom[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{emp.prenom} {emp.nom}</p>
                  <p className="text-xs text-muted-foreground">{emp.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-foreground">{role?.nom || "–"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-foreground">{emp.statut_contrat.replace("_", " ")}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-foreground">{emp.solde_cp} jours</span>
              </div>
              <div className="flex items-center">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold",
                  emp.is_active ? "bg-success-bg text-success-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {emp.is_active ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Equipe;
