import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiAlertTriangle, FiX, FiShoppingCart } from 'react-icons/fi';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 0.3s ease-out;
  position: relative;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  padding: 1.5rem;
  border-radius: 20px 20px 0 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  margin-bottom: 0.25rem;
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  opacity: 0.95;
  margin: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0.95);
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ItemsList = styled.div`
  margin-bottom: 1.5rem;
`;

const ItemCard = styled.div`
  background: #fff5f5;
  border: 2px solid #ffe0e0;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const ItemDetails = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  }
`;

const SecondaryButton = styled.button`
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:active {
    background: #f8f9fa;
    transform: scale(0.98);
  }
`;

const UnavailableItemsAlert = ({ 
  isOpen, 
  onClose, 
  unavailableItems, 
  onViewCart,
  onRemoveItems 
}) => {
  if (!isOpen || !unavailableItems || unavailableItems.length === 0) {
    return null;
  }

  const handleRemoveItems = () => {
    if (onRemoveItems) {
      onRemoveItems();
    }
    onClose();
  };

  const handleViewCart = () => {
    if (onViewCart) {
      onViewCart();
    }
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <IconContainer>
            <FiAlertTriangle size={24} />
          </IconContainer>
          <HeaderContent>
            <Title>Items No Longer Available</Title>
            <Subtitle>Some items in your cart are now unavailable</Subtitle>
          </HeaderContent>
          <CloseButton onClick={onClose} aria-label="Close">
            <FiX size={20} />
          </CloseButton>
        </Header>
        
        <Content>
          <Message>
            The following {unavailableItems.length === 1 ? 'item has' : 'items have'} been marked as unavailable and {unavailableItems.length === 1 ? 'needs' : 'need'} to be removed from your cart:
          </Message>
          
          <ItemsList>
            {unavailableItems.map((item, index) => (
              <ItemCard key={index}>
                {item.menuItem.image && (
                  <ItemImage 
                    src={item.menuItem.image} 
                    alt={item.menuItem.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <ItemInfo>
                  <ItemName>{item.menuItem.name}</ItemName>
                  <ItemDetails>
                    {item.portions} {item.portions === 1 ? 'portion' : 'portions'}
                  </ItemDetails>
                </ItemInfo>
              </ItemCard>
            ))}
          </ItemsList>
          
          <Actions>
            <PrimaryButton onClick={handleViewCart}>
              <FiShoppingCart size={20} />
              View Cart & Adjust
            </PrimaryButton>
            <SecondaryButton onClick={handleRemoveItems}>
              Remove Unavailable Items
            </SecondaryButton>
          </Actions>
        </Content>
      </Modal>
    </Overlay>
  );
};

export default UnavailableItemsAlert;

