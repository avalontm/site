import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './interfaces/Product';  // Asegúrate de que 'Product' sea la interfaz correcta

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC = ({ children }) => {
  const [cart, setCart] = useState<Product[]>(() => {
    // Cargar productos desde el almacenamiento local
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    // Guardar el carrito en el almacenamiento local
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Función para agregar un producto al carrito
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.uuid === product.uuid);

      if (existingProductIndex !== -1) {
        // Si el producto ya existe en el carrito, incrementamos su cantidad
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].cantidad += 1;
        return updatedCart;
      } else {
        // Si el producto no existe, lo añadimos al carrito
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

   // Función para actualizar la cantidad de un producto
   const updateQuantity = (productId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productId);  // Si la cantidad es 0 o menos, eliminamos el producto
    } else {
      setCart((prevCart) => {
        const updatedCart = prevCart.map((item) =>
          item.uuid === productId ? { ...item, cantidad } : item
        );
        return updatedCart;
      });
    }
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.uuid !== productId));
  };

  // Función para limpiar el carrito
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
