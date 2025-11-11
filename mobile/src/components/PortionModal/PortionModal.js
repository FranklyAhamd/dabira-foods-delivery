import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';

const PortionModal = ({ isOpen, onClose, menuItem, onConfirm, isDeliveryOpen }) => {
  const [portions, setPortions] = useState(1);

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

  const handleIncrement = () => {
    setPortions(prev => {
      // If menuItem has maxPortionsPerTakeaway, don't allow exceeding it
      if (menuItem.maxPortionsPerTakeaway && prev >= menuItem.maxPortionsPerTakeaway) {
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
    // If menuItem has maxPortionsPerTakeaway, cap at that value
    if (menuItem.maxPortionsPerTakeaway && value > menuItem.maxPortionsPerTakeaway) {
      value = menuItem.maxPortionsPerTakeaway;
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
              max={menuItem.maxPortionsPerTakeaway || undefined}
              value={String(portions || 1)}
              onChange={handleInputChange}
            />
            <PortionButton 
              onClick={handleIncrement}
              disabled={menuItem.maxPortionsPerTakeaway && portions >= menuItem.maxPortionsPerTakeaway}
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

        {menuItem.maxPortionsPerTakeaway && portions >= menuItem.maxPortionsPerTakeaway && (
          <WarningText style={{ color: '#10b981', marginBottom: '0.5rem' }}>
            Maximum {menuItem.maxPortionsPerTakeaway} portions per takeaway plate. Adding more will create a new plate.
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
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 340px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);

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
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 10px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: #4b5563;
  transition: all 0.2s;
  
  &:active {
    background: rgba(0, 0, 0, 0.1);
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
  color: #1a1a1a;
  margin-bottom: 0.375rem;
  line-height: 1.3;
`;

const ItemDescription = styled.p`
  font-size: 0.8125rem;
  color: #666;
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
  color: #333;
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
    background: #e5e7eb;
  }
`;

const PortionInput = styled.input`
  width: 70px;
  height: 40px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #1a1a1a;
  background: #f8f9fa;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  margin: 0 1.25rem 1rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
`;

const TotalLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #4b5563;
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

