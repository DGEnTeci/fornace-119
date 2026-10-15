import { describe, it, expect } from 'vitest';
import {
  getBogotaDateTime,
  isDateSelectable,
  getAvailableTimeSlots,
  validateReservationForm,
  ReservationFormData,
} from '@/lib/reservations';
import { formatReservationMessageText, generateReservationWhatsAppUrl } from '@/lib/whatsapp';
import { RESTAURANT_CONFIG } from '@/config/restaurant';

describe('Task 5b: Sistema de Reservas en Salón (TDD)', () => {
  describe('Cálculos de Zona Horaria America/Bogota y Días de Cierre', () => {
    it('obtiene la fecha y hora correctas en America/Bogota (UTC-5)', () => {
      // 2026-10-15T18:00:00Z -> en Bogotá (UTC-5) son las 13:00 (1:00 p.m.) del 2026-10-15 (Jueves)
      const mockUtcDate = new Date('2026-10-15T18:00:00Z');
      const bogota = getBogotaDateTime(mockUtcDate);

      expect(bogota.year).toBe(2026);
      expect(bogota.month).toBe(10);
      expect(bogota.day).toBe(15);
      expect(bogota.hour).toBe(13);
      expect(bogota.minute).toBe(0);
      expect(bogota.dayOfWeek).toBe(4); // Jueves (0=Domingo, 1=Lunes, 4=Jueves)
      expect(bogota.dateString).toBe('2026-10-15');
    });

    it('rechaza los lunes como días de cierre configurados en RESTAURANT_CONFIG', () => {
      // 2026-10-19 es Lunes
      const mockMonday = '2026-10-19';
      // Asumimos hoy es 2026-10-15
      const now = new Date('2026-10-15T18:00:00Z');

      const check = isDateSelectable(mockMonday, now);
      expect(check.selectable).toBe(false);
      expect(check.reason).toMatch(/cerrado.*lunes|lunes.*cerrado/i);
    });

    it('rechaza fechas en el pasado con respecto a la fecha actual de Bogotá', () => {
      // Asumimos hoy es 2026-10-15 en Bogotá
      const now = new Date('2026-10-15T18:00:00Z');
      const pastDate = '2026-10-14';

      const check = isDateSelectable(pastDate, now);
      expect(check.selectable).toBe(false);
      expect(check.reason).toMatch(/fecha pasada/i);
    });

    it('permite fechas futuras abiertas (ej. Martes a Domingo)', () => {
      // Asumimos hoy es 2026-10-15
      const now = new Date('2026-10-15T18:00:00Z');
      // 2026-10-16 es Viernes
      const check = isDateSelectable('2026-10-16', now);
      expect(check.selectable).toBe(true);
      expect(check.reason).toBeUndefined();
    });
  });

  describe('Horarios y Anticipación Mínima (minAdvanceHours)', () => {
    it('filtra los horarios para el mismo día exigiendo la anticipación mínima (2 horas)', () => {
      // En Bogotá son las 14:15 (2:15 p.m.) del jueves 2026-10-15
      // 14:15 + 2h = 16:15. Por tanto, los horarios antes de las 16:30 no deben estar disponibles
      const now = new Date('2026-10-15T19:15:00Z'); // 19:15 UTC = 14:15 Bogotá
      const slots = getAvailableTimeSlots('2026-10-15', now);

      expect(slots).not.toContain('12:30');
      expect(slots).not.toContain('13:00');
      expect(slots).not.toContain('14:00');
      expect(slots).not.toContain('16:00');
      expect(slots).toContain('16:30');
      expect(slots).toContain('20:00');
    });

    it('ofrece la lista completa de horarios del restaurante para una fecha futura abierta', () => {
      const now = new Date('2026-10-15T19:15:00Z');
      // Viernes 2026-10-16 (futuro)
      const slots = getAvailableTimeSlots('2026-10-16', now);

      expect(slots).toContain('12:30');
      expect(slots).toContain('13:00');
      expect(slots).toContain('19:00');
      expect(slots).toContain('21:30');
    });

    it('retorna lista vacía de horarios para días de cierre (Lunes)', () => {
      const now = new Date('2026-10-15T19:15:00Z');
      const mondaySlots = getAvailableTimeSlots('2026-10-19', now);
      expect(mondaySlots).toHaveLength(0);
    });
  });

  describe('Validación de Formulario de Reserva (validateReservationForm)', () => {
    const validForm: ReservationFormData = {
      fullName: 'Carolina Herrera',
      phone: '3157891234',
      date: '2026-10-17', // Sábado
      time: '19:30',
      guestCount: 4,
      occasion: 'aniversario',
      specialRequests: 'Sin lácteos para uno de los comensales',
    };

    it('valida exitosamente una reserva con todos los campos correctos', () => {
      const now = new Date('2026-10-15T18:00:00Z');
      const result = validateReservationForm(validForm, now);
      expect(result.isValid).toBe(true);
      expect(result.isLargeParty).toBe(false);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('valida el teléfono móvil colombiano (10 dígitos que inician con 3)', () => {
      const now = new Date('2026-10-15T18:00:00Z');

      const invalidPhone = validateReservationForm({ ...validForm, phone: '2001234567' }, now);
      expect(invalidPhone.isValid).toBe(false);
      expect(invalidPhone.errors.phone).toMatch(/debe iniciar por 3 y tener 10 dígitos/i);

      const shortPhone = validateReservationForm({ ...validForm, phone: '315123' }, now);
      expect(shortPhone.isValid).toBe(false);
      expect(shortPhone.errors.phone).toBeDefined();
    });

    it('valida límites de personas (mínimo 1, máximo configurable 12)', () => {
      const now = new Date('2026-10-15T18:00:00Z');

      const zeroGuests = validateReservationForm({ ...validForm, guestCount: 0 }, now);
      expect(zeroGuests.isValid).toBe(false);
      expect(zeroGuests.errors.guestCount).toMatch(/mínimo 1/i);

      const tooManyGuests = validateReservationForm({ ...validForm, guestCount: 15 }, now);
      expect(tooManyGuests.isValid).toBe(false);
      expect(tooManyGuests.errors.guestCount).toMatch(/máximo 12/i);
    });

    it('activa la alerta de grupo grande para 8 o más personas', () => {
      const now = new Date('2026-10-15T18:00:00Z');

      const party8 = validateReservationForm({ ...validForm, guestCount: 8 }, now);
      expect(party8.isValid).toBe(true);
      expect(party8.isLargeParty).toBe(true);

      const party4 = validateReservationForm({ ...validForm, guestCount: 4 }, now);
      expect(party4.isLargeParty).toBe(false);
    });
  });

  describe('Mensajes Estructurados de WhatsApp para Reservas', () => {
    it('incluye advertencia de que la solicitud está sujeta a confirmación y NO dice confirmada', () => {
      const text = formatReservationMessageText({
        fullName: 'Carolina Herrera',
        phone: '3157891234',
        date: '2026-10-17',
        time: '19:30',
        guestCount: 4,
        occasion: 'aniversario',
        specialRequests: 'Mesa exterior por favor',
      });

      expect(text).toContain('*SOLICITUD DE RESERVA — FORNACE 119* 🍷');
      expect(text).toContain('Carolina Herrera');
      expect(text).toContain('4 personas');
      expect(text).toContain('Aniversario');
      expect(text).toContain('Mesa exterior por favor');
      expect(text).toMatch(/sujeta a confirmación/i);
      expect(text).not.toContain('Reserva Confirmada');
    });
  });
});
