import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TableReservation } from '@/types/reservation';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import {
  generateReservationWhatsAppUrl,
  formatReservationMessageText,
} from '@/lib/whatsapp';
import {
  Calendar,
  Clock,
  Users,
  Send,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export interface ReservationConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: TableReservation | null;
}

export const ReservationConfirmationModal: React.FC<
  ReservationConfirmationModalProps
> = ({ isOpen, onClose, reservation }) => {
  const [copied, setCopied] = useState(false);

  if (!reservation) return null;

  const messageText = formatReservationMessageText(reservation);
  const whatsappUrl = generateReservationWhatsAppUrl(
    RESTAURANT_CONFIG.whatsapp.phone,
    reservation
  );

  const handleOpenWhatsAppAgain = () => {
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleCopyMessage = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(messageText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error('Error copiando solicitud de reserva:', e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Listo para enviar: pulsa Enviar en WhatsApp; el restaurante te confirmará la mesa"
      description="Fornace 119 — Solicitud de Reserva en Salón"
      maxWidth="md"
    >
      <div className="space-y-5 pt-2">
        {/* Banner de Estado Informativo */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-950">
              Solicitud preparada en WhatsApp (Sujeta a confirmación)
            </p>
            <p className="text-amber-800 text-xs mt-1 leading-relaxed">
              Recuerda pulsar el botón de <strong>Enviar</strong> dentro de WhatsApp. Nuestro anfitrión en Usaquén verificará el mapa de mesas y te responderá con la confirmación oficial.
            </p>
          </div>
        </div>

        {/* Acciones de recuperación: Reabrir o Copiar */}
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenWhatsAppAgain}
            className="flex-1 gap-2 text-xs"
          >
            <Send className="w-4 h-4 text-emerald-700" />
            <span>Abrir WhatsApp de nuevo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyMessage}
            className="flex-1 gap-2 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span className="text-emerald-800 font-semibold">¡Mensaje copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-charcoal-700" />
                <span>Copiar mensaje</span>
              </>
            )}
          </Button>
        </div>

        {/* Resumen de la Solicitud */}
        <div className="bg-cream-100 rounded-2xl p-4 border border-charcoal-700/10 space-y-3">
          <div className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold border-b border-charcoal-700/10 pb-2 flex justify-between">
            <span>Cliente: {reservation.fullName}</span>
            <span>Tel: {reservation.phone}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-terracotta shrink-0" />
              <div>
                <span className="text-[11px] text-charcoal-500 block">Fecha</span>
                <span className="font-semibold text-charcoal-900">{reservation.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-terracotta shrink-0" />
              <div>
                <span className="text-[11px] text-charcoal-500 block">Hora</span>
                <span className="font-semibold text-charcoal-900">{reservation.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-terracotta shrink-0" />
              <div>
                <span className="text-[11px] text-charcoal-500 block">Comensales</span>
                <span className="font-semibold text-charcoal-900">
                  {reservation.guestCount} {reservation.guestCount === 1 ? 'persona' : 'personas'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-[11px] text-charcoal-500 block">Ocasión</span>
                <span className="font-semibold text-charcoal-900 capitalize">
                  {reservation.occasion}
                </span>
              </div>
            </div>
          </div>

          {reservation.specialRequests && (
            <div className="pt-2 border-t border-charcoal-700/10 text-xs text-charcoal-700">
              <span className="font-semibold block text-charcoal-900 mb-0.5">
                Peticiones o requerimientos:
              </span>
              <p className="italic bg-white/60 p-2 rounded-lg border border-charcoal-700/10">
                "{reservation.specialRequests}"
              </p>
            </div>
          )}
        </div>

        {/* Botón de cierre */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full gap-2 shadow-sm"
            onClick={onClose}
          >
            <span>Entendido, volver a la carta</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
