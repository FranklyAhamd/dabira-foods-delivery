import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { usePlate } from '../../context/PlateContext';

const PortionModal = ({ isOpen, onClose, menuItem, onConfirm, isDeliveryOpen }) => {
  const [portions, setPortions] = useState(1);
  const { currentPlate, getPlateMaxPortions } = usePlate();

  // Reset portions when modal opens/closes or menuItem changes
  React.useEffect(() => {
    if (isOpen && menuItem) {
      setPortions(1);
    }
  }, [isOpen, menuItem]);

  if (!isOpen || !menuItem) return null;

  const handleConfirm = () => {
    if (portions > 0) {
      onConfirm(menuItem, portions);
      setPortions(1);
      // Always close the modal after adding
      onClose();
    }
  };

  // Calculate the maximum portions that can be added based on plate capacity
  const getMaxAllowedPortions = () => {
    if (!menuItem.maxPortionsPerTakeaway) {
      return null; // No limit for non-takeaway items
    }

    // If there's an existing plate, check remaining capacity
    if (currentPlate && currentPlate.items.length > 0) {
      const plateMaxPortions = getPlateMaxPortions(currentPlate, menuItem);
      if (plateMaxPortions) {
        // Calculate current takeaway portions in the plate
        const currentTakeawayPortions = currentPlate.items.reduce((total, item) => {
          if (item.menuItem.maxPortionsPerTakeaway) {
            return total + item.portions;
          }
          return total;
        }, 0);
        
        // Calculate remaining capacity
        const remainingCapacity = plateMaxPortions - currentTakeawayPortions;
        // Return the minimum of item's max and remaining capacity
        return Math.min(menuItem.maxPortionsPerTakeaway, Math.max(0, remainingCapacity));
      }
    }

    // If no existing plate or not a takeaway plate, use item's max
    return menuItem.maxPortionsPerTakeaway;
  };

  const maxAllowedPortions = getMaxAllowedPortions();

  const handleIncrement = () => {
    setPortions(prev => {
      // Check against the calculated max (considering plate capacity)
      if (maxAllowedPortions !== null && prev >= maxAllowedPortions) {
        return prev; // Don't increment if already at or above max
      }
      return prev + 1;
    });
  };

  const handleDecrement = () => {
    setPortions(prev => Math.max(1, prev - 1));
  };

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value) || 1;
    // Enforce minimum of 1
    value = Math.max(1, value);
    // Cap at the calculated max (considering plate capacity)
    if (maxAllowedPortions !== null && value > maxAllowedPortions) {
      value = maxAllowedPortions;
    }
    setPortions(value);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FiX size={24} />
        </CloseButton>

        <ItemImage
          src={menuItem.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#999" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>'}
          alt={menuItem.name}
        />

        <ItemInfo>
          <ItemName>{menuItem.name}</ItemName>
          <ItemDescription>{menuItem.description}</ItemDescription>
          <ItemPrice>₦{menuItem.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per portion</ItemPrice>
        </ItemInfo>

        <PortionSection>
          <PortionLabel>How many portions or scoops?</PortionLabel>
          <PortionControls>
            <PortionButton onClick={handleDecrement} disabled={portions <= 1}>
              −
            </PortionButton>
            <PortionInput
              type="number"
              min="1"
              max={maxAllowedPortions || undefined}
              value={String(portions || 1)}
              onChange={handleInputChange}
            />
            <PortionButton 
              onClick={handleIncrement}
              disabled={maxAllowedPortions !== null && portions >= maxAllowedPortions}
            >
              +
            </PortionButton>
          </PortionControls>
        </PortionSection>

        <TotalSection>
          <TotalLabel>Total:</TotalLabel>
          <TotalValue>
            ₦{(menuItem.price * portions).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </TotalValue>
        </TotalSection>

        {maxAllowedPortions !== null && portions >= maxAllowedPortions && (
          <WarningText style={{ color: '#10b981', marginBottom: '0.5rem' }}>
            {currentPlate && currentPlate.items.length > 0 
              ? `Plate is full! Maximum ${getPlateMaxPortions(currentPlate, menuItem) || menuItem.maxPortionsPerTakeaway} portions allowed per takeaway plate. Adding more will create a new plate.`
              : `Maximum ${menuItem.maxPortionsPerTakeaway} portions per takeaway plate. Adding more will create a new plate.`
            }
          </WarningText>
        )}

        {!isDeliveryOpen && (
          <WarningText>Delivery is currently closed</WarningText>
        )}

        <ConfirmButton onClick={handleConfirm} disabled={!isDeliveryOpen || !menuItem.available}>
          {!isDeliveryOpen ? 'Delivery Closed' : !menuItem.available ? 'Unavailable' : 'Add to Plate'}
        </ConfirmButton>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  width: 100%;
  max-width: 340px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #2a2a2a;

  @keyframes slideUp {
    from {
      transform: translateY(20px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 10px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: #b3b3b3;
  transition: all 0.2s;
  
  &:active {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.95);
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
`;

const ItemInfo = styled.div`
  padding: 1rem 1.25rem;
  text-align: center;
`;

const ItemName = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.375rem;
  line-height: 1.3;
`;

const ItemDescription = styled.p`
  font-size: 0.8125rem;
  color: #b3b3b3;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ItemPrice = styled.div`
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #667eea;
  letter-spacing: 0.01em;
`;

const PortionSection = styled.div`
  padding: 0 1.25rem 1rem;
`;

const PortionLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.75rem;
  text-align: center;
`;

const PortionControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const PortionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active:not(:disabled) {
    transform: scale(0.92);
    box-shadow: 0 1px 4px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #2a2a2a;
  }
`;

const PortionInput = styled.input`
  width: 70px;
  height: 40px;
  border: 2px solid #2a2a2a;
  border-radius: 10px;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #ffffff;
  background: #121212;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    background: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
  margin: 0 1.25rem 1rem;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
`;

const TotalLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #b3b3b3;
`;

const TotalValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.02em;
`;

const WarningText = styled.div`
  text-align: center;
  color: #ef4444;
  font-size: 0.8125rem;
  margin-bottom: 0.75rem;
  padding: 0 1.25rem;
  font-weight: 500;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  padding: 0.5rem;
  margin: 0 1.25rem 0.75rem;
`;

const ConfirmButton = styled.button`
  width: calc(100% - 2.5rem);
  margin: 0 1.25rem 1.25rem;
  background: ${props => props.disabled 
    ? '#d1d5db' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  padding: 0.875rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  border: none;
  box-shadow: ${props => props.disabled 
    ? 'none' 
    : '0 4px 12px rgba(102, 126, 234, 0.35)'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.01em;
  
  &:active:not(:disabled) {
    transform: scale(0.97);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default PortionModal;

