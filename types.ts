export type ProductCategory = 'Electronics' | 'Clothing' | 'Groceries' | 'Home' | 'Beauty';

export interface Product {
  _id: string;
  name: string;
  category: ProductCategory;
  price: number;
  cost: number;
  quantity: number;
  sku: string;
  barcode?: string;
  lowStockAlert: number;
  lastUpdated?: string;
}

export interface CartItem extends Product {
  cartId: string;
  // quantity: number;
  discount?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  totalSpent: number;
  lastVisit: string;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment: 'cash' | 'card' | 'transfer';
  timestamp: string;
  cashierId: string;
  customerId?: string;
}

export type ViewState = 'pos' | 'inventory' | 'history' | 'reports' | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
}

export type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  businessAddress: string;
};