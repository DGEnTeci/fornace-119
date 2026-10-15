import { useState, useEffect, useCallback } from 'react';
import { CartItem, StoredOrder } from '@/types/cart';
import { MenuItem, MenuOption, MenuData } from '@/types/menu';
import rawMenuData from '@/data/menu.json';
import { calculateDeliveryFee } from '@/lib/shipping';

const menuData = rawMenuData as unknown as MenuData;

export const LAST_ORDER_STORAGE_KEY = 'fornace119:last-order:v1';

export interface OrderRevalidationResult {
  isValid: boolean;
  unavailableItems: string[];
  hasPriceChanges: boolean;
  warningMessage?: string;
  updatedOrder?: StoredOrder;
}

export interface UseLastOrderReturn {
  hasLastOrder: boolean;
  lastOrder: StoredOrder | null;
  revalidation: OrderRevalidationResult | null;
  saveLastOrder: (order: StoredOrder) => void;
  clearLastOrder: () => void;
}

/**
 * Revalida una orden almacenada contra los ítems y precios vigentes en menu.json
 */
export function revalidateStoredOrder(order: StoredOrder): OrderRevalidationResult {
  const unavailableItems: string[] = [];
  let hasPriceChanges = false;
  const updatedItems: CartItem[] = [];

  for (const cartItem of order.items) {
    const currentMenuItem = menuData.items.find((m) => m.id === cartItem.item.id);

    if (!currentMenuItem) {
      unavailableItems.push(cartItem.item.name);
      continue;
    }

    // Revalidar adiciones y precio unitario vigente
    let currentUnitPrice = currentMenuItem.priceCOP;
    const validatedOptions: MenuOption[] = [];

    if (cartItem.selectedOptions && cartItem.selectedOptions.length > 0) {
      for (const opt of cartItem.selectedOptions) {
        const currentOption = currentMenuItem.availableOptions?.find((o) => o.id === opt.id);
        if (currentOption) {
          currentUnitPrice += currentOption.priceCOP;
          validatedOptions.push(currentOption);
        } else {
          currentUnitPrice += opt.priceCOP;
          validatedOptions.push(opt);
        }
      }
    }

    if (currentUnitPrice !== cartItem.unitPriceCOP) {
      hasPriceChanges = true;
    }

    const currentTotalPrice = currentUnitPrice * cartItem.quantity;

    updatedItems.push({
      ...cartItem,
      item: currentMenuItem,
      unitPriceCOP: currentUnitPrice,
      totalPriceCOP: currentTotalPrice,
      selectedOptions: validatedOptions,
    });
  }

  const isValid = unavailableItems.length === 0;
  const warningMessage = !isValid
    ? `Uno o más platos de tu pedido anterior ya no se encuentra disponible en nuestra carta actual.`
    : undefined;

  const updatedSubtotal = updatedItems.reduce((sum, i) => sum + i.totalPriceCOP, 0);
  const updatedDeliveryFee = calculateDeliveryFee(
    updatedSubtotal,
    order.customer.deliveryType
  );
  const updatedTotal = updatedSubtotal + updatedDeliveryFee;

  const updatedOrder: StoredOrder = {
    ...order,
    items: updatedItems,
    subtotalCOP: updatedSubtotal,
    deliveryFeeCOP: updatedDeliveryFee,
    totalCOP: updatedTotal,
  };

  return {
    isValid,
    unavailableItems,
    hasPriceChanges,
    warningMessage,
    updatedOrder,
  };
}

export function useLastOrder(): UseLastOrderReturn {
  const [lastOrder, setLastOrder] = useState<StoredOrder | null>(null);
  const [revalidation, setRevalidation] = useState<OrderRevalidationResult | null>(null);

  const loadAndRevalidate = useCallback(() => {
    try {
      const stored = window.localStorage.getItem(LAST_ORDER_STORAGE_KEY);
      if (!stored) {
        setLastOrder(null);
        setRevalidation(null);
        return;
      }

      const parsed: StoredOrder = JSON.parse(stored);
      if (parsed && parsed.id && Array.isArray(parsed.items)) {
        setLastOrder(parsed);
        const revalResult = revalidateStoredOrder(parsed);
        setRevalidation(revalResult);
      } else {
        setLastOrder(null);
        setRevalidation(null);
      }
    } catch (e) {
      // Manejo defensivo ante JSON corrupto
      window.localStorage.removeItem(LAST_ORDER_STORAGE_KEY);
      setLastOrder(null);
      setRevalidation(null);
    }
  }, []);

  useEffect(() => {
    loadAndRevalidate();
  }, [loadAndRevalidate]);

  const saveLastOrder = useCallback(
    (order: StoredOrder) => {
      try {
        window.localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(order));
        setLastOrder(order);
        const revalResult = revalidateStoredOrder(order);
        setRevalidation(revalResult);
      } catch (e) {
        console.error('Error guardando último pedido en localStorage:', e);
      }
    },
    []
  );

  const clearLastOrder = useCallback(() => {
    try {
      window.localStorage.removeItem(LAST_ORDER_STORAGE_KEY);
      setLastOrder(null);
      setRevalidation(null);
    } catch (e) {
      console.error('Error limpiando último pedido de localStorage:', e);
    }
  }, []);

  return {
    hasLastOrder: lastOrder !== null,
    lastOrder,
    revalidation,
    saveLastOrder,
    clearLastOrder,
  };
}
