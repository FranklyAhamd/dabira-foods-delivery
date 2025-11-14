import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api, { API_URL } from '../../config/api';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { success } = useToast();
  const isGuest = location.state?.isGuest ?? !isAuthenticated;
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState('');
  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    fetchDeliveryStatus();
    fetchDeliveryLocations();
    
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

  const fetchDeliveryLocations = async () => {
    try {
      setLoadingLocations(true);
      const response = await api.get('/delivery-locations/public');
      if (response.success && response.data.locations) {
        setDeliveryLocations(response.data.locations);
        // Auto-select first location if available
        if (response.data.locations.length > 0) {
          setSelectedLocation(response.data.locations[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching delivery locations:', e);
    } finally {
      setLoadingLocations(false);
    }
  };

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

    if (!selectedLocation) {
      setError('Please select a delivery location');
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
      
      // Calculate total amount
      const subtotal = getTotalPrice();
      const deliveryFee = selectedLocation ? parseFloat(selectedLocation.price) : 0;
      const total = subtotal + deliveryFee;
      
      // Initialize payment with Monnify
      const paymentPayload = {
        amount: total,
        customerName: customerName.trim(),
        customerEmail: user?.email || `${customerPhone}@temp.com`, // Use phone as email if no email
        customerPhone: customerPhone.trim(),
        items: orderItems,
        deliveryAddress: deliveryAddress.trim(),
        notes: notes ? notes.trim() : null,
        deliveryLocationId: selectedLocation.id
      };
      
      console.log('Initializing payment with payload:', paymentPayload);
      
      const response = await api.post('/payment/initialize', paymentPayload);
      
      console.log('Payment initialization response:', response);
      
      // Check if response indicates an error
      if (response && response.success === false) {
        if (response.errors && Array.isArray(response.errors)) {
          const validationErrors = response.errors.map(e => e.msg || e.message || e).join(', ');
          setError(`Validation error: ${validationErrors}`);
        } else {
          setError(response.message || 'Failed to initialize payment. Please try again.');
        }
        setLoading(false);
        return;
      }
      
      // Check if response is successful and has checkout URL
      if (response && response.success && response.data && response.data.checkoutUrl) {
        // Redirect to Monnify checkout page
        window.location.href = response.data.checkoutUrl;
      } else {
        setError(response?.message || 'Failed to initialize payment. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error initializing payment:', err);
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
          setError('Invalid payment data. Please check your information and try again.');
        }
      } else {
        // Show detailed error message from backend
        const errorData = err.response?.data;
        let errorMessage = 'Failed to initialize payment. Please try again.';
        
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.responseMessage) {
          errorMessage = errorData.responseMessage;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        // Add details if available in development
        if (errorData?.details && process.env.NODE_ENV === 'development') {
          console.error('Payment error details:', errorData.details);
        }
        
        setError(errorMessage);
      }
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const deliveryFee = selectedLocation ? parseFloat(selectedLocation.price) : 0;
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
            <Label>Delivery Location *</Label>
            {loadingLocations ? (
              <Input type="text" value="Loading locations..." disabled />
            ) : deliveryLocations.length === 0 ? (
              <Input type="text" value="No delivery locations available" disabled />
            ) : (
              <Select
                value={selectedLocation?.id || ''}
                onChange={(e) => {
                  const location = deliveryLocations.find(loc => loc.id === e.target.value);
                  setSelectedLocation(location);
                }}
                disabled={loading}
              >
                <option value="">Select a location</option>
                {deliveryLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name} - ₦{parseFloat(location.price).toFixed(2)}
                  </option>
                ))}
              </Select>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Delivery Address *</Label>
            <TextArea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your detailed delivery address"
              rows="2"
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Notes (Optional)</Label>
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions?"
              rows="1"
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
          {!isDeliveryOpen ? 'Delivery Closed' : loading ? 'Processing Payment...' : 'Pay Now'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0.75rem;
  padding-bottom: 1.5rem;
  background: #0a0a0a;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.75rem;
`;

const GuestNotice = styled.div`
  background-color: rgba(59, 130, 246, 0.2);
  border: 1px solid #3b82f6;
  border-radius: 6px;
  padding: 0.625rem;
  margin-bottom: 0.75rem;
`;

const GuestNoticeText = styled.p`
  color: #3b82f6;
  font-size: 0.75rem;
  margin: 0;
  text-align: center;
  line-height: 1.4;
`;

const GuestLink = styled.button`
  background: none;
  border: none;
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  margin-left: 3px;
  font-size: 0.75rem;
  
  &:hover {
    color: #1565c0;
  }
`;

const ClosedWarning = styled.div`
  background-color: rgba(245, 158, 11, 0.2);
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 0.625rem;
  margin-bottom: 0.75rem;
`;

const ClosedWarningText = styled.p`
  color: #f59e0b;
  font-size: 0.8125rem;
  text-align: center;
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
`;

const ErrorMessage = styled.div`
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 0.625rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.4;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const Section = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 0.875rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  border: 1px solid #2a2a2a;
`;

const SectionTitle = styled.h2`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.75rem;
`;

const FormGroup = styled.div`
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #b3b3b3;
  margin-bottom: 0.375rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: #1e1e1e;
  color: #ffffff;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #FF6B35;
  }
  
  &:disabled {
    background-color: #121212;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #4d4d4d;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  background-color: #1e1e1e;
  color: #ffffff;
  resize: vertical;
  box-sizing: border-box;
  line-height: 1.4;
  
  &:focus {
    outline: none;
    border-color: #FF6B35;
  }
  
  &:disabled {
    background-color: #121212;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #4d4d4d;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: #1e1e1e;
  color: #ffffff;
  cursor: pointer;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #FF6B35;
  }
  
  &:disabled {
    background-color: #121212;
    cursor: not-allowed;
  }
  
  option {
    background-color: #1a1a1a;
    color: #ffffff;
  }
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex: 1;
  min-width: 0;
`;

const ItemQuantity = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #FF6B35;
  flex-shrink: 0;
`;

const ItemName = styled.span`
  font-size: 0.8125rem;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemPrice = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #ffffff;
  letter-spacing: 0.01em;
  flex-shrink: 0;
  margin-left: 0.5rem;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #2a2a2a;
  margin: 0.5rem 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.375rem;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  font-size: 0.8125rem;
  color: #b3b3b3;
`;

const SummaryValue = styled.span`
  font-size: 0.8125rem;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #ffffff;
  letter-spacing: 0.01em;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const TotalLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #ffffff;
`;

const TotalValue = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #FF6B35;
  letter-spacing: 0.02em;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: ${props => props.disabled && !props.$loading ? '#ccc' : '#FF6B35'};
  color: white;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
  
  &:hover:not(:disabled) {
    background-color: #e55a28;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default Checkout;

