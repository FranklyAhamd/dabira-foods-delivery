import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { info } = useToast();
  const order = location.state?.order;

  if (!order) {
    navigate('/');
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <SuccessIcon>✓</SuccessIcon>
      <Title>Order Confirmed!</Title>
      <Message>Thank you for your order. We'll start preparing it right away.</Message>
      
      <OrderInfo>
        <InfoRow>
          <InfoLabel>Order ID:</InfoLabel>
          <InfoValue>{order.id.substring(0, 8).toUpperCase()}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Date:</InfoLabel>
          <InfoValue>{formatDate(order.createdAt)}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Status:</InfoLabel>
          <StatusBadge>{order.status}</StatusBadge>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Delivery Address:</InfoLabel>
          <InfoValue>{order.deliveryAddress}</InfoValue>
        </InfoRow>
      </OrderInfo>
      
      <OrderSummary>
        <SummaryTitle>Order Summary</SummaryTitle>
        
        {order.items?.map(item => (
          <OrderItem key={item.id}>
            <ItemInfo>
              <ItemQuantity>{item.quantity}x</ItemQuantity>
              <ItemName>{item.menuItem?.name || 'Item'}</ItemName>
            </ItemInfo>
            <ItemPrice>₦{(item.price * item.quantity).toFixed(2)}</ItemPrice>
          </OrderItem>
        ))}
        
        <Divider />
        
        <TotalRow>
          <TotalLabel>Total:</TotalLabel>
          <TotalValue>₦{order.totalAmount.toFixed(2)}</TotalValue>
        </TotalRow>
      </OrderSummary>
      
      {!isAuthenticated && (
        <GuestMessage>
          <GuestMessageText>
            💡 <strong>Tip:</strong> Create an account to track your orders and save your details for faster checkout!
          </GuestMessageText>
          <RegisterLink onClick={() => navigate('/register')}>
            Create Account
          </RegisterLink>
        </GuestMessage>
      )}
      
      <ButtonGroup>
        {isAuthenticated ? (
          <TrackButton onClick={() => navigate(`/order/${order.id}`)}>
            Track Order
          </TrackButton>
        ) : (
          <GuestTrackButton onClick={() => {
            info(`Your Order ID is: ${order.id.substring(0, 8).toUpperCase()}. Please save this ID. Contact us if you need to track your order.`);
          }}>
            View Order ID
          </GuestTrackButton>
        )}
        
        <HomeButton onClick={() => navigate('/')}>
          Back to Home
        </HomeButton>
      </ButtonGroup>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
  background: #0a0a0a;
  min-height: 100vh;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background-color: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  animation: scaleIn 0.3s ease-out;
  
  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #b3b3b3;
  margin-bottom: 2rem;
`;

const OrderInfo = styled.div`
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  text-align: left;
  border: 1px solid #2a2a2a;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #b3b3b3;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: #ffffff;
  text-align: right;
`;

const StatusBadge = styled.span`
  background-color: #FFA000;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const OrderSummary = styled.div`
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  text-align: left;
  border: 1px solid #2a2a2a;
`;

const SummaryTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
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
  color: #ffffff;
`;

const ItemPrice = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #ffffff;
  letter-spacing: 0.01em;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #2a2a2a;
  margin: 1rem 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
`;

const TotalValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #FF6B35;
  letter-spacing: 0.02em;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GuestMessage = styled.div`
  background-color: rgba(59, 130, 246, 0.2);
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const GuestMessageText = styled.p`
  color: #3b82f6;
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
`;

const RegisterLink = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  
  &:active {
    opacity: 0.9;
  }
`;

const TrackButton = styled.button`
  width: 100%;
  background-color: #2196F3;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:active {
    background-color: #1976D2;
  }
`;

const GuestTrackButton = styled.button`
  width: 100%;
  background-color: #FFA000;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:active {
    background-color: #F57C00;
  }
`;

const HomeButton = styled.button`
  width: 100%;
  background-color: #FF6B35;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:active {
    background-color: #e55a28;
  }
`;

export default OrderConfirmation;

