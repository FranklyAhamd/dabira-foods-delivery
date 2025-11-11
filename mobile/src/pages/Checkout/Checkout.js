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
      
      // Flatten plates into order items
      // cartItems are plates, each plate has items array with menuItem and portions
      const orderItems = [];
      cartItems.forEach(plate => {
        if (plate.items && Array.isArray(plate.items)) {
          plate.items.forEach(plateItem => {
            if (plateItem.menuItem && plateItem.menuItem.id) {
              const quantity = parseInt(plateItem.portions || 1, 10);
              if (quantity > 0 && plateItem.menuItem.id) {
                orderItems.push({
                  menuItemId: plateItem.menuItem.id,
                  quantity: quantity
                });
              }
            }
          });
        }
      });
      
      if (orderItems.length === 0) {
        setError('Your cart is empty. Please add items before placing an order.');
        setLoading(false);
        return;
      }
      
      // Validate required fields
      if (!deliveryAddress.trim() || !customerName.trim() || !customerPhone.trim()) {
        setError('Please fill in all required fields (Name, Phone, and Delivery Address).');
        setLoading(false);
        return;
      }
      
      const orderPayload = {
        items: orderItems,
        deliveryAddress: deliveryAddress.trim(),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        notes: notes ? notes.trim() : null
      };
      
      console.log('Placing order with payload:', orderPayload);
      
      const response = await api.post('/orders', orderPayload);
      
      console.log('Order response:', response);
      
      // API interceptor returns response.data, so response is already unwrapped
      // Backend returns: { success: true, message: '...', data: { order } }
      // After interceptor: response = { success: true, message: '...', data: { order } }
      // Note: API interceptor validateStatus allows 400, so we need to check success flag
      
      // Check if response indicates an error (400 validation errors)
      if (response && response.success === false) {
        // This is a validation or other error response
        if (response.errors && Array.isArray(response.errors)) {
          const validationErrors = response.errors.map(e => e.msg || e.message || e).join(', ');
          setError(`Validation error: ${validationErrors}`);
        } else {
          setError(response.message || 'Invalid order data. Please check your cart and try again.');
        }
        setLoading(false);
        return;
      }
      
      // Check if response is successful and has the expected structure
      if (response && response.success && response.data && response.data.order) {
        clearCart();
        navigate('/order-confirmation', { 
          state: { order: response.data.order }
        });
      } else {
        // Handle unexpected response structure
        console.error('Unexpected response structure:', response);
        setError(response?.message || 'Order was placed but confirmation failed. Please check your orders.');
        // Don't clear cart if we're not sure the order was created
        if (response?.success) {
          clearCart();
          navigate('/orders');
        }
      }
    } catch (err) {
      console.error('Error placing order:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      // Handle different error types
      if (err.response?.status === 400) {
        // Validation error
        if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
          const validationErrors = err.response.data.errors.map(e => e.msg || e.message || e).join(', ');
          setError(`Validation error: ${validationErrors}`);
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Invalid order data. Please check your cart and try again.');
        }
      } else if (err.response?.status === 404) {
        setError('One or more items in your cart are no longer available. Please update your cart.');
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to place order. Please try again.';
        setError(errorMessage);
      }
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
          
          {cartItems.map((plate, plateIndex) => (
            <React.Fragment key={plate.id || plateIndex}>
              {plate.items && plate.items.map((plateItem, itemIndex) => (
                <OrderItem key={`${plate.id}-${plateItem.menuItem?.id || itemIndex}`}>
                  <ItemInfo>
                    <ItemQuantity>{plateItem.portions || 1}x</ItemQuantity>
                    <ItemName>{plateItem.menuItem?.name || 'Unknown Item'}</ItemName>
                  </ItemInfo>
                  <ItemPrice>
                    ₦{((plateItem.menuItem?.price || 0) * (plateItem.portions || 1)).toFixed(2)}
                  </ItemPrice>
                </OrderItem>
              ))}
            </React.Fragment>
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

