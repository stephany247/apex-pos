import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Transaction, Customer, User } from "../types";
import {
  MOCK_PRODUCTS,
  MOCK_CUSTOMERS,
  MOCK_TRANSACTIONS,
  CURRENT_USER,
} from "../constants";

interface StoreContextType {
  products: Product[];
  customers: Customer[];
  transactions: Transaction[];
  cart: CartItem[];
  currentUser: User | null;
  setUser: (user: User) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  getCartQty: (productId: string) => number;
  completeSale: (
    method: "Cash" | "Debit Card" | "Transfer",
    customerId?: string,
  ) => Transaction;
  updateProductStock: (
    productId: string,
    newStock: number,
    timestamp?: string,
  ) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  addCustomer: (customer: Customer) => void;
  clearTransactions: () => void;
  // Auth
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [transactions, setTransactions] =
    useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("apex_user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("apex_user");
      }
    }
  }, []);

  const setUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("apex_user", JSON.stringify(user));
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          ...product,
          cartId: Math.random().toString(36).substr(2, 9),
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setCart([]);

  const getCartQty = (productId: string) => {
    const item = cart.find((c) => c.productId === productId);
    return item ? item.quantity : 0;
  };

  const completeSale = (
    method: "Cash" | "Debit Card" | "Transfer",
    customerId?: string,
  ): Transaction => {
    if (!currentUser) throw new Error("User not authenticated");

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = 0;
    const total = subtotal + tax;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cart],
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod: method,
      timestamp: new Date().toISOString(),
      cashierId: currentUser.id,
      customerId,
    };

    // Update stock and lastUpdated
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.id === p.id);
        if (cartItem) {
          return {
            ...p,
            stock: p.stock - cartItem.quantity,
            lastUpdated: new Date().toISOString(),
          };
        }
        return p;
      }),
    );

    // Update customer history if attached
    if (customerId) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === customerId) {
            return {
              ...c,
              totalSpent: c.totalSpent + total,
              loyaltyPoints: c.loyaltyPoints + Math.floor(total),
              lastVisit: new Date().toISOString().split("T")[0],
            };
          }
          return c;
        }),
      );
    }

    setTransactions((prev) => [newTransaction, ...prev]);
    clearCart();
    return newTransaction;
  };

  const updateProductStock = (
    productId: string,
    newStock: number,
    timestamp?: string,
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: newStock,
              lastUpdated: timestamp || new Date().toISOString(),
            }
          : p,
      ),
    );
  };

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      _id: Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date().toISOString(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const addCustomer = (customer: Customer) => {
    setCustomers((prev) => [...prev, customer]);
  };

  const clearTransactions = () => {
    setTransactions([]);
  };

  // Auth Functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock Login Logic
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay

    // Allow any login for demo purposes if it's not empty
    if (email && password) {
      const user: User = {
        id: "u1",
        name: "Alex Sales",
        email: email,
        role: "manager",
      };
      setCurrentUser(user);
      localStorage.setItem("apex_user", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    // Mock Signup Logic
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (name && email && password) {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: "cashier", // Default new users to cashier
      };
      setCurrentUser(user);
      localStorage.setItem("apex_user", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("apex_user");
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        customers,
        transactions,
        cart,
        currentUser,
        setUser,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartQty,
        completeSale,
        updateProductStock,
        addProduct,
        addCustomer,
        clearTransactions,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
