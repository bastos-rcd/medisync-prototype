import { AppLayout } from "@/components/AppLayout";
import { useAppState } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Search, Plus, X, Edit2 } from "lucide-react";
import { useState } from "react";
import { ContractStatus } from "@/types/medisync";

const emptyForm = {
  nom: "", prenom: "", email: "", role_id: "r1",
  statut_contrat: "Temps_Plein" as ContractStatus,
  taux_temps_travail: 1.0, solde_cp: 25,
  date_embauche: new Date().toISOString().split("T")[0],
  is_superviseur: false, is_active: true,
};

const Equipe = () => {
  const { employees, roles, addEmployee, updateEmployee, toggleEmployeeActive, getRole } = useAppState();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = employees.filter(e =>
    `${e.prenom} ${e.nom} ${e.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (!formData.nom || !formData.prenom || !formData.email) return;
    if (editingId) {
      updateEmployee(editingId, formData);
      setEditingId(null);
    } else {
      addEmployee(formData);
    }
    setShowForm(false);
    setFormData(emptyForm);
  };

  const startEdit = (emp: typeof employees[0]) => {
    setFormData({
      nom: emp.nom, prenom: emp.prenom, email: emp.email, role_id: emp.role_id,
      statut_contrat: emp.statut_contrat, taux_temps_travail: emp.taux_temps_travail,
      solde_cp: emp.solde_cp, date_embauche: emp.date_embauche,
      is_superviseur: emp.is_superviseur, is_active: emp.is_active,
    });
    setEditingId(emp.id);
    setShowForm(true);
  };

  return (
    <AppLayout title="Équipe">
      <h1 className="md:hidden text-xl font-heading font-bold text-foreground mb-4">Équipe</h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Rechercher un employé..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(emptyForm); }}
          className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-foreground">
              {editingId ? "Modifier l'employé" : "Nouvel employé"}
            </h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1 rounded hover:bg-muted">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Prénom</label>
              <input type="text" value={formData.prenom} onChange={e => setFormData(p => ({ ...p, prenom: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Nom</label>
              <input type="text" value={formData.nom} onChange={e => setFormData(p => ({ ...p, nom: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Rôle</label>
              <select value={formData.role_id} onChange={e => setFormData(p => ({ ...p, role_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
                {roles.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Contrat</label>
              <select value={formData.statut_contrat} onChange={e => setFormData(p => ({ ...p, statut_contrat: e.target.value as ContractStatus, taux_temps_travail: e.target.value === "Temps_Plein" ? 1.0 : e.target.value === "Mi_Temps" ? 0.5 : 0.8 }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
                <option value="Temps_Plein">Temps Plein</option>
                <option value="Mi_Temps">Mi-Temps</option>
                <option value="Temps_Partiel">Temps Partiel</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Solde CP</label>
              <input type="number" min={0} value={formData.solde_cp} onChange={e => setFormData(p => ({ ...p, solde_cp: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => { setShowForm(false); setEditingId(null); }}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">Annuler</button>
            <button onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
              {editingId ? "Sauvegarder" : "Ajouter"}
            </button>
          </div>
        </div>
      )}

      {/* Employee list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-7 gap-4 px-5 py-3 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-muted-foreground uppercase col-span-2">Employé</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase">Rôle</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase">Contrat</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase">Solde CP</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase">Statut</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase">Actions</span>
        </div>

        {filtered.map(emp => {
          const role = getRole(emp.role_id);
          return (
            <div key={emp.id} className="grid grid-cols-1 md:grid-cols-7 gap-2 md:gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-accent/20 transition-colors">
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
                  "px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors",
                  emp.is_active ? "bg-success-bg text-success-foreground hover:opacity-80" : "bg-muted text-muted-foreground hover:opacity-80"
                )} onClick={() => toggleEmployeeActive(emp.id)}>
                  {emp.is_active ? "Actif" : "Inactif"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(emp)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => toggleEmployeeActive(emp.id)} className={cn(
                  "px-2 py-1 rounded-lg text-xs font-medium transition-colors",
                  emp.is_active ? "hover:bg-destructive/10 text-destructive" : "hover:bg-success/10 text-success"
                )}>
                  {emp.is_active ? "Désactiver" : "Activer"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Equipe;
