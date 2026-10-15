import { describe, it, expect } from 'vitest';
import menuData from '@/data/menu.json';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import { RESTAURANT_TIME_SLOTS, isRestaurantClosedOnDay } from '@/lib/reservations';

describe('Auditoría de Menú y Bebidas Alcohólicas (Pre-Task 6)', () => {
  it('confirma que todas las bebidas que contienen alcohol tienen isAlcoholic: true', () => {
    const alcoholicKeywords = ['vino', 'chianti', 'cerveza', 'birra', 'spritz', 'prosecco', 'amaretto', 'licor'];

    const bevandeItems = menuData.items.filter((item) => item.categoryId === 'bevande');
    expect(bevandeItems.length).toBeGreaterThan(0);

    // Verificar cada ítem en la categoría de bebidas
    bevandeItems.forEach((item) => {
      const textToSearch = `${item.name} ${item.italianName || ''} ${item.description}`.toLowerCase();
      const containsAlcoholKeyword = alcoholicKeywords.some((kw) => textToSearch.includes(kw));

      if (containsAlcoholKeyword) {
        expect(item.isAlcoholic).toBe(true);
      }
    });

    // Validar explícitamente los ítems con alcohol
    const alcoholItems = menuData.items.filter((item) => item.isAlcoholic === true);
    expect(alcoholItems.length).toBeGreaterThanOrEqual(3);

    const alcoholIds = alcoholItems.map((item) => item.id);
    expect(alcoholIds).toContain('chianti-classico');
    expect(alcoholIds).toContain('peroni-azzurro');
    expect(alcoholIds).toContain('aperol-spritz');

    // Confirmar que la limonada NO tiene isAlcoholic: true
    const limonata = menuData.items.find((item) => item.id === 'limonata-albahaca');
    expect(limonata?.isAlcoholic).toBeFalsy();
  });
});

describe('Centralización de Reservas y Horarios en RESTAURANT_CONFIG', () => {
  it('confirma que horarios, días de cierre, anticipación mínima y turnos viven en RESTAURANT_CONFIG', () => {
    // Horario y días de cierre
    expect(RESTAURANT_CONFIG.schedule.hours).toBeDefined();
    expect(RESTAURANT_CONFIG.schedule.days).toBe('Martes a Domingo');
    expect(RESTAURANT_CONFIG.schedule.closedDays).toContain('Lunes');

    // Anticipación mínima de reservas y límites
    expect(RESTAURANT_CONFIG.reservations.minAdvanceHours).toBe(2);
    expect(RESTAURANT_CONFIG.reservations.maxPartySize).toBe(12);
    expect(RESTAURANT_CONFIG.reservations.largePartyThreshold).toBe(8);

    // Time slots configurados
    expect(RESTAURANT_CONFIG.reservations.timeSlots).toBeDefined();
    expect(RESTAURANT_CONFIG.reservations.timeSlots.length).toBeGreaterThan(5);
    expect(RESTAURANT_TIME_SLOTS).toEqual(RESTAURANT_CONFIG.reservations.timeSlots);

    // Dynamic closed day check consumes RESTAURANT_CONFIG.schedule.closedDays
    expect(isRestaurantClosedOnDay(1)).toBe(true); // Lunes
    expect(isRestaurantClosedOnDay(2)).toBe(false); // Martes
  });
});
