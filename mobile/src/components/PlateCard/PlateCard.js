import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiTrash2, FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { usePlate } from '../../context/PlateContext';
import { useCart } from '../../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const PlateCard = ({ onAddMoreClick, isDeliveryOpen, isHidden = false }) => {
  const { currentPlate, removeItemFromPlate, updateItemPortions, clearPlate, getPlateTotal, wouldExceedTakeawayLimitOnUpdate, getPlateMaxPortions, loadPlate, plateNumber } = usePlate();
  const { addPlateToCart, cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { warning } = useToast();
  const isEditingFromCart = location.state?.editingPlate;
  
  // Track original cart length to calculate total plates correctly
  // (cartItems.length changes when we remove plates for editing)
  const [originalCartLength, setOriginalCartLength] = useState(cartItems.length);
  
  // Update original cart length when cart items change (but not when we're just editing)
  useEffect(() => {
    // Only update if the change is not from navigation (i.e., actual cart changes)
    if (cartItems.length !== originalCartLength) {
      // If cart length increased, it's a real addition
      if (cartItems.length > originalCartLength) {
        setOriginalCartLength(cartItems.length);
      }
      // If cart length decreased by 1 and we're viewing a plate, it might be from navigation
      // Otherwise, update the original length
      else if (cartItems.length < originalCartLength - 1) {
        setOriginalCartLength(cartItems.length);
      }
    }
  }, [cartItems.length, originalCartLength]);
  
  // Calculate total plates: existing in cart + current plate being built
  const totalPlates = originalCartLength + (currentPlate && currentPlate.items.length > 0 ? 1 : 0);
  const currentPlateIndex = originalCartLength; // Current plate is always the last one (being built)
  const [viewingPlateIndex, setViewingPlateIndex] = useState(currentPlateIndex);
  
  // Reset viewing index when current plate changes
  useEffect(() => {
    if (currentPlate && currentPlate.items.length > 0) {
      setViewingPlateIndex(originalCartLength);
    }
  }, [currentPlate, originalCartLength]);

  if (!currentPlate || currentPlate.items.length === 0) {
    return null;
  }
  
  const isViewingCurrentPlate = viewingPlateIndex === originalCartLength;
  
  // Handle navigation
  const handlePreviousPlate = () => {
    if (viewingPlateIndex > 0) {
      const newIndex = viewingPlateIndex - 1;
      setViewingPlateIndex(newIndex);
      // Load the plate from cart into currentPlate for editing
      if (newIndex < cartItems.length) {
        const plateToLoad = cartItems[newIndex];
        if (plateToLoad) {
          // Remove from cart temporarily (it will be added back when saved)
          removeFromCart(plateToLoad.id);
          loadPlate(plateToLoad);
        }
      }
    }
  };
  
  const handleNextPlate = () => {
    if (viewingPlateIndex < totalPlates - 1) {
      const newIndex = viewingPlateIndex + 1;
      setViewingPlateIndex(newIndex);
      // If navigating to a plate from cart, load it
      if (newIndex < cartItems.length) {
        const plateToLoad = cartItems[newIndex];
        if (plateToLoad) {
          // Remove from cart temporarily (it will be added back when saved)
          removeFromCart(plateToLoad.id);
          loadPlate(plateToLoad);
        }
      }
      // If navigating to current plate (the one being built), it's already loaded
    }
  };

  const handleAddToCart = () => {
    if (!isDeliveryOpen) return;
    // Always add the currentPlate (which is the one being edited/viewed)
    addPlateToCart(currentPlate);
    clearPlate();
    // If we came from cart page (editing), navigate back to cart
    if (isEditingFromCart) {
      // Small delay to show the plate was added
      setTimeout(() => {
        navigate('/cart', { replace: true });
      }, 300);
    }
  };

  const handleRemoveItem = (menuItemId) => {
    // Always remove from currentPlate (which is loaded when viewing any plate)
    removeItemFromPlate(menuItemId);
  };

  const handleUpdatePortions = (menuItemId, newPortions) => {
    if (newPortions <= 0) {
      handleRemoveItem(menuItemId);
      return;
    }

    // Use currentPlate for limit checking (it's the one being edited)
    // Check if this update would exceed the limit
    if (wouldExceedTakeawayLimitOnUpdate(currentPlate, menuItemId, newPortions)) {
      const plateMaxPortions = getPlateMaxPortions(currentPlate);
      if (plateMaxPortions) {
        warning(`Plate ${currentPlate.plateNumber || viewingPlateIndex + 1} is full! Maximum ${plateMaxPortions} portions allowed per takeaway plate. You can add extra items like drinks, or start a new plate.`);
        return; // Don't update if it would exceed
      }
    }

    // Update portions
    const result = updateItemPortions(menuItemId, newPortions);
    if (result && result.limitExceeded && result.message) {
      warning(result.message);
    }
  };

  return (
    <CardContainer $isHidden={isHidden}>
      <CardHeader>
        <CardTitleLeft>
          <CardTitle>{isEditingFromCart ? 'Editing Plate' : 'Your Plate'}</CardTitle>
        </CardTitleLeft>
        <CardHeaderCenter>
          {totalPlates > 1 && (
            <PlateNavigation>
              <NavButton 
                onClick={handlePreviousPlate}
                disabled={viewingPlateIndex === 0}
                aria-label="Previous plate"
              >
                <FiChevronLeft size={14} />
              </NavButton>
              <PlateNumber>
                Plate {viewingPlateIndex + 1}
              </PlateNumber>
              <NavButton 
                onClick={handleNextPlate}
                disabled={viewingPlateIndex === totalPlates - 1}
                aria-label="Next plate"
              >
                <FiChevronRight size={14} />
              </NavButton>
            </PlateNavigation>
          )}
        </CardHeaderCenter>
        <CardTitleRight>
          <ClearButton onClick={clearPlate}>Clear</ClearButton>
        </CardTitleRight>
      </CardHeader>

      <ItemsList>
        {currentPlate.items.map((item, index) => (
          <PlateItem key={`${item.menuItem.id}-${index}`}>
            <ItemImage
              src={item.menuItem.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="#f0f0f0"/></svg>'}
              alt={item.menuItem.name}
            />
            <ItemDetails>
              <ItemName>{item.menuItem.name}</ItemName>
              <PortionControls>
                <PortionButton
                  onClick={() => handleUpdatePortions(item.menuItem.id, item.portions - 1)}
                >
                  −
                </PortionButton>
                <PortionValue>x{item.portions}</PortionValue>
                <PortionButton
                  onClick={() => handleUpdatePortions(item.menuItem.id, item.portions + 1)}
                >
                  +
                </PortionButton>
              </PortionControls>
            </ItemDetails>
            <ItemPrice>
              ₦{(item.menuItem.price * item.portions).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </ItemPrice>
            <RemoveButton onClick={() => handleRemoveItem(item.menuItem.id)}>
              <FiTrash2 size={14} />
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
          <AddMoreButton 
            onClick={(e) => {
              if (onAddMoreClick) {
                onAddMoreClick(e);
              }
            }}
          >
            <FiPlus size={12} />
            Add More Menu
          </AddMoreButton>
          <AddToCartButton onClick={handleAddToCart} disabled={!isDeliveryOpen}>
            <FiShoppingCart size={12} />
            Add Plate to Cart
          </AddToCartButton>
        </ActionButtons>
      </CardFooter>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  /* Mobile styles - bottom full width */
  position: fixed;
  bottom: 100px;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.5);
  max-height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
  z-index: 101;
  border-top: 1px solid #2a2a2a;
  transform: ${props => props.$isHidden ? 'translateY(calc(100% + 100px))' : 'translateY(0)'};
  opacity: ${props => props.$isHidden ? 0 : 1};
  pointer-events: ${props => props.$isHidden ? 'none' : 'auto'};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 767px) {
    animation: ${props => !props.$isHidden ? 'slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'};
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Desktop view - top right positioning */
  @media (min-width: 768px) {
    position: fixed !important;
    top: 80px !important;
    right: 20px !important;
    bottom: auto !important;
    left: auto !important;
    width: 380px !important;
    max-width: calc(100vw - 40px) !important;
    max-height: calc(100vh - 120px) !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
    border-top: none !important;
    border: 1px solid rgba(102, 126, 234, 0.1) !important;
    transform: ${props => props.$isHidden ? 'translateX(calc(100% + 20px))' : 'translateX(0)'} !important;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    animation: ${props => !props.$isHidden ? 'slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'} !important;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #2a2a2a;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
  gap: 0.5rem;
`;

const CardTitleLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const CardHeaderCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const CardTitleRight = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
`;

const PlateNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavButton = styled.button`
  background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.3)' : '#ffffff'};
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  
  &:active:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(0.9);
  }
  
  &:disabled {
    opacity: 0.5;
  }
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const PlateNumber = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: #ffffff;
  min-width: 50px;
  text-align: center;
  letter-spacing: 0.01em;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  transition: all 0.2s;
  
  &:active {
    background: rgba(239, 68, 68, 0.1);
    transform: scale(0.95);
  }
`;

const ItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.375rem 0.75rem;
  max-height: calc(100vh - 300px);

  @media (min-width: 768px) {
    max-height: calc(100vh - 400px);
  }
`;

const PlateItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #2a2a2a;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

const ItemName = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PortionControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const PortionButton = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: #2a2a2a;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #b3b3b3;
  transition: all 0.15s;
  
  &:active {
    background: #333333;
    transform: scale(0.95);
  }
`;

const PortionValue = styled.span`
  font-size: 0.6875rem;
  color: #b3b3b3;
  min-width: 32px;
  font-weight: 700;
  text-align: center;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const ItemPrice = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #667eea;
  letter-spacing: 0.01em;
  line-height: 1.2;
  white-space: nowrap;
  margin-right: 0.25rem;
  flex-shrink: 0;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
  opacity: 0.7;
  
  &:active {
    opacity: 1;
    transform: scale(0.9);
  }
  
  &:hover {
    opacity: 1;
  }
`;

const CardFooter = styled.div`
  padding: 0.375rem 0.75rem;
  border-top: 1px solid #2a2a2a;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.375rem;
  padding: 0.375rem 0.625rem;
  background: #121212;
  border-radius: 6px;
  border: 1px solid #2a2a2a;
`;

const TotalLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #b3b3b3;
`;

const TotalValue = styled.span`
  font-size: 0.9375rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.02em;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.375rem;
`;

const AddMoreButton = styled.button`
  flex: 1;
  background: #1a1a1a;
  color: #667eea;
  border: 1.5px solid #667eea;
  padding: 0.4rem 0.5rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:active {
    background: rgba(102, 126, 234, 0.2);
    transform: scale(0.97);
  }
  
  svg {
    width: 11px;
    height: 11px;
    flex-shrink: 0;
  }
`;

const AddToCartButton = styled.button`
  flex: 1.5;
  background: ${props => props.disabled ? '#d1d5db' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  padding: 0.4rem 0.5rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  box-shadow: ${props => props.disabled ? 'none' : '0 2px 8px rgba(102, 126, 234, 0.3)'};
  transition: all 0.2s;
  letter-spacing: 0.01em;
  white-space: nowrap;
  
  &:active:not(:disabled) {
    transform: scale(0.97);
    box-shadow: 0 1px 4px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  svg {
    width: 11px;
    height: 11px;
    flex-shrink: 0;
  }
`;

export default PlateCard;

