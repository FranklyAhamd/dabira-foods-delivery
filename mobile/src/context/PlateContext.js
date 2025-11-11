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
  const [currentPlate, setCurrentPlate] = useState(null); // { id, items: [{ menuItem, portions }], plateNumber }
  const [plateNumber, setPlateNumber] = useState(1); // Track plate numbers

  // Calculate total portions for takeaway items in a plate
  const getTakeawayPortionsTotal = (items) => {
    return items.reduce((total, item) => {
      // Check if item's category is takeaway and has maxPortionsPerTakeaway
      if (item.menuItem.maxPortionsPerTakeaway) {
        return total + item.portions;
      }
      return total;
    }, 0);
  };

  // Check if adding this item would exceed takeaway limit
  const wouldExceedTakeawayLimit = (plate, menuItem, portions) => {
    if (!menuItem.maxPortionsPerTakeaway) return false;
    
    const currentTakeawayPortions = getTakeawayPortionsTotal(plate.items);
    // Use >= to prevent exceeding the limit (if limit is 6, 6 is the max, 7 would exceed)
    return (currentTakeawayPortions + portions) > menuItem.maxPortionsPerTakeaway;
  };

  // Check if updating portions of an existing item would exceed takeaway limit
  const wouldExceedTakeawayLimitOnUpdate = (plate, menuItemId, newPortions) => {
    // Find the item being updated
    const itemBeingUpdated = plate.items.find(item => item.menuItem.id === menuItemId);
    if (!itemBeingUpdated || !itemBeingUpdated.menuItem.maxPortionsPerTakeaway) {
      return false; // Not a takeaway item, no limit
    }

    // Calculate current total portions of all takeaway items
    const currentTakeawayPortions = getTakeawayPortionsTotal(plate.items);
    // Subtract the old portions of the item being updated
    const otherTakeawayPortions = currentTakeawayPortions - itemBeingUpdated.portions;
    // Add the new portions
    const newTotal = otherTakeawayPortions + newPortions;
    
    // Check if new total would exceed the limit
    return newTotal > itemBeingUpdated.menuItem.maxPortionsPerTakeaway;
  };

  // Create a new plate with first item
  const createPlate = (menuItem, portions) => {
    // If this is a takeaway item, ensure portions don't exceed the limit
    let finalPortions = portions;
    if (menuItem.maxPortionsPerTakeaway && portions > menuItem.maxPortionsPerTakeaway) {
      finalPortions = menuItem.maxPortionsPerTakeaway;
    }

    const plateId = Date.now().toString();
    const newPlate = {
      id: plateId,
      items: [
        {
          menuItem: { ...menuItem },
          portions: finalPortions
        }
      ],
      plateNumber: plateNumber,
      createdAt: new Date().toISOString()
    };
    setCurrentPlate(newPlate);
    return newPlate;
  };

  // Add item to current plate (returns info about whether a new plate was created)
  const addItemToPlate = (menuItem, portions) => {
    if (!currentPlate) {
      return { plate: createPlate(menuItem, portions), newPlateCreated: false };
    }

    // Check if adding this item would exceed takeaway limit
    if (wouldExceedTakeawayLimit(currentPlate, menuItem, portions)) {
      // Create a new plate
      const newPlateNum = plateNumber + 1;
      setPlateNumber(newPlateNum);
      const newPlateId = Date.now().toString();
      const newPlate = {
        id: newPlateId,
        items: [
          {
            menuItem: { ...menuItem },
            portions: portions
          }
        ],
        plateNumber: newPlateNum,
        createdAt: new Date().toISOString()
      };
      setCurrentPlate(newPlate);
      return { plate: newPlate, newPlateCreated: true, filledPlateNumber: currentPlate.plateNumber || 1 };
    }

    // Add to existing plate
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
    return { plate: currentPlate, newPlateCreated: false };
  };

  // Remove item from current plate
  const removeItemFromPlate = (menuItemId) => {
    if (!currentPlate) return;

    setCurrentPlate(prevPlate => ({
      ...prevPlate,
      items: prevPlate.items.filter(item => item.menuItem.id !== menuItemId)
    }));
  };

  // Update portions for an item in the plate (returns info about whether limit was exceeded)
  const updateItemPortions = (menuItemId, portions) => {
    if (!currentPlate) return { success: false, limitExceeded: false };

    // Check if updating would exceed takeaway limit
    if (wouldExceedTakeawayLimitOnUpdate(currentPlate, menuItemId, portions)) {
      // Find the item to get its maxPortionsPerTakeaway
      const item = currentPlate.items.find(item => item.menuItem.id === menuItemId);
      if (item && item.menuItem.maxPortionsPerTakeaway) {
        // Cap the portions at the maximum allowed
        const maxPortions = item.menuItem.maxPortionsPerTakeaway;
        const currentTakeawayPortions = getTakeawayPortionsTotal(currentPlate.items);
        const otherTakeawayPortions = currentTakeawayPortions - item.portions;
        const maxAllowedForThisItem = maxPortions - otherTakeawayPortions;
        
        // If maxAllowedForThisItem is <= 0, the plate is already full with other items
        if (maxAllowedForThisItem <= 0) {
          return { 
            success: false, 
            limitExceeded: true, 
            message: `Plate ${currentPlate.plateNumber || 1} is full. Maximum ${maxPortions} portions allowed.` 
          };
        }
        
        // Cap at the maximum allowed
        portions = maxAllowedForThisItem;
      }
    }

    setCurrentPlate(prevPlate => ({
      ...prevPlate,
      items: prevPlate.items.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, portions }
          : item
      )
    }));

    return { success: true, limitExceeded: false };
  };

  // Load an existing plate (e.g., from cart for editing)
  const loadPlate = (plate) => {
    if (!plate || !plate.items || plate.items.length === 0) {
      console.warn('Cannot load empty or invalid plate');
      return;
    }
    // Restore plate number if it exists
    const plateNum = plate.plateNumber || 1;
    setPlateNumber(plateNum);
    setCurrentPlate({ ...plate, plateNumber: plateNum });
    return plate;
  };

  // Clear current plate
  const clearPlate = () => {
    setCurrentPlate(null);
    // Reset plate number when clearing (optional - you might want to keep incrementing)
    // setPlateNumber(1);
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
    loadPlate, // New - load existing plate for editing
    clearPlate,
    getPlateTotal,
    plateNumber, // Expose current plate number
    wouldExceedTakeawayLimitOnUpdate // Expose for use in components
  };

  return <PlateContext.Provider value={value}>{children}</PlateContext.Provider>;
};

export default PlateContext;

