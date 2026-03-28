export type ContractStatus = "Temps_Plein" | "Mi_Temps" | "Temps_Partiel";
export type ShiftType = "Jour" | "Nuit" | "Garde_WE" | "Astreinte";
export type AbsenceStatus = "En_attente" | "Validee" | "Refusee";

export interface Employee {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role_id: string;
  statut_contrat: ContractStatus;
  taux_temps_travail: number;
  solde_cp: number;
  date_embauche: string;
  is_superviseur: boolean;
  is_active: boolean;
}

export interface Shift {
  id: string;
  user_id: string;
  date_debut: string;
  date_fin: string;
  duree_heures: number;
  type_shift: ShiftType;
  service: string;
}

export interface Leave {
  id: string;
  user_id: string;
  type_absence_id: string;
  date_debut: string;
  date_fin: string;
  nombre_jours: number;
  motif: string;
  statut: AbsenceStatus;
}

export interface Role {
  id: string;
  nom: string;
  niveau_competence: string;
  est_requis: boolean;
}

export interface LeaveType {
  id: string;
  nom: string;
}
