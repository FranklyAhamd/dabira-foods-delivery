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
      onClose();
    }
  };

  const handleIncrement = () => {
    setPortions(prev => prev + 1);
  };

  const handleDecrement = () => {
    setPortions(prev => Math.max(1, prev - 1));
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setPortions(Math.max(1, value));
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
              value={String(portions || 1)}
              onChange={handleInputChange}
            />
            <PortionButton onClick={handleIncrement}>
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

        {!isDeliveryOpen && (
          <WarningText>Delivery is currently closed</WarningText>
        )}

        <ConfirmButton onClick={handleConfirm} disabled={!isDeliveryOpen || !menuItem.available}>
          {!isDeliveryOpen ? 'Delivery Closed' : !menuItem.available ? 'Unavailable' : 'Done'}
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
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: #333;
  
  &:active {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
`;

const ItemInfo = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const ItemName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ItemDescription = styled.p`
  font-size: 0.9375rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ItemPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #667eea;
  letter-spacing: 0.01em;
`;

const PortionSection = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

const PortionLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const PortionControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const PortionButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PortionInput = styled.input`
  width: 80px;
  height: 48px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  
  &:focus {
    outline: none;
    border-color: #667eea;
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
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  margin: 0 1.5rem 1.5rem;
  border-radius: 12px;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
`;

const TotalValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #667eea;
  letter-spacing: 0.02em;
`;

const WarningText = styled.div`
  text-align: center;
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0 1.5rem;
`;

const ConfirmButton = styled.button`
  width: calc(100% - 3rem);
  margin: 0 1.5rem 1.5rem;
  background: ${props => props.disabled 
    ? '#ccc' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 700;
  border: none;
  box-shadow: ${props => props.disabled 
    ? 'none' 
    : '0 4px 16px rgba(102, 126, 234, 0.4)'};
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default PortionModal;

