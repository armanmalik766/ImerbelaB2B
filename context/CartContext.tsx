import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, CartItem } from '../types';
import { getBulkPrice } from '../constants';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  totalMrp: number;
  addToCart: (product: Product, quantity: number) => { success: boolean; message: string };
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  validateCart: () => { valid: boolean; errors: string[] };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback(
    (product: Product, quantity: number): { success: boolean; message: string } => {
      // MOQ validation
      if (quantity < product.moq) {
        return {
          success: false,
          message: `Minimum order quantity is ${product.moq} units`,
        };
      }

      const unitPrice = getBulkPrice(product, quantity);

      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.product._id === product._id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            product,
            quantity,
            unitPrice,
            totalPrice: unitPrice * quantity,
          };
          return updated;
        }
        return [
          ...prev,
          {
            product,
            quantity,
            unitPrice,
            totalPrice: unitPrice * quantity,
          },
        ];
      });

      return { success: true, message: 'Added to cart' };
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number): { success: boolean; message: string } => {
      const item = items.find((i) => i.product._id === productId);
      if (!item) return { success: false, message: 'Item not in cart' };

      if (quantity < item.product.moq) {
        return {
          success: false,
          message: `Minimum order quantity is ${item.product.moq} units`,
        };
      }

      const unitPrice = getBulkPrice(item.product, quantity);

      setItems((prev) =>
        prev.map((i) =>
          i.product._id === productId
            ? { ...i, quantity, unitPrice, totalPrice: unitPrice * quantity }
            : i
        )
      );

      return { success: true, message: 'Quantity updated' };
    },
    [items]
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = items.find((i) => i.product._id === productId);
      return item ? item.quantity : 0;
    },
    [items]
  );

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.product._id === productId),
    [items]
  );

  const validateCart = useCallback((): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    for (const item of items) {
      if (item.quantity < item.product.moq) {
        errors.push(
          `${item.product.title}: Minimum order quantity is ${item.product.moq} units`
        );
      }
    }
    return { valid: errors.length === 0, errors };
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalMrp = items.reduce((sum, item) => sum + ((item.product.mrpPerUnit || 0) * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        totalMrp,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        isInCart,
        validateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
