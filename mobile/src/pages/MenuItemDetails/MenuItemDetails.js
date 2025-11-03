import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
import api, { API_URL } from '../../config/api';
import { useCart } from '../../context/CartContext';

const MenuItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState('');

  useEffect(() => {
    fetchItemDetails();
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
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/menu/${id}`);
      setItem(response.data.menuItem);
      setError(null);
    } catch (err) {
      console.error('Error fetching item:', err);
      setError('Failed to load item details');
    } finally {
      setLoading(false);
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

  const handleAddToCart = () => {
    if (!isDeliveryOpen) {
      alert(closedMessage || 'Delivery is currently closed. Please check back during operating hours.');
      return;
    }
    addToCart(item, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  if (error || !item) {
    return (
      <ErrorContainer>
        <ErrorText>{error || 'Item not found'}</ErrorText>
        <BackButton onClick={() => navigate('/')}>Go Back</BackButton>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <ItemImage 
        src={item.image || 'https://via.placeholder.com/600x400?text=No+Image'}
        alt={item.name}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
        }}
      />
      
      <Content>
        <Header>
          <ItemName>{item.name}</ItemName>
          <Category>{item.category}</Category>
        </Header>
        
        <Description>{item.description}</Description>
        
        <Price>₦{item.price.toFixed(2)}</Price>
        
        <QuantitySection>
          <QuantityLabel>Quantity</QuantityLabel>
          <QuantityControls>
            <QuantityButton 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              −
            </QuantityButton>
            <QuantityValue>{quantity}</QuantityValue>
            <QuantityButton onClick={() => setQuantity(quantity + 1)}>
              +
            </QuantityButton>
          </QuantityControls>
        </QuantitySection>
        
        <TotalSection>
          <TotalLabel>Total:</TotalLabel>
          <TotalValue>₦{(item.price * quantity).toFixed(2)}</TotalValue>
        </TotalSection>
        
        {!isDeliveryOpen && (
          <ClosedWarning>
            <ClosedWarningText>{closedMessage || 'Delivery is currently closed. Orders cannot be placed at this time.'}</ClosedWarningText>
          </ClosedWarning>
        )}
        
        <AddToCartButton 
          onClick={handleAddToCart}
          disabled={!isDeliveryOpen || !item.available}
        >
          {!isDeliveryOpen ? 'Delivery Closed' : !item.available ? 'Unavailable' : 'Add to Cart'}
        </AddToCartButton>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  background: white;
  min-height: 100vh;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  margin-bottom: 1rem;
`;

const ItemName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Category = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #f0f0f0;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #666;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #FF6B35;
  margin-bottom: 1.5rem;
`;

const QuantitySection = styled.div`
  margin-bottom: 1.5rem;
`;

const QuantityLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #333;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:active:not(:disabled) {
    background-color: #e0e0e0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  min-width: 40px;
  text-align: center;
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
`;

const TotalValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #FF6B35;
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

const AddToCartButton = styled.button`
  width: 100%;
  background-color: ${props => props.disabled ? '#ccc' : '#FF6B35'};
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:active:not(:disabled) {
    background-color: #e55a28;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
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

export default MenuItemDetails;

