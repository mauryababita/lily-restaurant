import React, { createContext, useContext, useState, useCallback } from 'react';
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [toast, setToast] = useState(null);
  const [cart, setCart] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const addToCart = useCallback(
    (item) => {
      setCart((prevCart) => {
        const existing = prevCart.find((c) => c._id === item._id);
        if (existing) {
          return prevCart.map((c) =>
            c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
          );
        }
        return [...prevCart, { ...item, quantity: 1 }];
      });
      showToast(`${item.name} added to cart`, 'success');
    },
    [showToast]
  );

  const removeFromCart = useCallback((id) => {
    setCart((prevCart) => prevCart.filter((c) => c._id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setCart((prevCart) =>
      quantity <= 0
        ? prevCart.filter((c) => c._id !== id)
        : prevCart.map((c) => (c._id === id ? { ...c, quantity } : c))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeSection,
        setActiveSection,
        toast,
        showToast,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useApp = () => useContext(AppContext);
