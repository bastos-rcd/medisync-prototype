import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Employee, Shift, Leave, Role, AbsenceStatus } from "@/types/medisync";
import { mockEmployees, mockShifts, mockLeaves, mockRoles, mockLeaveTypes } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface AppState {
  employees: Employee[];
  shifts: Shift[];
  leaves: Leave[];
  roles: Role[];
  leaveTypes: typeof mockLeaveTypes;
  // Actions
  approveLeave: (leaveId: string) => void;
  refuseLeave: (leaveId: string) => void;
  addShift: (shift: Omit<Shift, "id">) => void;
  deleteShift: (shiftId: string) => void;
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  toggleEmployeeActive: (id: string) => void;
  addLeaveRequest: (leave: Omit<Leave, "id" | "statut">) => void;
  getEmployee: (id: string) => Employee | undefined;
  getRole: (id: string) => Role | undefined;
  getLeaveType: (id: string) => { id: string; nom: string } | undefined;
}

const AppContext = createContext<AppState | null>(null);

let nextId = 100;
const genId = () => `gen-${nextId++}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [leaves, setLeaves] = useState<Leave[]>(mockLeaves);
  const [roles] = useState<Role[]>(mockRoles);
  const [leaveTypes] = useState(mockLeaveTypes);

  const getEmployee = useCallback((id: string) => employees.find(e => e.id === id), [employees]);
  const getRole = useCallback((id: string) => roles.find(r => r.id === id), [roles]);
  const getLeaveType = useCallback((id: string) => leaveTypes.find(t => t.id === id), [leaveTypes]);

  const approveLeave = useCallback((leaveId: string) => {
    setLeaves(prev => prev.map(l => {
      if (l.id !== leaveId) return l;
      // Decrement CP balance
      setEmployees(emps => emps.map(e =>
        e.id === l.user_id ? { ...e, solde_cp: Math.max(0, e.solde_cp - l.nombre_jours) } : e
      ));
      return { ...l, statut: "Validee" as AbsenceStatus };
    }));
    toast({ title: "✅ Absence validée", description: "Le solde de congés a été mis à jour." });
  }, []);

  const refuseLeave = useCallback((leaveId: string) => {
    setLeaves(prev => prev.map(l =>
      l.id === leaveId ? { ...l, statut: "Refusee" as AbsenceStatus } : l
    ));
    toast({ title: "❌ Absence refusée", description: "L'employé sera notifié." });
  }, []);

  const addShift = useCallback((shift: Omit<Shift, "id">) => {
    const newShift = { ...shift, id: genId() };
    setShifts(prev => [...prev, newShift]);
    const emp = employees.find(e => e.id === shift.user_id);
    toast({ title: "📅 Shift créé", description: `${emp?.prenom} ${emp?.nom} – ${shift.type_shift}` });
  }, [employees]);

  const deleteShift = useCallback((shiftId: string) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId));
    toast({ title: "🗑️ Shift supprimé" });
  }, []);

  const addEmployee = useCallback((employee: Omit<Employee, "id">) => {
    setEmployees(prev => [...prev, { ...employee, id: genId() }]);
    toast({ title: "👤 Employé ajouté", description: `${employee.prenom} ${employee.nom}` });
  }, []);

  const updateEmployee = useCallback((id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    toast({ title: "✏️ Employé mis à jour" });
  }, []);

  const toggleEmployeeActive = useCallback((id: string) => {
    setEmployees(prev => prev.map(e => {
      if (e.id !== id) return e;
      const newActive = !e.is_active;
      toast({ title: newActive ? "✅ Employé activé" : "⏸️ Employé désactivé" });
      return { ...e, is_active: newActive };
    }));
  }, []);

  const addLeaveRequest = useCallback((leave: Omit<Leave, "id" | "statut">) => {
    setLeaves(prev => [...prev, { ...leave, id: genId(), statut: "En_attente" }]);
    toast({ title: "📨 Demande envoyée", description: "La demande est en attente de validation." });
  }, []);

  return (
    <AppContext.Provider value={{
      employees, shifts, leaves, roles, leaveTypes,
      approveLeave, refuseLeave, addShift, deleteShift,
      addEmployee, updateEmployee, toggleEmployeeActive, addLeaveRequest,
      getEmployee, getRole, getLeaveType,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}
