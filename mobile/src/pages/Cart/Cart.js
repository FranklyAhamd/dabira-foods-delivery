import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api, { API_URL } from '../../config/api';
import { 
  FiShoppingCart, 
  FiTrash2, 
  FiMinus, 
  FiPlus, 
  FiArrowRight,
  FiRefreshCw
} from 'react-icons/fi';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState('');

  useEffect(() => {
    fetchDeliveryStatus();
    
    // Setup Socket.IO connection for real-time updates
    const socketUrl = API_URL.replace('/api', '');
    const newSocket = io(socketUrl);
    
    newSocket.on('delivery:statusChanged', (data) => {
      setIsDeliveryOpen(data.isDeliveryOpen);
      if (data.closedMessage) {
        setClosedMessage(data.closedMessage);
      }
    });
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchDeliveryStatus = async () => {
    try {
      const response = await api.get('/settings');
      if (response.success) {
        setIsDeliveryOpen(response.data.settings.isDeliveryOpen !== false);
        if (response.data.settings.closedMessage) {
          setClosedMessage(response.data.settings.closedMessage);
        }
      }
    } catch (e) {
      // default to open if cannot fetch
    }
  };

  const handleExpressCheckout = () => {
    if (!isDeliveryOpen) {
      alert(closedMessage || 'Delivery is currently closed. Orders cannot be placed at this time.');
      return;
    }
    
    if (cartItems.length === 0) {
      return;
    }
    
    navigate('/checkout', { state: { isGuest: true } });
  };

  const handleLoginCheckout = () => {
    if (!isDeliveryOpen) {
      alert(closedMessage || 'Delivery is currently closed. Orders cannot be placed at this time.');
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: '/checkout' } });
      return;
    }
    
    if (cartItems.length === 0) {
      return;
    }
    
    navigate('/checkout', { state: { isGuest: false } });
  };

  if (cartItems.length === 0) {
    return (
      <EmptyContainer>
        <EmptyIcon>
          <FiShoppingCart size={80} />
        </EmptyIcon>
        <EmptyTitle>Your cart is empty</EmptyTitle>
        <EmptyText>Add some delicious items to get started</EmptyText>
        <BrowseButton onClick={() => navigate('/')}>
          Browse Menu
        </BrowseButton>
      </EmptyContainer>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Cart</Title>
        <ClearButton onClick={clearCart}>Clear All</ClearButton>
      </Header>
      
      <ItemsList>
        {cartItems.map(item => (
          <CartItem key={item.id}>
            <ItemImage 
              src={item.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="10" fill="#999" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>'}
              alt={item.name}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="10" fill="#999" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>';
              }}
            />
            
            <ItemDetails>
              <ItemName>{item.name}</ItemName>
              <ItemPrice>₦{item.price.toFixed(2)}</ItemPrice>
              
              <QuantityControls>
                <QuantityButton 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <FiMinus size={16} />
                </QuantityButton>
                <QuantityValue>{item.quantity}</QuantityValue>
                <QuantityButton 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <FiPlus size={16} />
                </QuantityButton>
              </QuantityControls>
            </ItemDetails>
            
            <ItemActions>
              <ItemTotal>₦{(item.price * item.quantity).toFixed(2)}</ItemTotal>
              <RemoveButton onClick={() => removeFromCart(item.id)}>
                <FiTrash2 size={18} />
              </RemoveButton>
            </ItemActions>
          </CartItem>
        ))}
      </ItemsList>
      
      <Footer>
        {!isDeliveryOpen && (
          <ClosedWarning>
            <ClosedWarningText>{closedMessage || 'Delivery is currently closed. Orders cannot be placed at this time.'}</ClosedWarningText>
          </ClosedWarning>
        )}
        
        <Summary>
          <SummaryRow>
            <SummaryLabel>Subtotal:</SummaryLabel>
            <SummaryValue>₦{getTotalPrice().toFixed(2)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Delivery:</SummaryLabel>
            <SummaryValue>₦500.00</SummaryValue>
          </SummaryRow>
          <Divider />
          <TotalRow>
            <TotalLabel>Total:</TotalLabel>
            <TotalValue>₦{(getTotalPrice() + 500).toFixed(2)}</TotalValue>
          </TotalRow>
        </Summary>
        
        <CheckoutButtons>
          <ExpressCheckoutButton onClick={handleExpressCheckout} disabled={!isDeliveryOpen}>
            {!isDeliveryOpen ? (
              'Delivery Closed'
            ) : (
              <>
                Express Checkout
                <FiArrowRight size={18} />
              </>
            )}
          </ExpressCheckoutButton>
          
          <LoginCheckoutButton onClick={handleLoginCheckout} disabled={!isDeliveryOpen}>
            {!isDeliveryOpen ? (
              'Delivery Closed'
            ) : isAuthenticated ? (
              <>
                Checkout with Account
                <FiArrowRight size={18} />
              </>
            ) : (
              <>
                Login & Checkout
                <FiArrowRight size={18} />
              </>
            )}
          </LoginCheckoutButton>
        </CheckoutButtons>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
`;

const ClearButton = styled.button`
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ItemsList = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  background: white;
  padding: 1.25rem;
  border-radius: 16px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ItemName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const ItemPrice = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const QuantityValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  min-width: 24px;
  text-align: center;
`;

const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const ItemTotal = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const RemoveButton = styled.button`
  font-size: 1.25rem;
  background: none;
  padding: 0.25rem;
  
  &:active {
    opacity: 0.6;
  }
`;

const Footer = styled.div`
  background: white;
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
`;

const Summary = styled.div`
  margin-bottom: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const SummaryLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const SummaryValue = styled.span`
  font-size: 0.875rem;
  color: #333;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 0.75rem 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #333;
`;

const TotalValue = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ClosedWarning = styled.div`
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ClosedWarningText = styled.p`
  color: #856404;
  font-size: 0.9375rem;
  text-align: center;
  margin: 0;
  font-weight: 500;
`;

const CheckoutButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ExpressCheckoutButton = styled.button`
  width: 100%;
  background: ${props => props.disabled 
    ? '#ccc' 
    : 'linear-gradient(135deg, #FF6B35 0%, #f7931e 100%)'};
  color: white;
  padding: 1.25rem;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 700;
  box-shadow: ${props => props.disabled 
    ? 'none' 
    : '0 8px 24px rgba(255, 107, 53, 0.4)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(255, 107, 53, 0.5);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const LoginCheckoutButton = styled.button`
  width: 100%;
  background: ${props => props.disabled 
    ? '#ccc' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  padding: 1.25rem;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 700;
  box-shadow: ${props => props.disabled 
    ? 'none' 
    : '0 8px 24px rgba(102, 126, 234, 0.4)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: 2rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const BrowseButton = styled.button`
  background-color: #FF6B35;
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  
  &:active {
    background-color: #e55a28;
  }
`;

export default Cart;
