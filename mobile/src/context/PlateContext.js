import React, { createContext, useState, useContext } from 'react';

const PlateContext = createContext(undefined);

export const usePlate = () => {
  const context = useContext(PlateContext);
  if (!context) {
    throw new Error('usePlate must be used within a PlateProvider');
  }
  return context;
};

export const PlateProvider = ({ children }) => {
  const [currentPlate, setCurrentPlate] = useState(null); // { id, items: [{ menuItem, portions }] }

  // Create a new plate with first item
  const createPlate = (menuItem, portions) => {
    const plateId = Date.now().toString();
    const newPlate = {
      id: plateId,
      items: [
        {
          menuItem: { ...menuItem },
          portions: portions
        }
      ],
      createdAt: new Date().toISOString()
    };
    setCurrentPlate(newPlate);
    return newPlate;
  };

  // Add item to current plate
  const addItemToPlate = (menuItem, portions) => {
    if (!currentPlate) {
      return createPlate(menuItem, portions);
    }

    setCurrentPlate(prevPlate => ({
      ...prevPlate,
      items: [
        ...prevPlate.items,
        {
          menuItem: { ...menuItem },
          portions: portions
        }
      ]
    }));
    return currentPlate;
  };

  // Remove item from current plate
  const removeItemFromPlate = (menuItemId) => {
    if (!currentPlate) return;

    setCurrentPlate(prevPlate => ({
      ...prevPlate,
      items: prevPlate.items.filter(item => item.menuItem.id !== menuItemId)
    }));
  };

  // Update portions for an item in the plate
  const updateItemPortions = (menuItemId, portions) => {
    if (!currentPlate) return;

    setCurrentPlate(prevPlate => ({
      ...prevPlate,
      items: prevPlate.items.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, portions }
          : item
      )
    }));
  };

  // Clear current plate
  const clearPlate = () => {
    setCurrentPlate(null);
  };

  // Calculate plate total price
  const getPlateTotal = () => {
    if (!currentPlate) return 0;
    return currentPlate.items.reduce(
      (total, item) => total + (item.menuItem.price * item.portions),
      0
    );
  };

  const value = {
    currentPlate,
    createPlate,
    addItemToPlate,
    removeItemFromPlate,
    updateItemPortions,
    clearPlate,
    getPlateTotal
  };

  return <PlateContext.Provider value={value}>{children}</PlateContext.Provider>;
};

export default PlateContext;

