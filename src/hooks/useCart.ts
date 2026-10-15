'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CartItem, CartState, DeliveryType, StoredOrder } from '@/types/cart';
import { MenuItem, MenuOption } from '@/types/menu';
import {
  calculateDeliveryFee,
  isEligibleForFreeShipping,
  amountNeededForFreeShipping,
} from '@/lib/shipping';

export const CART_STORAGE_KEY = 'fornace119:cart:v1';
export const MAX_ITEM_QUANTITY = 20;
export const MIN_ITEM_QUANTITY = 1;

export interface UseCartReturn extends CartState {
  deliveryType: DeliveryType;
  isHydrated: boolean;
  addItem: (
    item: MenuItem,
    quantity?: number,
    selectedOptions?: MenuOption[],
    notes?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  setDeliveryType: (type: DeliveryType) => void;
  clearCart: () => void;
  restoreOrder: (order: StoredOrder) => void;
}

function generateCartItemId(
  itemId: string,
  options: MenuOption[] = [],
  notes?: string
): string {
  const optionsKey = options
    .map((o) => o.id)
    .sort()
    .join('-');
  const notesKey = notes ? notes.trim() : '';
  return `${itemId}_${optionsKey}_${notesKey}`;
}

export function useCartState(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryTypeState] = useState<DeliveryType>('delivery');
  const [isHydrated, setIsHydrated] = useState(false);

  // Carga inicial y sincronización segura con localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.items)) {
          setItems(parsed.items);
          if (parsed.deliveryType === 'delivery' || parsed.deliveryType === 'takeaway') {
            setDeliveryTypeState(parsed.deliveryType);
          }
        }
      }
    } catch (e) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persistencia reactiva a localStorage tras la hidratación
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items, deliveryType })
      );
    } catch (e) {
      console.error('Error guardando carrito en localStorage:', e);
    }
  }, [items, deliveryType, isHydrated]);

  // Cálculos derivados
  const subtotalCOP = useMemo(() => {
    return items.reduce((sum, item) => sum + item.totalPriceCOP, 0);
  }, [items]);

  const deliveryFeeCOP = useMemo(() => {
    if (items.length === 0 || subtotalCOP === 0) return 0;
    return calculateDeliveryFee(subtotalCOP, deliveryType);
  }, [items.length, subtotalCOP, deliveryType]);

  const totalCOP = useMemo(() => {
    if (items.length === 0 || subtotalCOP === 0) return 0;
    return subtotalCOP + deliveryFeeCOP;
  }, [items.length, subtotalCOP, deliveryFeeCOP]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const eligibleForFree = useMemo(() => {
    return isEligibleForFreeShipping(subtotalCOP);
  }, [subtotalCOP]);

  const neededForFree = useMemo(() => {
    return amountNeededForFreeShipping(subtotalCOP);
  }, [subtotalCOP]);

  // Acciones
  const addItem = useCallback(
    (
      item: MenuItem,
      quantity: number = 1,
      selectedOptions: MenuOption[] = [],
      notes?: string
    ) => {
      const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.priceCOP, 0);
      const unitPriceCOP = item.priceCOP + optionsTotal;
      const cartItemId = generateCartItemId(item.id, selectedOptions, notes);
      const requestedQty = Math.max(MIN_ITEM_QUANTITY, quantity);

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((i) => i.id === cartItemId);
        if (existingIndex > -1) {
          const updated = [...prevItems];
          const current = updated[existingIndex];
          const newQuantity = Math.min(MAX_ITEM_QUANTITY, current.quantity + requestedQty);
          updated[existingIndex] = {
            ...current,
            quantity: newQuantity,
            totalPriceCOP: unitPriceCOP * newQuantity,
          };
          return updated;
        }

        const cappedQuantity = Math.min(MAX_ITEM_QUANTITY, requestedQty);
        const newItem: CartItem = {
          id: cartItemId,
          item,
          quantity: cappedQuantity,
          selectedOptions,
          notes,
          unitPriceCOP,
          totalPriceCOP: unitPriceCOP * cappedQuantity,
        };
        return [...prevItems, newItem];
      });
    },
    []
  );

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== cartItemId));
      return;
    }

    const cappedQuantity = Math.min(MAX_ITEM_QUANTITY, Math.max(MIN_ITEM_QUANTITY, quantity));

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === cartItemId) {
          return {
            ...i,
            quantity: cappedQuantity,
            totalPriceCOP: i.unitPriceCOP * cappedQuantity,
          };
        }
        return i;
      })
    );
  }, []);

  const setDeliveryType = useCallback((type: DeliveryType) => {
    setDeliveryTypeState(type);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const restoreOrder = useCallback((order: StoredOrder) => {
    setItems(order.items);
    setDeliveryTypeState(order.customer.deliveryType);
  }, []);

  return {
    items,
    subtotalCOP,
    deliveryFeeCOP,
    totalCOP,
    itemCount,
    isEligibleForFreeShipping: eligibleForFree,
    amountNeededForFreeShippingCOP: neededForFree,
    deliveryType,
    isHydrated,
    addItem,
    removeItem,
    updateQuantity,
    setDeliveryType,
    clearCart,
    restoreOrder,
  };
}

const CartContext = createContext<UseCartReturn | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cart = useCartState();
  return React.createElement(CartContext.Provider, { value: cart }, children);
};

export function useCart(): UseCartReturn {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un <CartProvider>');
  }
  return context;
}
