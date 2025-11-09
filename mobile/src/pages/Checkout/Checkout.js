import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api, { API_URL } from '../../config/api';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const isGuest = location.state?.isGuest ?? !isAuthenticated;
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isDeliveryOpen) {
      setError(closedMessage || 'Delivery is currently closed. Orders cannot be placed at this time.');
      return;
    }
    
    if (!deliveryAddress || !customerName || !customerPhone) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      const orderItems = cartItems.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity
      }));
      
      const response = await api.post('/orders', {
        items: orderItems,
        deliveryAddress,
        customerName,
        customerPhone,
        notes: notes || null
      });
      
      clearCart();
      navigate('/order-confirmation', { 
        state: { order: response.data.order }
      });
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  return (
    <Container>
      <Title>{isGuest ? 'Express Checkout' : 'Checkout'}</Title>
      
      {isGuest && (
        <GuestNotice>
          <GuestNoticeText>
            You're checking out as a guest. <GuestLink onClick={() => navigate('/login', { state: { redirect: '/checkout', isGuest: false } })}>Login</GuestLink> to save your details for faster checkout and track your orders.
          </GuestNoticeText>
        </GuestNotice>
      )}
      
      {!isDeliveryOpen && (
        <ClosedWarning>
          <ClosedWarningText>{closedMessage || 'Delivery is currently closed. Orders cannot be placed at this time.'}</ClosedWarningText>
        </ClosedWarning>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Delivery Information</SectionTitle>
          
          <FormGroup>
            <Label>Full Name *</Label>
            <Input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Phone Number *</Label>
            <Input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter your phone number"
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Delivery Address *</Label>
            <TextArea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address"
              rows="3"
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Notes (Optional)</Label>
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions?"
              rows="2"
              disabled={loading}
            />
          </FormGroup>
        </Section>
        
        <Section>
          <SectionTitle>Order Summary</SectionTitle>
          
          {cartItems.map(item => (
            <OrderItem key={item.id}>
              <ItemInfo>
                <ItemQuantity>{item.quantity}x</ItemQuantity>
                <ItemName>{item.name}</ItemName>
              </ItemInfo>
              <ItemPrice>₦{(item.price * item.quantity).toFixed(2)}</ItemPrice>
            </OrderItem>
          ))}
          
          <Divider />
          
          <SummaryRow>
            <SummaryLabel>Subtotal:</SummaryLabel>
            <SummaryValue>₦{subtotal.toFixed(2)}</SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>Delivery Fee:</SummaryLabel>
            <SummaryValue>₦{deliveryFee.toFixed(2)}</SummaryValue>
          </SummaryRow>
          
          <Divider />
          
          <TotalRow>
            <TotalLabel>Total:</TotalLabel>
            <TotalValue>₦{total.toFixed(2)}</TotalValue>
          </TotalRow>
        </Section>
        
        <SubmitButton type="submit" disabled={loading || !isDeliveryOpen}>
          {!isDeliveryOpen ? 'Delivery Closed' : loading ? 'Placing Order...' : 'Place Order'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  padding-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
`;

const GuestNotice = styled.div`
  background-color: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const GuestNoticeText = styled.p`
  color: #1565c0;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
`;

const GuestLink = styled.button`
  background: none;
  border: none;
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  margin-left: 4px;
  
  &:hover {
    color: #1565c0;
  }
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

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 0.875rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #FF6B35;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #FF6B35;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ItemQuantity = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #FF6B35;
`;

const ItemName = styled.span`
  font-size: 0.875rem;
  color: #333;
`;

const ItemPrice = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #333;
  letter-spacing: 0.01em;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 0.75rem 0;
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
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #333;
  letter-spacing: 0.01em;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #333;
`;

const TotalValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #FF6B35;
  letter-spacing: 0.03em;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: ${props => props.disabled && !props.$loading ? '#ccc' : '#FF6B35'};
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #e55a28;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default Checkout;

