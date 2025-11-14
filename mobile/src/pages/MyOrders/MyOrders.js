import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../config/api';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.orders);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Loading your orders...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorText>{error}</ErrorText>
        <RetryButton onClick={fetchOrders}>Try Again</RetryButton>
      </ErrorContainer>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyContainer>
        <EmptyIcon>📦</EmptyIcon>
        <EmptyTitle>No orders yet</EmptyTitle>
        <EmptyText>Start ordering delicious food!</EmptyText>
        <BrowseButton onClick={() => navigate('/')}>
          Browse Menu
        </BrowseButton>
      </EmptyContainer>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Orders</Title>
      </Header>
      
      <OrdersList>
        {orders.map(order => (
          <OrderCard key={order.id} onClick={() => navigate(`/order/${order.id}`)}>
            <OrderHeader>
              <OrderId>Order #{order.id.substring(0, 8).toUpperCase()}</OrderId>
              <StatusBadge color={getStatusColor(order.status)}>
                {order.status.replace('_', ' ')}
              </StatusBadge>
            </OrderHeader>
            
            <OrderDate>{formatDate(order.createdAt)}</OrderDate>
            
            <OrderItems>
              {order.items.slice(0, 2).map(item => (
                <OrderItem key={item.id}>
                  {item.quantity}x {item.menuItem.name}
                </OrderItem>
              ))}
              {order.items.length > 2 && (
                <MoreItems>+{order.items.length - 2} more items</MoreItems>
              )}
            </OrderItems>
            
            <OrderFooter>
              <OrderTotal>₦{order.totalAmount.toFixed(2)}</OrderTotal>
              <ViewDetails>View Details →</ViewDetails>
            </OrderFooter>
          </OrderCard>
        ))}
      </OrdersList>
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
  padding-bottom: 2rem;
  background: #0a0a0a;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderCard = styled.div`
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #2a2a2a;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const OrderId = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
`;

const StatusBadge = styled.span`
  background-color: ${props => props.color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const OrderDate = styled.div`
  font-size: 0.875rem;
  color: #b3b3b3;
  margin-bottom: 1rem;
`;

const OrderItems = styled.div`
  margin-bottom: 1rem;
`;

const OrderItem = styled.div`
  font-size: 0.875rem;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const MoreItems = styled.div`
  font-size: 0.875rem;
  color: #b3b3b3;
  font-style: italic;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #2a2a2a;
`;

const OrderTotal = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #FF6B35;
  letter-spacing: 0.02em;
`;

const ViewDetails = styled.span`
  font-size: 0.875rem;
  color: #3b82f6;
  font-weight: 600;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #2a2a2a;
  border-top: 3px solid #FF6B35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #b3b3b3;
  font-size: 1rem;
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
  color: #ef4444;
  font-size: 1rem;
  text-align: center;
`;

const RetryButton = styled.button`
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
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: #b3b3b3;
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

export default MyOrders;

