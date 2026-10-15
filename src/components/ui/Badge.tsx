import React from 'react';
import { BadgeType } from '@/types/menu';

export interface BadgeProps {
  type: BadgeType | 'default';
  label?: string;
  className?: string;
}

const BADGE_CONFIG: Record<
  BadgeType | 'default',
  { defaultLabel: string; classes: string }
> = {
  'masa-madre': {
    defaultLabel: 'Masa Madre 48h',
    classes: 'bg-amber-100 text-amber-900 border border-amber-300/60',
  },
  dop: {
    defaultLabel: 'D.O.P. Certificado',
    classes: 'bg-emerald-100 text-emerald-900 border border-emerald-300/60',
  },
  vegetariana: {
    defaultLabel: 'Vegetariana',
    classes: 'bg-olive-light text-olive-dark border border-olive/30',
  },
  'de-autor': {
    defaultLabel: "Firma d'Autore",
    classes: 'bg-terracotta-light text-terracotta-dark border border-terracotta/30',
  },
  picante: {
    defaultLabel: 'Picante Ligero',
    classes: 'bg-red-100 text-red-900 border border-red-300/60',
  },
  default: {
    defaultLabel: 'Especialidad',
    classes: 'bg-cream-200 text-charcoal-700 border border-charcoal-600/20',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  type,
  label,
  className = '',
}) => {
  const config = BADGE_CONFIG[type] || BADGE_CONFIG.default;
  const displayText = label || config.defaultLabel;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors ${config.classes} ${className}`}
    >
      {displayText}
    </span>
  );
};
