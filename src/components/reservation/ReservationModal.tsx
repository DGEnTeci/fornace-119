import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TableReservation, SpecialOccasion } from '@/types/reservation';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import {
  getBogotaDateTime,
  getAvailableTimeSlots,
  isDateSelectable,
  validateReservationForm,
  ReservationFormData,
} from '@/lib/reservations';
import { generateReservationWhatsAppUrl } from '@/lib/whatsapp';
import { ReservationConfirmationModal } from './ReservationConfirmationModal';
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  AlertCircle,
  Send,
  Info,
} from 'lucide-react';

export interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OCCASIONS: { value: SpecialOccasion; label: string }[] = [
  { value: 'otro', label: 'Casual / Comida diaria' },
  { value: 'cita', label: 'Cita en pareja' },
  { value: 'aniversario', label: 'Aniversario' },
  { value: 'cumpleanos', label: 'Cumpleaños' },
  { value: 'reunion-negocios', label: 'Reunión de Negocios' },
  { value: 'cena-amigos', label: 'Cena con Amigos' },
];

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const bogotaNow = useMemo(() => getBogotaDateTime(), []);

  const [formData, setFormData] = useState<ReservationFormData>({
    fullName: '',
    phone: '',
    date: bogotaNow.dateString,
    time: '',
    guestCount: 2,
    occasion: 'otro',
    specialRequests: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // Available slots for the currently selected date
  const availableSlots = useMemo(() => {
    if (!formData.date) return [];
    return getAvailableTimeSlots(formData.date);
  }, [formData.date]);

  // Set default time slot if available
  useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.includes(formData.time)) {
      setFormData((prev) => ({ ...prev, time: availableSlots[0] }));
    }
  }, [availableSlots, formData.time]);

  const validation = useMemo(() => {
    return validateReservationForm(formData);
  }, [formData]);

  const handleInputChange = (field: keyof ReservationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all required as touched
    setTouched({
      fullName: true,
      phone: true,
      date: true,
      time: true,
      guestCount: true,
    });

    if (!validation.isValid) return;

    const reservation: TableReservation = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email?.trim() || undefined,
      date: formData.date,
      time: formData.time,
      guestCount: Number(formData.guestCount),
      occasion: formData.occasion,
      specialRequests: formData.specialRequests?.trim() || undefined,
    };

    const whatsappUrl = generateReservationWhatsAppUrl(
      RESTAURANT_CONFIG.whatsapp.phone,
      reservation
    );

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }

    setConfirmedReservation(reservation);
    onClose();
    setIsConfirmationOpen(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Reservar Mesa en Salón"
        description="Fornace 119 — Horno de leña en Usaquén"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Banner Informativo de Disponibilidad y Confirmación */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <p className="font-semibold text-amber-950">
                {RESTAURANT_CONFIG.reservations.confirmationNotice}
              </p>
              <p className="mt-1 text-amber-800">
                Horario: {RESTAURANT_CONFIG.schedule.hours} ({RESTAURANT_CONFIG.schedule.days}).
                Cerrado los {RESTAURANT_CONFIG.schedule.closedDays.join(', ')}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre Completo */}
            <div className="sm:col-span-2">
              <label
                htmlFor="res-fullname"
                className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block mb-1"
              >
                Nombre Completo *
              </label>
              <input
                id="res-fullname"
                type="text"
                required
                placeholder="Ej: Carolina Herrera"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-terracotta ${
                  touched.fullName && validation.errors.fullName
                    ? 'border-red-500'
                    : 'border-charcoal-700/20'
                }`}
              />
              {touched.fullName && validation.errors.fullName && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{validation.errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Teléfono Móvil (WhatsApp) */}
            <div>
              <label
                htmlFor="res-phone"
                className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block mb-1"
              >
                Teléfono Móvil (WhatsApp) *
              </label>
              <input
                id="res-phone"
                type="tel"
                required
                maxLength={10}
                placeholder="Ej: 3151234567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-terracotta ${
                  touched.phone && validation.errors.phone
                    ? 'border-red-500'
                    : 'border-charcoal-700/20'
                }`}
              />
              {touched.phone && validation.errors.phone && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{validation.errors.phone}</span>
                </p>
              )}
            </div>

            {/* Comensales */}
            <div>
              <label
                htmlFor="res-guests"
                className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block mb-1"
              >
                Número de Comensales *
              </label>
              <input
                id="res-guests"
                type="number"
                min={1}
                max={RESTAURANT_CONFIG.reservations.maxPartySize}
                value={formData.guestCount}
                onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value, 10) || '')}
                onBlur={() => handleBlur('guestCount')}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-terracotta ${
                  touched.guestCount && validation.errors.guestCount
                    ? 'border-red-500'
                    : 'border-charcoal-700/20'
                }`}
              />
              {touched.guestCount && validation.errors.guestCount && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{validation.errors.guestCount}</span>
                </p>
              )}
            </div>
          </div>

          {/* Aviso para Grupos Grandes (>= 8 personas) */}
          {validation.isLargeParty && (
            <div className="p-3.5 bg-terracotta/10 border border-terracotta/30 rounded-xl text-xs text-terracotta-dark flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Grupo Grande ({formData.guestCount} personas)</span>
                <p className="mt-0.5 leading-relaxed">
                  {RESTAURANT_CONFIG.reservations.largePartyNotice}
                </p>
              </div>
            </div>
          )}

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="res-date"
                className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block mb-1"
              >
                Fecha de Reserva *
              </label>
              <input
                id="res-date"
                type="date"
                min={bogotaNow.dateString}
                required
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                onBlur={() => handleBlur('date')}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-terracotta ${
                  touched.date && validation.errors.date
                    ? 'border-red-500'
                    : 'border-charcoal-700/20'
                }`}
              />
              {touched.date && validation.errors.date && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{validation.errors.date}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="res-time"
                className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block mb-1"
              >
                Hora de Reserva *
              </label>
              <select
                id="res-time"
                required
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                onBlur={() => handleBlur('time')}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-terracotta ${
                  touched.time && validation.errors.time
                    ? 'border-red-500'
                    : 'border-charcoal-700/20'
                }`}
              >
                {availableSlots.length === 0 ? (
                  <option value="" disabled>
                    Sin horarios disponibles
                  </option>
                ) : (
                  availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot} hrs
                    </option>
                  ))
                )}
              </select>
              {touched.time && validation.errors.time && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{validation.errors.time}</span>
                </p>
              )}
            </div>
          </div>

          {/* Ocasión Especial */}
          <div>
            <label
              htmlFor="res-occasion"
              className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block mb-1"
            >
              Ocasión Especial (Opcional)
            </label>
            <select
              id="res-occasion"
              value={formData.occasion}
              onChange={(e) => handleInputChange('occasion', e.target.value as SpecialOccasion)}
              className="w-full px-3.5 py-2.5 bg-white border border-charcoal-700/20 rounded-xl text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-terracotta"
            >
              {OCCASIONS.map((occ) => (
                <option key={occ.value} value={occ.value}>
                  {occ.label}
                </option>
              ))}
            </select>
          </div>

          {/* Requerimientos Especiales / Alergias */}
          <div>
            <label
              htmlFor="res-requests"
              className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block mb-1"
            >
              Alergias o Requerimientos Especiales (Opcional)
            </label>
            <textarea
              id="res-requests"
              rows={2}
              maxLength={200}
              placeholder="Ej: Algún comensal es celíaco, mesa cerca a la ventana..."
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-charcoal-700/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
          </div>

          {/* Botón de Envío */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Solicitar Reserva por WhatsApp</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Pantalla "Listo para enviar" (Sujeto a confirmación, sin decir reserva confirmada) */}
      <ReservationConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        reservation={confirmedReservation}
      />
    </>
  );
};
