import { MenuItem, MenuOption } from './menu';

export type DeliveryType = 'delivery' | 'takeaway';

export interface CartItem {
  id: string; // unique cart line id (combines itemId + options)
  item: MenuItem;
  quantity: number;
  selectedOptions: MenuOption[];
  notes?: string;
  unitPriceCOP: number;
  totalPriceCOP: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  deliveryType: DeliveryType;
  address?: string; // required if deliveryType === 'delivery'
  notes?: string;
  paymentMethod: string;
}

export interface CartState {
  items: CartItem[];
  subtotalCOP: number;
  deliveryFeeCOP: number;
  totalCOP: number;
  itemCount: number;
  isEligibleForFreeShipping: boolean;
  amountNeededForFreeShippingCOP: number;
}

export interface StoredOrder {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotalCOP: number;
  deliveryFeeCOP: number;
  totalCOP: number;
}
