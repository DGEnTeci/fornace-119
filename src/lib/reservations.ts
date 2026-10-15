import { RESTAURANT_CONFIG } from '@/config/restaurant';
import { SpecialOccasion, TableReservation } from '@/types/reservation';
import { isValidColombianPhone } from '@/lib/formatters';

export const BOGOTA_TIMEZONE = 'America/Bogota';

export interface BogotaDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  dateString: string; // YYYY-MM-DD
  timeString: string; // HH:MM
}

export interface ReservationFormData {
  fullName: string;
  phone: string;
  email?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guestCount: number;
  occasion: SpecialOccasion;
  specialRequests?: string;
}

export interface ReservationValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ReservationFormData, string>>;
  isLargeParty: boolean;
}

/**
 * Lista de horarios estándar de servicio en Fornace 119
 * Obtenidos directamente de la configuración centralizada RESTAURANT_CONFIG
 */
export const RESTAURANT_TIME_SLOTS: string[] = RESTAURANT_CONFIG.reservations.timeSlots;

/**
 * Obtiene la fecha y hora calculada en la zona horaria America/Bogota (UTC-5)
 */
export function getBogotaDateTime(date: Date = new Date()): BogotaDateTime {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: BOGOTA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => {
    const p = parts.find((pt) => pt.type === type);
    return p ? parseInt(p.value, 10) : 0;
  };

  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');
  const hour = getPart('hour');
  const minute = getPart('minute');

  // Calcular el día de la semana con fecha UTC fija en medianoche
  const bogotaUtcMidnight = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const dayOfWeek = bogotaUtcMidnight.getUTCDay();

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateString = `${year}-${pad(month)}-${pad(day)}`;
  const timeString = `${pad(hour)}:${pad(minute)}`;

  return {
    year,
    month,
    day,
    hour,
    minute,
    dayOfWeek,
    dateString,
    timeString,
  };
}

export const SPANISH_DAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export function isRestaurantClosedOnDay(dayOfWeek: number): boolean {
  const dayName = SPANISH_DAY_NAMES[dayOfWeek];
  return RESTAURANT_CONFIG.schedule.closedDays.includes(dayName);
}

/**
 * Determina si una fecha específica es seleccionable para reserva
 */
export function isDateSelectable(
  dateString: string,
  now: Date = new Date()
): { selectable: boolean; reason?: string } {
  const bogotaNow = getBogotaDateTime(now);

  // Parsear fecha objetivo
  const [yStr, mStr, dStr] = dateString.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);

  if (!y || !m || !d) {
    return { selectable: false, reason: 'Formato de fecha inválido.' };
  }

  // 1. Fechas pasadas
  if (dateString < bogotaNow.dateString) {
    return {
      selectable: false,
      reason: 'No es posible reservar en una fecha pasada.',
    };
  }

  // 2. Día de la semana (0=Domingo, 1=Lunes, ...)
  const targetUtcDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const dayOfWeek = targetUtcDate.getUTCDay();

  // Días de cierre configurados en RESTAURANT_CONFIG
  if (isRestaurantClosedOnDay(dayOfWeek)) {
    return {
      selectable: false,
      reason: 'El restaurante permanece cerrado los lunes por mantenimiento de nuestro horno de leña.',
    };
  }

  // 3. Si es hoy, verificar si aún hay horarios disponibles con la anticipación mínima
  if (dateString === bogotaNow.dateString) {
    const slots = getAvailableTimeSlots(dateString, now);
    if (slots.length === 0) {
      return {
        selectable: false,
        reason: `Para reservas de hoy se requiere mínimo ${RESTAURANT_CONFIG.reservations.minAdvanceHours} horas de anticipación. Ya no quedan turnos disponibles hoy.`,
      };
    }
  }

  return { selectable: true };
}

/**
 * Obtiene los turnos de hora disponibles para una fecha dada,
 * aplicando la anticipación mínima si la fecha es hoy en Bogotá.
 */
export function getAvailableTimeSlots(
  dateString: string,
  now: Date = new Date()
): string[] {
  const bogotaNow = getBogotaDateTime(now);

  // Si la fecha es pasada o es día de cierre, no hay turnos
  const [yStr, mStr, dStr] = dateString.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);
  const targetUtcDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const dayOfWeek = targetUtcDate.getUTCDay();

  if (isRestaurantClosedOnDay(dayOfWeek)) {
    return [];
  }

  if (dateString < bogotaNow.dateString) {
    return [];
  }

  // Si la fecha es posterior a hoy, todos los turnos están disponibles
  if (dateString > bogotaNow.dateString) {
    return [...RESTAURANT_TIME_SLOTS];
  }

  // Si la fecha es hoy, aplicar filtro de anticipación mínima (2 horas)
  const currentDecimalHours = bogotaNow.hour + bogotaNow.minute / 60;
  const earliestAllowedHours =
    currentDecimalHours + RESTAURANT_CONFIG.reservations.minAdvanceHours;

  return RESTAURANT_TIME_SLOTS.filter((slot) => {
    const [hStr, minStr] = slot.split(':');
    const slotDecimal = parseInt(hStr, 10) + parseInt(minStr, 10) / 60;
    return slotDecimal >= earliestAllowedHours;
  });
}

/**
 * Valida todos los campos del formulario de reservas
 */
export function validateReservationForm(
  data: ReservationFormData,
  now: Date = new Date()
): ReservationValidationResult {
  const errors: Partial<Record<keyof ReservationFormData, string>> = {};

  // Nombre
  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = 'El nombre completo debe tener al menos 3 caracteres.';
  }

  // Teléfono móvil colombiano (10 dígitos que empiezan por 3)
  if (!isValidColombianPhone(data.phone || '')) {
    errors.phone = 'El teléfono móvil debe iniciar por 3 y tener 10 dígitos.';
  }

  // Fecha
  if (!data.date) {
    errors.date = 'Selecciona una fecha para tu reserva.';
  } else {
    const dateCheck = isDateSelectable(data.date, now);
    if (!dateCheck.selectable) {
      errors.date = dateCheck.reason;
    }
  }

  // Hora
  if (!data.time) {
    errors.time = 'Selecciona una hora de reserva.';
  } else if (data.date) {
    const slots = getAvailableTimeSlots(data.date, now);
    if (!slots.includes(data.time)) {
      errors.time = 'El horario seleccionado no está disponible o requiere mayor anticipación.';
    }
  }

  // Comensales (mínimo 1, máximo 12)
  const guests = Number(data.guestCount);
  if (!guests || guests < 1) {
    errors.guestCount = 'Mínimo 1 persona.';
  } else if (guests > RESTAURANT_CONFIG.reservations.maxPartySize) {
    errors.guestCount = `Máximo ${RESTAURANT_CONFIG.reservations.maxPartySize} personas por reserva en línea.`;
  }

  const isLargeParty = guests >= RESTAURANT_CONFIG.reservations.largePartyThreshold;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    isLargeParty,
  };
}
