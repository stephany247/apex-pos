import { Product, Customer, Transaction, User } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Cotton T-Shirt', category: 'Clothing', price: 25.00, cost: 8.00, stock: 120, sku: 'TSH-001', lowStockThreshold: 20, lastUpdated: '2023-10-20T10:00:00.000Z' },
  { id: '2', name: 'Wireless Noise Cancelling Headphones', category: 'Electronics', price: 299.99, cost: 150.00, stock: 15, sku: 'AUD-005', lowStockThreshold: 5, lastUpdated: '2023-10-21T14:30:00.000Z' },
  { id: '3', name: 'Organic Coffee Beans (1lb)', category: 'Groceries', price: 18.50, cost: 9.00, stock: 45, sku: 'GRO-102', lowStockThreshold: 10, lastUpdated: '2023-10-22T09:15:00.000Z' },
  { id: '4', name: 'Smart Fitness Watch', category: 'Electronics', price: 149.00, cost: 80.00, stock: 8, sku: 'WTC-009', lowStockThreshold: 10, lastUpdated: '2023-10-23T11:20:00.000Z' },
  { id: '5', name: 'Ceramic Vase Set', category: 'Home', price: 45.00, cost: 15.00, stock: 32, sku: 'HOM-221', lowStockThreshold: 8, lastUpdated: '2023-10-20T16:45:00.000Z' },
  { id: '6', name: 'Aloe Vera Moisturizer', category: 'Beauty', price: 22.00, cost: 6.50, stock: 65, sku: 'BEA-011', lowStockThreshold: 15, lastUpdated: '2023-10-24T13:10:00.000Z' },
  { id: '7', name: 'Slim Fit Jeans', category: 'Clothing', price: 55.00, cost: 20.00, stock: 40, sku: 'JNS-003', lowStockThreshold: 12, lastUpdated: '2023-10-22T10:05:00.000Z' },
  { id: '8', name: 'Mechanical Keyboard', category: 'Electronics', price: 120.00, cost: 70.00, stock: 22, sku: 'KEY-099', lowStockThreshold: 10, lastUpdated: '2023-10-25T09:30:00.000Z' },
  { id: '9', name: 'Bluetooth Speaker', category: 'Electronics', price: 65.00, cost: 30.00, stock: 5, sku: 'SPK-101', lowStockThreshold: 10, lastUpdated: '2023-10-21T15:20:00.000Z' },
  { id: '10', name: 'Running Sneakers', category: 'Clothing', price: 89.99, cost: 35.00, stock: 28, sku: 'SHS-555', lowStockThreshold: 15, lastUpdated: '2023-10-23T12:00:00.000Z' },
  { id: '11', name: 'Almond Milk (1L)', category: 'Groceries', price: 4.50, cost: 2.00, stock: 150, sku: 'GRO-501', lowStockThreshold: 30, lastUpdated: '2023-10-25T08:45:00.000Z' },
  { id: '12', name: 'LED Desk Lamp', category: 'Home', price: 35.00, cost: 12.00, stock: 44, sku: 'LMP-303', lowStockThreshold: 10, lastUpdated: '2023-10-24T17:30:00.000Z' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', loyaltyPoints: 1250, totalSpent: 450.00, lastVisit: '2023-10-15' },
  { id: 'c2', name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', loyaltyPoints: 80, totalSpent: 120.50, lastVisit: '2023-10-20' },
  { id: 'c3', name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-0103', loyaltyPoints: 450, totalSpent: 890.00, lastVisit: '2023-10-22' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  // Generated mock transactions for charts
  { id: 't1', items: [], subtotal: 120, tax: 12, discount: 0, total: 132, paymentMethod: 'Debit Card', timestamp: '2023-10-20T10:30:00', cashierId: 'u1' },
  { id: 't2', items: [], subtotal: 45, tax: 4.5, discount: 5, total: 44.5, paymentMethod: 'Cash', timestamp: '2023-10-20T11:15:00', cashierId: 'u1' },
  { id: 't3', items: [], subtotal: 299, tax: 29.9, discount: 0, total: 328.9, paymentMethod: 'Transfer', timestamp: '2023-10-21T09:45:00', cashierId: 'u2' },
  { id: 't4', items: [], subtotal: 65, tax: 6.5, discount: 0, total: 71.5, paymentMethod: 'Debit Card', timestamp: '2023-10-21T14:20:00', cashierId: 'u1' },
  { id: 't5', items: [], subtotal: 150, tax: 15, discount: 10, total: 155, paymentMethod: 'Debit Card', timestamp: '2023-10-22T16:00:00', cashierId: 'u2' },
];

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Sales',
  email: 'alex@apex.com',
  role: 'manager'
};

export const BASE_URL = "https://inventory-hackathon-backend.onrender.com/api";
