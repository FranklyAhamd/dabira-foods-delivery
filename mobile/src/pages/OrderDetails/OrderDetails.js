import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../config/api';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.order);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#FFA000';
      case 'CONFIRMED': return '#2196F3';
      case 'IN_PROGRESS': return '#9C27B0';
      case 'OUT_FOR_DELIVERY': return '#00BCD4';
      case 'DELIVERED': return '#4CAF50';
      case 'CANCELLED': return '#F44336';
      default: return '#757575';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'PENDING': return 'Your order has been received';
      case 'CONFIRMED': return 'Your order has been confirmed';
      case 'IN_PROGRESS': return 'Your order is being prepared';
      case 'OUT_FOR_DELIVERY': return 'Your order is on its way';
      case 'DELIVERED': return 'Your order has been delivered';
      case 'CANCELLED': return 'Your order has been cancelled';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  if (error || !order) {
    return (
      <ErrorContainer>
        <ErrorText>{error || 'Order not found'}</ErrorText>
        <BackButton onClick={() => navigate('/my-orders')}>
          Go Back
        </BackButton>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <StatusSection color={getStatusColor(order.status)}>
        <StatusTitle>{order.status.replace('_', ' ')}</StatusTitle>
        <StatusMessage>{getStatusMessage(order.status)}</StatusMessage>
      </StatusSection>
      
      <Section>
        <SectionTitle>Order Information</SectionTitle>
        
        <InfoRow>
          <InfoLabel>Order ID:</InfoLabel>
          <InfoValue>{order.id.substring(0, 8).toUpperCase()}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Date:</InfoLabel>
          <InfoValue>{formatDate(order.createdAt)}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Customer:</InfoLabel>
          <InfoValue>{order.customerName}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Phone:</InfoLabel>
          <InfoValue>{order.customerPhone}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Delivery Address:</InfoLabel>
          <InfoValue>{order.deliveryAddress}</InfoValue>
        </InfoRow>
        
        {order.notes && (
          <InfoRow>
            <InfoLabel>Notes:</InfoLabel>
            <InfoValue>{order.notes}</InfoValue>
          </InfoRow>
        )}
      </Section>
      
      <Section>
        <SectionTitle>Order Items</SectionTitle>
        
        {order.items.map(item => (
          <OrderItem key={item.id}>
            <ItemInfo>
              <ItemQuantity>{item.quantity}x</ItemQuantity>
              <ItemName>{item.menuItem.name}</ItemName>
            </ItemInfo>
            <ItemPrice>₦{(item.price * item.quantity).toFixed(2)}</ItemPrice>
          </OrderItem>
        ))}
        
        <Divider />
        
        <TotalRow>
          <TotalLabel>Total:</TotalLabel>
          <TotalValue>₦{order.totalAmount.toFixed(2)}</TotalValue>
        </TotalRow>
      </Section>
      
      <Section>
        <SectionTitle>Payment</SectionTitle>
        
        <InfoRow>
          <InfoLabel>Payment Status:</InfoLabel>
          <PaymentBadge status={order.paymentStatus}>
            {order.paymentStatus}
          </PaymentBadge>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Payment Method:</InfoLabel>
          <InfoValue>Cash on Delivery</InfoValue>
        </InfoRow>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
  padding-bottom: 2rem;
`;

const StatusSection = styled.div`
  background-color: ${props => props.color};
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  text-align: center;
`;

const StatusTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const StatusMessage = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

const Section = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  flex-shrink: 0;
  width: 40%;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: #333;
  text-align: right;
  word-break: break-word;
`;

const PaymentBadge = styled.span`
  background-color: ${props => props.status === 'PAID' ? '#4CAF50' : '#FFA000'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
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
  flex: 1;
`;

const ItemQuantity = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #FF6B35;
  min-width: 30px;
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
  color: #333;
`;

const TotalValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #FF6B35;
  letter-spacing: 0.02em;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #FF6B35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
  padding: 2rem;
`;

const ErrorText = styled.p`
  color: #c33;
  font-size: 1rem;
  text-align: center;
`;

const BackButton = styled.button`
  background-color: #FF6B35;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  
  &:active {
    background-color: #e55a28;
  }
`;

export default OrderDetails;

