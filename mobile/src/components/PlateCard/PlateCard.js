import React from 'react';
import styled from 'styled-components';
import { FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { usePlate } from '../../context/PlateContext';
import { useCart } from '../../context/CartContext';

const PlateCard = ({ onAddMoreClick, isDeliveryOpen }) => {
  const { currentPlate, removeItemFromPlate, updateItemPortions, clearPlate, getPlateTotal } = usePlate();
  const { addPlateToCart } = useCart();

  if (!currentPlate || currentPlate.items.length === 0) {
    return null;
  }

  const handleAddToCart = () => {
    if (!isDeliveryOpen) return;
    addPlateToCart(currentPlate);
    clearPlate();
  };

  const handleRemoveItem = (menuItemId) => {
    removeItemFromPlate(menuItemId);
  };

  const handleUpdatePortions = (menuItemId, newPortions) => {
    if (newPortions > 0) {
      updateItemPortions(menuItemId, newPortions);
    } else {
      handleRemoveItem(menuItemId);
    }
  };

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>Your Plate</CardTitle>
        <ClearButton onClick={clearPlate}>Clear</ClearButton>
      </CardHeader>

      <ItemsList>
        {currentPlate.items.map((item) => (
          <PlateItem key={item.menuItem.id}>
            <ItemImage
              src={item.menuItem.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="#f0f0f0"/></svg>'}
              alt={item.menuItem.name}
            />
            <ItemDetails>
              <ItemName>{item.menuItem.name}</ItemName>
              <ItemInfo>
                <PortionControls>
                  <PortionButton
                    onClick={() => handleUpdatePortions(item.menuItem.id, item.portions - 1)}
                  >
                    −
                  </PortionButton>
                  <PortionValue>{item.portions} {item.portions === 1 ? 'portion' : 'portions'}</PortionValue>
                  <PortionButton
                    onClick={() => handleUpdatePortions(item.menuItem.id, item.portions + 1)}
                  >
                    +
                  </PortionButton>
                </PortionControls>
                <ItemPrice>
                  ₦{(item.menuItem.price * item.portions).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </ItemPrice>
              </ItemInfo>
            </ItemDetails>
            <RemoveButton onClick={() => handleRemoveItem(item.menuItem.id)}>
              <FiTrash2 size={18} />
            </RemoveButton>
          </PlateItem>
        ))}
      </ItemsList>

      <CardFooter>
        <TotalSection>
          <TotalLabel>Plate Total:</TotalLabel>
          <TotalValue>
            ₦{getPlateTotal().toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </TotalValue>
        </TotalSection>

        <ActionButtons>
          <AddMoreButton onClick={onAddMoreClick}>
            <FiPlus size={18} />
            Add More
          </AddMoreButton>
          <AddToCartButton onClick={handleAddToCart} disabled={!isDeliveryOpen}>
            <FiShoppingCart size={18} />
            Add Plate to Cart
          </AddToCartButton>
        </ActionButtons>
      </CardFooter>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  z-index: 100;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 600;
  
  &:active {
    opacity: 0.7;
  }
`;

const ItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
`;

const PlateItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ItemName = styled.h4`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #333;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PortionControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PortionButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f0f0f0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  
  &:active {
    background: #e0e0e0;
  }
`;

const PortionValue = styled.span`
  font-size: 0.875rem;
  color: #666;
  min-width: 80px;
`;

const ItemPrice = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #667eea;
  letter-spacing: 0.01em;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  padding: 0.5rem;
  
  &:active {
    opacity: 0.7;
  }
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
  background: #f8f9fa;
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 12px;
`;

const TotalLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const TotalValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #667eea;
  letter-spacing: 0.02em;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const AddMoreButton = styled.button`
  flex: 1;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.875rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:active {
    background: #f8f9fa;
  }
`;

const AddToCartButton = styled.button`
  flex: 2;
  background: ${props => props.disabled ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: ${props => props.disabled ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)'};
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default PlateCard;

