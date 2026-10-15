import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RestaurantJsonLd } from '@/components/seo/RestaurantJsonLd';

describe('Task 6a: Datos Estructurados Schema.org Restaurant (JSON-LD)', () => {
  it('genera el script application/ld+json válido con datos de Fornace 119', () => {
    const { container } = render(<RestaurantJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const json = JSON.parse(script!.innerHTML);
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('Restaurant');
    expect(json.name).toBe('Fornace 119');
    expect(json.address.streetAddress).toBe('Calle Ficticia 119 # 0-00 (Demostración)');
    expect(json.address.addressLocality).toBe('Usaquén (Ficticio)');
    expect(json.address.addressCountry).toBe('CO');
    expect(json.servesCuisine).toContain('Pizza Napoletana');
    expect(json.acceptsReservations).toBe('True');
    expect(json.geo.latitude).toBe(0.0);
    expect(json.geo.longitude).toBe(0.0);
  });
});
