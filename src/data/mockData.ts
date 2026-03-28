import { Employee, Shift, Leave, Role, LeaveType, ShiftType, AbsenceStatus, ContractStatus } from "@/types/medisync";
import { addDays, startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";

export const mockRoles: Role[] = [
  { id: "r1", nom: "Infirmier(ère)", niveau_competence: "Senior", est_requis: true },
  { id: "r2", nom: "Médecin", niveau_competence: "Senior", est_requis: true },
  { id: "r3", nom: "Aide-soignant(e)", niveau_competence: "Niveau 1", est_requis: true },
  { id: "r4", nom: "ASH", niveau_competence: "Niveau 1", est_requis: false },
  { id: "r5", nom: "Vétérinaire", niveau_competence: "Senior", est_requis: true },
];

export const mockEmployees: Employee[] = [
  { id: "e1", nom: "Marie", prenom: "Claire", email: "claire.marie@medisync.fr", role_id: "r1", statut_contrat: "Temps_Plein", taux_temps_travail: 1.0, solde_cp: 25, date_embauche: "2022-03-15", is_superviseur: true, is_active: true },
  { id: "e2", nom: "Dupont", prenom: "Thomas", email: "thomas.dupont@medisync.fr", role_id: "r2", statut_contrat: "Temps_Plein", taux_temps_travail: 1.0, solde_cp: 22, date_embauche: "2021-06-01", is_superviseur: false, is_active: true },
  { id: "e3", nom: "Bernard", prenom: "Sophie", email: "sophie.bernard@medisync.fr", role_id: "r1", statut_contrat: "Mi_Temps", taux_temps_travail: 0.5, solde_cp: 12, date_embauche: "2023-01-10", is_superviseur: false, is_active: true },
  { id: "e4", nom: "Petit", prenom: "Lucas", email: "lucas.petit@medisync.fr", role_id: "r3", statut_contrat: "Temps_Plein", taux_temps_travail: 1.0, solde_cp: 18, date_embauche: "2020-09-01", is_superviseur: false, is_active: true },
  { id: "e5", nom: "Roux", prenom: "Emma", email: "emma.roux@medisync.fr", role_id: "r3", statut_contrat: "Temps_Partiel", taux_temps_travail: 0.8, solde_cp: 20, date_embauche: "2022-11-20", is_superviseur: false, is_active: true },
  { id: "e6", nom: "Moreau", prenom: "Julie", email: "julie.moreau@medisync.fr", role_id: "r4", statut_contrat: "Temps_Plein", taux_temps_travail: 1.0, solde_cp: 15, date_embauche: "2024-01-15", is_superviseur: false, is_active: true },
  { id: "e7", nom: "Laurent", prenom: "Pierre", email: "pierre.laurent@medisync.fr", role_id: "r2", statut_contrat: "Temps_Plein", taux_temps_travail: 1.0, solde_cp: 28, date_embauche: "2019-04-01", is_superviseur: false, is_active: true },
  { id: "e8", nom: "Simon", prenom: "Léa", email: "lea.simon@medisync.fr", role_id: "r1", statut_contrat: "Temps_Plein", taux_temps_travail: 1.0, solde_cp: 20, date_embauche: "2023-06-15", is_superviseur: false, is_active: false },
];

const today = new Date();
const monthStart = startOfMonth(today);

export const mockShifts: Shift[] = [
  { id: "s1", user_id: "e1", date_debut: format(addDays(monthStart, 0), "yyyy-MM-dd") + "T07:00:00", date_fin: format(addDays(monthStart, 0), "yyyy-MM-dd") + "T19:00:00", duree_heures: 12, type_shift: "Jour", service: "Urgences" },
  { id: "s2", user_id: "e2", date_debut: format(addDays(monthStart, 0), "yyyy-MM-dd") + "T19:00:00", date_fin: format(addDays(monthStart, 1), "yyyy-MM-dd") + "T07:00:00", duree_heures: 12, type_shift: "Nuit", service: "Urgences" },
  { id: "s3", user_id: "e3", date_debut: format(addDays(monthStart, 1), "yyyy-MM-dd") + "T07:00:00", date_fin: format(addDays(monthStart, 1), "yyyy-MM-dd") + "T12:00:00", duree_heures: 5, type_shift: "Jour", service: "Hospitalisation" },
  { id: "s4", user_id: "e4", date_debut: format(addDays(monthStart, 2), "yyyy-MM-dd") + "T07:00:00", date_fin: format(addDays(monthStart, 2), "yyyy-MM-dd") + "T19:00:00", duree_heures: 12, type_shift: "Jour", service: "Bloc Opératoire" },
  { id: "s5", user_id: "e5", date_debut: format(addDays(monthStart, 3), "yyyy-MM-dd") + "T19:00:00", date_fin: format(addDays(monthStart, 4), "yyyy-MM-dd") + "T07:00:00", duree_heures: 12, type_shift: "Nuit", service: "Urgences" },
  { id: "s6", user_id: "e1", date_debut: format(addDays(monthStart, 5), "yyyy-MM-dd") + "T07:00:00", date_fin: format(addDays(monthStart, 5), "yyyy-MM-dd") + "T19:00:00", duree_heures: 12, type_shift: "Garde_WE", service: "Urgences" },
  { id: "s7", user_id: "e7", date_debut: format(addDays(monthStart, 4), "yyyy-MM-dd") + "T07:00:00", date_fin: format(addDays(monthStart, 4), "yyyy-MM-dd") + "T19:00:00", duree_heures: 12, type_shift: "Jour", service: "Hospitalisation" },
  { id: "s8", user_id: "e6", date_debut: format(addDays(monthStart, 6), "yyyy-MM-dd") + "T07:00:00", date_fin: format(addDays(monthStart, 6), "yyyy-MM-dd") + "T19:00:00", duree_heures: 12, type_shift: "Jour", service: "Hospitalisation" },
  { id: "s9", user_id: "e2", date_debut: format(addDays(monthStart, 7), "yyyy-MM-dd") + "T08:00:00", date_fin: format(addDays(monthStart, 7), "yyyy-MM-dd") + "T20:00:00", duree_heures: 12, type_shift: "Astreinte", service: "Urgences" },
  { id: "s10", user_id: "e4", date_debut: format(addDays(monthStart, 8), "yyyy-MM-dd") + "T07:00:00", date_fin: format(addDays(monthStart, 8), "yyyy-MM-dd") + "T19:00:00", duree_heures: 12, type_shift: "Jour", service: "Bloc Opératoire" },
];

export const mockLeaves: Leave[] = [
  { id: "l1", user_id: "e3", type_absence_id: "ta1", date_debut: format(addDays(today, 5), "yyyy-MM-dd"), date_fin: format(addDays(today, 10), "yyyy-MM-dd"), nombre_jours: 5, motif: "Vacances scolaires", statut: "En_attente" },
  { id: "l2", user_id: "e5", type_absence_id: "ta1", date_debut: format(addDays(today, 14), "yyyy-MM-dd"), date_fin: format(addDays(today, 18), "yyyy-MM-dd"), nombre_jours: 4, motif: "Congé familial", statut: "En_attente" },
  { id: "l3", user_id: "e2", type_absence_id: "ta2", date_debut: format(addDays(today, -5), "yyyy-MM-dd"), date_fin: format(addDays(today, -3), "yyyy-MM-dd"), nombre_jours: 2, motif: "RTT", statut: "Validee" },
  { id: "l4", user_id: "e4", type_absence_id: "ta3", date_debut: format(addDays(today, -10), "yyyy-MM-dd"), date_fin: format(addDays(today, -8), "yyyy-MM-dd"), nombre_jours: 2, motif: "Grippe", statut: "Validee" },
  { id: "l5", user_id: "e6", type_absence_id: "ta1", date_debut: format(addDays(today, -20), "yyyy-MM-dd"), date_fin: format(addDays(today, -15), "yyyy-MM-dd"), nombre_jours: 5, motif: "Vacances", statut: "Refusee" },
];

export const mockLeaveTypes = [
  { id: "ta1", nom: "Congés Payés" },
  { id: "ta2", nom: "RTT" },
  { id: "ta3", nom: "Maladie" },
  { id: "ta4", nom: "Maternité" },
];
