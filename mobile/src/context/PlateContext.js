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
  const [filledPlates, setFilledPlates] = useState([]); // Track plates that have been filled and need to be added to cart

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

  // Get the shared maxPortionsPerTakeaway from existing takeaway items in the plate
  // All takeaway items should share the same max capacity
  const getPlateMaxPortions = (plate, newMenuItem = null) => {
    // First, try to get max from existing takeaway items in the plate
    const existingTakeawayItem = plate.items.find(item => item.menuItem.maxPortionsPerTakeaway);
    if (existingTakeawayItem) {
      return existingTakeawayItem.menuItem.maxPortionsPerTakeaway;
    }
    // If no existing takeaway items, use the new item's max (if it's a takeaway item)
    if (newMenuItem && newMenuItem.maxPortionsPerTakeaway) {
      return newMenuItem.maxPortionsPerTakeaway;
    }
    return null; // Not a takeaway plate
  };

  // Check if the current plate is at maximum capacity
  const isPlateAtMaxCapacity = (plate) => {
    if (!plate || !plate.items || plate.items.length === 0) {
      return false;
    }
    
    const plateMaxPortions = getPlateMaxPortions(plate);
    if (!plateMaxPortions) {
      return false; // Not a takeaway plate, no max capacity
    }
    
    const currentTakeawayPortions = getTakeawayPortionsTotal(plate.items);
    return currentTakeawayPortions >= plateMaxPortions;
  };

  // Check if adding this item would exceed takeaway limit
  const wouldExceedTakeawayLimit = (plate, menuItem, portions) => {
    // If the new item is not a takeaway item, no limit check needed
    if (!menuItem.maxPortionsPerTakeaway) return false;
    
    // Get the shared max capacity for this plate
    const plateMaxPortions = getPlateMaxPortions(plate, menuItem);
    if (!plateMaxPortions) return false;
    
    const currentTakeawayPortions = getTakeawayPortionsTotal(plate.items);
    // Check if adding new portions would exceed the plate's shared max capacity
    return (currentTakeawayPortions + portions) > plateMaxPortions;
  };

  // Check if updating portions of an existing item would exceed takeaway limit
  const wouldExceedTakeawayLimitOnUpdate = (plate, menuItemId, newPortions) => {
    // Find the item being updated
    const itemBeingUpdated = plate.items.find(item => item.menuItem.id === menuItemId);
    if (!itemBeingUpdated || !itemBeingUpdated.menuItem.maxPortionsPerTakeaway) {
      return false; // Not a takeaway item, no limit
    }

    // Get the shared max capacity for this plate
    const plateMaxPortions = getPlateMaxPortions(plate);
    if (!plateMaxPortions) return false;

    // Calculate current total portions of all takeaway items
    const currentTakeawayPortions = getTakeawayPortionsTotal(plate.items);
    // Subtract the old portions of the item being updated
    const otherTakeawayPortions = currentTakeawayPortions - itemBeingUpdated.portions;
    // Add the new portions
    const newTotal = otherTakeawayPortions + newPortions;
    
    // Check if new total would exceed the plate's shared max capacity
    return newTotal > plateMaxPortions;
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

  // Add item to current plate (returns info about whether a new plate was created or needed)
  const addItemToPlate = (menuItem, portions, forceNewPlate = false) => {
    if (!currentPlate) {
      return { plate: createPlate(menuItem, portions), newPlateCreated: false, needsNewPlate: false };
    }

    // Check if adding this item would exceed takeaway limit
    if (wouldExceedTakeawayLimit(currentPlate, menuItem, portions)) {
      // Automatically save the filled plate and create a new one (no alert, no confirmation)
      const filledPlate = { ...currentPlate };
      setFilledPlates(prev => [...prev, filledPlate]);
      
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
      return { plate: newPlate, newPlateCreated: true, filledPlateNumber: filledPlate.plateNumber || 1, needsNewPlate: false };
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
    return { plate: currentPlate, newPlateCreated: false, needsNewPlate: false };
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
        // Get the shared max capacity for this plate
        const plateMaxPortions = getPlateMaxPortions(currentPlate);
        if (plateMaxPortions) {
          const currentTakeawayPortions = getTakeawayPortionsTotal(currentPlate.items);
          const otherTakeawayPortions = currentTakeawayPortions - item.portions;
          const maxAllowedForThisItem = plateMaxPortions - otherTakeawayPortions;
          
          // If maxAllowedForThisItem is <= 0, the plate is already full with other items
          if (maxAllowedForThisItem <= 0) {
            return { 
              success: false, 
              limitExceeded: true, 
              message: `Plate ${currentPlate.plateNumber || 1} is full. Maximum ${plateMaxPortions} portions allowed per takeaway plate.` 
            };
          }
          
          // Cap at the maximum allowed
          portions = maxAllowedForThisItem;
        }
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
    setFilledPlates([]); // Also clear filled plates when clearing
    // Reset plate number when clearing (optional - you might want to keep incrementing)
    // setPlateNumber(1);
  };
  
  // Clear filled plates (after adding to cart)
  const clearFilledPlates = () => {
    setFilledPlates([]);
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
    wouldExceedTakeawayLimitOnUpdate, // Expose for use in components
    getPlateMaxPortions, // Expose for use in components
    isPlateAtMaxCapacity, // Expose for use in components
    filledPlates, // Expose filled plates array
    clearFilledPlates // Expose function to clear filled plates
  };

  return <PlateContext.Provider value={value}>{children}</PlateContext.Provider>;
};

export default PlateContext;

