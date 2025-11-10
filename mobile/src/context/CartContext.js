import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Now stores plates instead of individual items
  const [loading, setLoading] = useState(true);

  // Load cart from storage when the app starts
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          // Validate and clean cart data
          if (Array.isArray(parsedCart)) {
            // Filter out invalid plates
            const validCart = parsedCart.filter(plate => 
              plate && 
              plate.items && 
              Array.isArray(plate.items) && 
              plate.items.length > 0
            );
            setCartItems(validCart);
          } else {
            // If old format, clear it
            setCartItems([]);
            localStorage.removeItem('cart');
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        // Clear corrupted cart data
        localStorage.removeItem('cart');
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }, [cartItems, loading]);

  // Add plate to cart (new flow)
  const addPlateToCart = (plate) => {
    if (!plate || !plate.items || plate.items.length === 0) {
      console.warn('Cannot add empty plate to cart');
      return;
    }

    setCartItems(prevItems => {
      return [...prevItems, { ...plate }];
    });
  };

  // Legacy: Add item to cart (kept for backward compatibility, but should use plates)
  const addToCart = (item, quantity = 1) => {
    // Prevent adding unavailable items
    if (!item.available) {
      console.warn('Cannot add unavailable item to cart:', item.name);
      return;
    }

    // Convert single item to a plate format for consistency
    const plate = {
      id: Date.now().toString(),
      items: [
        {
          menuItem: { ...item },
          portions: quantity
        }
      ],
      createdAt: new Date().toISOString()
    };

    addPlateToCart(plate);
  };

  // Update plate item portions
  const updatePlateItemPortions = (plateId, menuItemId, portions) => {
    if (portions <= 0) {
      removePlateItem(plateId, menuItemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(plate => {
        if (plate.id === plateId) {
          return {
            ...plate,
            items: plate.items.map(item =>
              item.menuItem.id === menuItemId
                ? { ...item, portions }
                : item
            )
          };
        }
        return plate;
      })
    );
  };

  // Remove item from plate
  const removePlateItem = (plateId, menuItemId) => {
    setCartItems(prevItems =>
      prevItems.map(plate => {
        if (plate.id === plateId) {
          const updatedItems = plate.items.filter(item => item.menuItem.id !== menuItemId);
          // If plate becomes empty, remove the entire plate
          if (updatedItems.length === 0) {
            return null;
          }
          return { ...plate, items: updatedItems };
        }
        return plate;
      }).filter(plate => plate !== null)
    );
  };

  // Remove entire plate from cart
  const removeFromCart = (plateId) => {
    setCartItems(prevItems => prevItems.filter(plate => plate.id !== plateId));
  };

  // Legacy: Update item quantity (for backward compatibility)
  const updateQuantity = (itemId, quantity) => {
    // This is now deprecated - should use updatePlateItemPortions instead
    console.warn('updateQuantity is deprecated. Use updatePlateItemPortions instead.');
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total price (now works with plates)
  const getTotalPrice = () => {
    if (!cartItems || !Array.isArray(cartItems)) {
      return 0;
    }
    return cartItems.reduce((total, plate) => {
      if (!plate || !plate.items || !Array.isArray(plate.items)) {
        return total;
      }
      const plateTotal = plate.items.reduce(
        (plateSum, item) => {
          if (!item || !item.menuItem || typeof item.menuItem.price !== 'number' || typeof item.portions !== 'number') {
            return plateSum;
          }
          return plateSum + (item.menuItem.price * item.portions);
        },
        0
      );
      return total + plateTotal;
    }, 0);
  };

  // Get total number of plates
  const getTotalPlates = () => {
    return cartItems.length;
  };

  // Get total number of items across all plates
  const getTotalItems = () => {
    if (!cartItems || !Array.isArray(cartItems)) {
      return 0;
    }
    return cartItems.reduce((total, plate) => {
      if (!plate || !plate.items || !Array.isArray(plate.items)) {
        return total;
      }
      return total + plate.items.reduce((sum, item) => {
        if (!item || typeof item.portions !== 'number') {
          return sum;
        }
        return sum + item.portions;
      }, 0);
    }, 0);
  };

  const value = {
    cartItems, // Now stores plates
    loading,
    addToCart, // Legacy - converts to plate
    addPlateToCart, // New - adds plate directly
    updateQuantity, // Legacy - deprecated
    updatePlateItemPortions, // New - updates portions in a plate
    removeFromCart, // Now removes entire plate
    removePlateItem, // New - removes item from plate
    clearCart,
    getTotalPrice,
    getTotalItems,
    getTotalPlates
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;

