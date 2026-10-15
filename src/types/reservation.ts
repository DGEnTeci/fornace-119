export type SpecialOccasion =
  | 'cita'
  | 'aniversario'
  | 'cumpleanos'
  | 'reunion-negocios'
  | 'cena-amigos'
  | 'otro';

export interface TableReservation {
  fullName: string;
  phone: string;
  email?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guestCount: number;
  occasion: SpecialOccasion;
  specialRequests?: string;
}
