import { describe, it, expect } from 'vitest';
import {
  generateOrderWhatsAppUrl,
  generateReservationWhatsAppUrl,
} from '@/lib/whatsapp';
import { CartState, CustomerDetails } from '@/types/cart';
import { TableReservation } from '@/types/reservation';
import { MenuItem } from '@/types/menu';

const mockMenuItem: MenuItem = {
  id: 'margherita-dop',
  categoryId: 'tradizionali',
  name: 'Margherita D.O.P.',
  italianName: 'Margherita Tradizionale',
  description: 'Tomate San Marzano D.O.P. y mozzarella di bufala campana.',
  priceCOP: 38000,
  imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143',
  badges: ['masa-madre', 'dop'],
};

describe('Generador de URLs de WhatsApp (WhatsApp Generator)', () => {
  const phone = '573000000000';

  describe('generateOrderWhatsAppUrl', () => {
    const baseCart: CartState = {
      items: [
        {
          id: 'margherita-dop-default',
          item: mockMenuItem,
          quantity: 2,
          selectedOptions: [
            {
              id: 'extra-bufala',
              name: 'Extra Mozzarella di Bufala (+60g)',
              priceCOP: 9000,
            },
          ],
          notes: 'Masa bien dorada por favor',
          unitPriceCOP: 47000,
          totalPriceCOP: 94000,
        },
      ],
      subtotalCOP: 94000,
      deliveryFeeCOP: 0,
      totalCOP: 94000,
      itemCount: 2,
      isEligibleForFreeShipping: true,
      amountNeededForFreeShippingCOP: 0,
    };

    it('construye una URL válida con prefijo wa.me y teléfono', () => {
      const customer: CustomerDetails = {
        name: 'Carlos Mendoza',
        phone: '3101234567',
        deliveryType: 'delivery',
        address: 'Carrera 7 # 118-20 Apt 402',
        notes: 'Timbrar al 402',
        paymentMethod: 'Transferencia digital (Nequi / Daviplata)',
      };

      const url = generateOrderWhatsAppUrl(phone, baseCart, customer);
      expect(url.startsWith(`https://wa.me/${phone}?text=`)).toBe(true);
    });

    it('incluye encabezado, productos, adiciones y notas del cliente en pedido a domicilio', () => {
      const customer: CustomerDetails = {
        name: 'Carlos Mendoza',
        phone: '3101234567',
        deliveryType: 'delivery',
        address: 'Carrera 7 # 118-20 Apt 402',
        notes: 'Timbrar al 402',
        paymentMethod: 'Transferencia digital (Nequi / Daviplata)',
      };

      const url = generateOrderWhatsAppUrl(phone, baseCart, customer);
      const decodedMessage = decodeURIComponent(url.replace(`https://wa.me/${phone}?text=`, ''));

      expect(decodedMessage).toContain('*NUEVO PEDIDO — FORNACE 119* 🍕');
      expect(decodedMessage).toContain('*Tipo:* Domicilio');
      expect(decodedMessage).toContain('*Cliente:* Carlos Mendoza');
      expect(decodedMessage).toContain('*Teléfono:* 3101234567');
      expect(decodedMessage).toContain('*Dirección (Usaquén):* Carrera 7 # 118-20 Apt 402');
      expect(decodedMessage).toContain('*Indicaciones:* Timbrar al 402');
      expect(decodedMessage).toContain('2x Margherita D.O.P.');
      expect(decodedMessage).toContain('+ Extra Mozzarella di Bufala (+60g)');
      expect(decodedMessage).toContain('*Subtotal:* $ 94.000');
      expect(decodedMessage).toContain('*Envío:* Gratis (compra desde $ 70.000)');
      expect(decodedMessage).toContain('*TOTAL A PAGAR:* $ 94.000');
      expect(decodedMessage).toContain('*Método de Pago Preferido:* Transferencia digital (Nequi / Daviplata)');
    });

    it('calcula y formatea el subtotal con múltiples adiciones por ítem en el mensaje', () => {
      // 1 pizza de 38.000 + extra bufala (9.000) + borde ricotta (8.000) = 55.000 unitario
      // x 2 unidades = subtotal 110.000
      const itemWithMultipleAdditions = {
        id: 'margherita-custom',
        item: mockMenuItem,
        quantity: 2,
        selectedOptions: [
          { id: 'extra-bufala', name: 'Extra Mozzarella di Bufala (+60g)', priceCOP: 9000 },
          { id: 'borde-ricotta', name: 'Borde relleno de Ricotta trufada', priceCOP: 8000 },
        ],
        unitPriceCOP: 55000,
        totalPriceCOP: 110000,
      };

      const customCart: CartState = {
        items: [itemWithMultipleAdditions],
        subtotalCOP: 110000,
        deliveryFeeCOP: 0,
        totalCOP: 110000,
        itemCount: 2,
        isEligibleForFreeShipping: true,
        amountNeededForFreeShippingCOP: 0,
      };

      const customer: CustomerDetails = {
        name: 'Mariana Silva',
        phone: '3151112233',
        deliveryType: 'delivery',
        address: 'Calle 120 # 6-30',
        paymentMethod: 'Efectivo contra entrega',
      };

      const url = generateOrderWhatsAppUrl(phone, customCart, customer);
      const decoded = decodeURIComponent(url.replace(`https://wa.me/${phone}?text=`, ''));

      expect(decoded).toContain('• 2x Margherita D.O.P. ($ 110.000)');
      expect(decoded).toContain('+ Extra Mozzarella di Bufala (+60g)');
      expect(decoded).toContain('+ Borde relleno de Ricotta trufada');
      expect(decoded).toContain('*Subtotal:* $ 110.000');
      expect(decoded).toContain('*Envío:* Gratis (compra desde $ 70.000)');
      expect(decoded).toContain('*TOTAL A PAGAR:* $ 110.000');
    });

    it('formatea correctamente un pedido para llevar (takeaway) sin dirección ni cobro de envío', () => {
      const takeawayCart: CartState = {
        items: [
          {
            id: 'margherita-dop-default',
            item: mockMenuItem,
            quantity: 1,
            selectedOptions: [],
            unitPriceCOP: 38000,
            totalPriceCOP: 38000,
          },
        ],
        subtotalCOP: 38000,
        deliveryFeeCOP: 0,
        totalCOP: 38000,
        itemCount: 1,
        isEligibleForFreeShipping: false,
        amountNeededForFreeShippingCOP: 32000,
      };

      const customer: CustomerDetails = {
        name: 'Valentina Restrepo',
        phone: '3209876543',
        deliveryType: 'takeaway',
        paymentMethod: 'Datáfono contra entrega (Crédito / Débito)',
      };

      const url = generateOrderWhatsAppUrl(phone, takeawayCart, customer);
      const decodedMessage = decodeURIComponent(url.replace(`https://wa.me/${phone}?text=`, ''));

      expect(decodedMessage).toContain('*Tipo:* Para Llevar (Take-away)');
      expect(decodedMessage).not.toContain('*Dirección (Usaquén):*');
      expect(decodedMessage).not.toContain('*Envío:*');
      expect(decodedMessage).toContain('*TOTAL A PAGAR:* $ 38.000');
    });

    it('restringe URLs de pedidos excesivamente grandes para no superar el límite seguro (2000 chars)', () => {
      const veryLongNotes = 'Nota muy larga '.repeat(200);
      const largeCart: CartState = {
        ...baseCart,
        items: Array.from({ length: 30 }, (_, i) => ({
          id: `item-${i}`,
          item: { ...mockMenuItem, name: `Pizza Especial Gourmet Variedad #${i}` },
          quantity: 2,
          selectedOptions: [{ id: 'opt', name: 'Extra queso artesanal importado', priceCOP: 8000 }],
          notes: veryLongNotes,
          unitPriceCOP: 46000,
          totalPriceCOP: 92000,
        })),
      };

      const customer: CustomerDetails = {
        name: 'Cliente con pedido gigante',
        phone: '3001234567',
        deliveryType: 'delivery',
        address: 'Carrera 7 # 119-10 Torre B Piso 12 Apartamento 1204',
        notes: veryLongNotes,
        paymentMethod: 'Transferencia digital (Nequi / Daviplata)',
      };

      const url = generateOrderWhatsAppUrl(phone, largeCart, customer);
      expect(url.length).toBeLessThanOrEqual(2000);
      expect(url.startsWith(`https://wa.me/${phone}?text=`)).toBe(true);
    });

    it('incluye el aviso de venta de licor solo a mayores de 18 años cuando el carrito contiene bebidas alcohólicas', () => {
      const wineItem: MenuItem = {
        id: 'chianti-classico',
        categoryId: 'bevande',
        name: 'Chianti Classico DOCG (Botella 750ml)',
        description: 'Vino tinto italiano.',
        priceCOP: 115000,
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
        badges: ['dop'],
        isAlcoholic: true,
      };

      const alcoholCart: CartState = {
        ...baseCart,
        items: [
          ...baseCart.items,
          {
            id: 'chianti-classico-default',
            item: wineItem,
            quantity: 1,
            selectedOptions: [],
            unitPriceCOP: 115000,
            totalPriceCOP: 115000,
          },
        ],
        subtotalCOP: baseCart.subtotalCOP + 115000,
        totalCOP: baseCart.totalCOP + 115000,
      };

      const customer: CustomerDetails = {
        name: 'Andrés Pastrana',
        phone: '3001234567',
        deliveryType: 'delivery',
        address: 'Calle 119 # 5-20',
        paymentMethod: 'Transferencia digital (Nequi / Daviplata)',
      };

      const url = generateOrderWhatsAppUrl(phone, alcoholCart, customer);
      const decoded = decodeURIComponent(url.replace(`https://wa.me/${phone}?text=`, ''));

      expect(decoded).toContain('🔞 *Aviso Ley 124 de 1994:* Venta de licor exclusiva para mayores de 18 años.');

      // Y confirma que no aparece si el carrito no tiene alcohol
      const nonAlcoholUrl = generateOrderWhatsAppUrl(phone, baseCart, customer);
      const nonAlcoholDecoded = decodeURIComponent(nonAlcoholUrl.replace(`https://wa.me/${phone}?text=`, ''));
      expect(nonAlcoholDecoded).not.toContain('Aviso Ley 124');
    });
  });

  describe('generateReservationWhatsAppUrl', () => {
    it('genera el mensaje estructurado de solicitud de reserva de mesa', () => {
      const reservation: TableReservation = {
        fullName: 'Alejandro Gómez',
        phone: '3157891234',
        email: 'alejandro@example.com',
        date: '2026-10-20',
        time: '20:00',
        guestCount: 2,
        occasion: 'aniversario',
        specialRequests: 'Mesa cerca del horno de leña por favor',
      };

      const url = generateReservationWhatsAppUrl(phone, reservation);
      expect(url.startsWith(`https://wa.me/${phone}?text=`)).toBe(true);

      const decodedMessage = decodeURIComponent(url.replace(`https://wa.me/${phone}?text=`, ''));
      expect(decodedMessage).toContain('*SOLICITUD DE RESERVA — FORNACE 119* 🍷');
      expect(decodedMessage).toContain('*Cliente:* Alejandro Gómez');
      expect(decodedMessage).toContain('*Teléfono:* 3157891234');
      expect(decodedMessage).toContain('*Fecha:* 2026-10-20');
      expect(decodedMessage).toContain('*Hora:* 20:00');
      expect(decodedMessage).toContain('*Comensales:* 2 personas');
      expect(decodedMessage).toContain('*Ocasión:* Aniversario');
      expect(decodedMessage).toContain('*Peticiones especiales:* Mesa cerca del horno de leña por favor');
    });
  });
});
