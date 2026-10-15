import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { OurDough } from '@/components/sections/OurDough';
import { LocationSection } from '@/components/sections/LocationSection';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import { CartProvider } from '@/hooks/useCart';

describe('Task 6a: Secciones de Marca y Accesibilidad', () => {
  it('renderiza SkipLink con destino a #main-content', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: /saltar al contenido principal/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  it('renderiza Header con banner landmark y trigger de bolsa', () => {
    const onOpenCart = vi.fn();
    const onOpenReservation = vi.fn();

    render(
      <CartProvider>
        <Header onOpenCart={onOpenCart} onOpenReservation={onOpenReservation} />
      </CartProvider>
    );

    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('navigation', { name: /navegación principal/i })).toBeTruthy();

    const reservationBtn = screen.getByRole('button', { name: /abrir formulario para reservar/i });
    fireEvent.click(reservationBtn);
    expect(onOpenReservation).toHaveBeenCalledTimes(1);

    const cartBtn = screen.getByRole('button', { name: /ver bolsa de pedido/i });
    fireEvent.click(cartBtn);
    expect(onOpenCart).toHaveBeenCalledTimes(1);
  });

  it('renderiza Hero con historia del horno a 450°C, masa madre y CTAs', () => {
    const onOpenReservation = vi.fn();
    render(<Hero onOpenReservation={onOpenReservation} />);

    expect(screen.getByRole('heading', { level: 1, name: /pizze napoletane & fermento antico/i })).toBeTruthy();
    expect(screen.getByText(/lievito madre/i)).toBeTruthy();
    expect(screen.getAllByText(/450°C/i).length).toBeGreaterThanOrEqual(1);

    const reservationBtn = screen.getByRole('button', { name: /reservar mesa/i });
    fireEvent.click(reservationBtn);
    expect(onOpenReservation).toHaveBeenCalledTimes(1);
  });

  it('renderiza sección "Nuestra Masa" con los 4 pilares artesanales', () => {
    render(<OurDough />);

    expect(screen.getByRole('heading', { level: 2, name: /nuestra masa: el respeto por el tiempo y el fuego/i })).toBeTruthy();
    expect(screen.getByText(/lievito madre vivo/i)).toBeTruthy();
    expect(screen.getByText(/maduración lenta 48h - 72h/i)).toBeTruthy();
    expect(screen.getByText(/harina italiana tipo 00/i)).toBeTruthy();
    expect(screen.getByText(/90 segundos a 450°c/i)).toBeTruthy();
  });

  it('renderiza sección de Ubicación con Usaquén, radio 3-5 km y medios de pago', () => {
    render(<LocationSection />);

    expect(screen.getByRole('heading', { level: 2, name: /en el corazón histórico de usaquén/i })).toBeTruthy();
    expect(screen.getByText(/calle 119 # 5-28/i)).toBeTruthy();
    expect(screen.getByText(/zona de domicilios \(3 - 5 km\)/i)).toBeTruthy();
    expect(screen.getByText(/nequi \/ daviplata/i)).toBeTruthy();
  });

  it('renderiza Footer con landmark contentinfo, aviso obligatorio de licor (Ley 124 de 1994) y enlace a privacidad', () => {
    const onOpenPrivacy = vi.fn();
    const onOpenReservation = vi.fn();

    render(<Footer onOpenPrivacyModal={onOpenPrivacy} onOpenReservation={onOpenReservation} />);

    expect(screen.getByRole('contentinfo')).toBeTruthy();

    // Verificación textual obligatoria de la Ley de Licores
    expect(screen.getByText(/el exceso de alcohol es perjudicial para la salud/i)).toBeTruthy();
    expect(screen.getByText(/prohíbase el expendio de bebidas embriagantes a menores de edad/i)).toBeTruthy();

    // Verificación del aviso de marca ficticia con fines de demostración técnica
    expect(screen.getByText(/marca ficticia con fines de demostración/i)).toBeTruthy();

    // Disparador de política de privacidad
    const privacyBtn = screen.getAllByRole('button', { name: /tratamiento de datos|privacidad/i })[0];
    fireEvent.click(privacyBtn);
    expect(onOpenPrivacy).toHaveBeenCalledTimes(1);
  });

  it('organiza el Footer en 4 columnas legibles con horarios, navegación, pagos y botón de WhatsApp formateado', () => {
    const onOpenPrivacy = vi.fn();
    const onOpenReservation = vi.fn();

    render(<Footer onOpenPrivacyModal={onOpenPrivacy} onOpenReservation={onOpenReservation} />);

    // Columnas principales
    expect(screen.getByRole('heading', { level: 4, name: /explorar/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 4, name: /ubicación & horarios/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 4, name: /contacto & pedidos/i })).toBeTruthy();

    // Medios de pago
    expect(screen.getByText('Nequi')).toBeTruthy();
    expect(screen.getByText('Daviplata')).toBeTruthy();
    expect(screen.getByText('Bre-B')).toBeTruthy();
    expect(screen.getByText('Datáfono')).toBeTruthy();
    expect(screen.getByText('Efectivo')).toBeTruthy();

    // Enlace de WhatsApp formateado con aria-label accesible
    const whatsappLink = screen.getByRole('link', { name: /pedir por whatsapp/i });
    expect(whatsappLink).toBeTruthy();
    expect(whatsappLink.getAttribute('href')).toContain('https://wa.me/');

    // Botón de reserva en salón dentro del footer
    const reservationBtn = screen.getByRole('button', { name: /reservar mesa en salón/i });
    fireEvent.click(reservationBtn);
    expect(onOpenReservation).toHaveBeenCalledTimes(1);
  });
});

