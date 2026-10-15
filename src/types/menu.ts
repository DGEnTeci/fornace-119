export type BadgeType = 'masa-madre' | 'dop' | 'vegetariana' | 'de-autor' | 'picante';

export interface MenuOption {
  id: string;
  name: string;
  priceCOP: number;
}

export interface MenuItem {
  id: string;
  categoryId: 'tradizionali' | 'autore' | 'antipasti' | 'dolci' | 'bevande';
  name: string;
  italianName?: string;
  description: string;
  priceCOP: number;
  imageUrl: string;
  badges: BadgeType[];
  availableOptions?: MenuOption[];
  isAlcoholic?: boolean;
}

export interface MenuCategory {
  id: 'tradizionali' | 'autore' | 'antipasti' | 'dolci' | 'bevande';
  name: string;
  subtitle: string;
  iconName: string;
}

export interface MenuData {
  categories: MenuCategory[];
  items: MenuItem[];
}
