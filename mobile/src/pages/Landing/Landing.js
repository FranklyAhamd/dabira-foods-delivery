import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
import api, { API_URL } from '../../config/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FiArrowRight, FiShoppingBag, FiClock, FiMapPin, FiPhone, FiStar } from 'react-icons/fi';

const Landing = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { warning } = useToast();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState('');
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchSettings();
    fetchFeaturedItems();
    
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

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.success) {
        setSettings(response.data.settings);
        setIsDeliveryOpen(response.data.settings.isDeliveryOpen !== false);
        if (response.data.settings.closedMessage) {
          setClosedMessage(response.data.settings.closedMessage);
        }
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedItems = async () => {
    try {
      const response = await api.get('/menu');
      if (response.success && Array.isArray(response.data.menuItems)) {
        // Get 6 featured items (or all if less than 6)
        const items = response.data.menuItems
          .filter(item => item.available)
          .slice(0, 6);
        setFeaturedItems(items);
        
        // Extract images for background slider (filter out items without images)
        const images = response.data.menuItems
          .filter(item => item.image && item.image.trim() !== '')
          .map(item => item.image)
          .slice(0, 5); // Use up to 5 images for slider
        
        if (images.length > 0) {
          setBackgroundImages(images);
        }
      }
    } catch (err) {
      console.error('Error fetching featured items:', err);
    }
  };

  // Reset index when images change
  useEffect(() => {
    if (backgroundImages.length === 0) {
      setCurrentImageIndex(0);
    } else if (currentImageIndex >= backgroundImages.length) {
      setCurrentImageIndex(0);
    }
  }, [backgroundImages.length]);

  // Auto-rotate background images
  useEffect(() => {
    if (backgroundImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % backgroundImages.length;
          return nextIndex;
        });
      }, 5000); // Change image every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [backgroundImages.length]);

  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    
    if (!isDeliveryOpen) {
      warning(closedMessage || 'Delivery is currently closed. Orders cannot be placed at this time.');
      return;
    }
    
    if (!item.available) {
      return;
    }
    
    addToCart(item, 1);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner />
          <LoadingText>Loading...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      {/* Hero Section */}
      <HeroSection $hasImages={backgroundImages.length > 0}>
        <BackgroundImageContainer>
          {backgroundImages.map((image, index) => (
            <BackgroundImage
              key={`bg-img-${index}`}
              $active={index === currentImageIndex}
              src={image}
              alt="Food background"
              onError={(e) => {
                // Hide broken images
                e.target.style.display = 'none';
              }}
            />
          ))}
        </BackgroundImageContainer>
        {backgroundImages.length > 0 && <ImageOverlay />}
        <HeroContent>
          <HeroTitle $animated>Welcome to {settings?.restaurantName || 'Dabira Foods'}</HeroTitle>
          <HeroSubtitle $animated>Authentic Nigerian Delicacies Delivered to Your Doorstep</HeroSubtitle>
          
          {!isDeliveryOpen && (
            <DeliveryStatus>
              <ClosedBadge>Closed</ClosedBadge>
              <ClosedText>{closedMessage || 'We are currently closed'}</ClosedText>
            </DeliveryStatus>
          )}
          
          <CTAButtons>
            <PrimaryButton onClick={() => navigate('/menu')}>
              Browse Menu
              <FiArrowRight size={20} />
            </PrimaryButton>
            {!isAuthenticated && (
              <SecondaryButton onClick={() => navigate('/register')}>
                Create Account
              </SecondaryButton>
            )}
          </CTAButtons>
        </HeroContent>
      </HeroSection>

      {/* Quick Info Section */}
      {settings && (
        <QuickInfo>
          <InfoCard>
            <InfoIcon><FiClock size={24} /></InfoIcon>
            <InfoContent>
              <InfoLabel>Operating Hours</InfoLabel>
              <InfoValue>
                {settings.openingTime && settings.closingTime 
                  ? `${settings.openingTime} - ${settings.closingTime}`
                  : '24/7 Available'}
              </InfoValue>
            </InfoContent>
          </InfoCard>
          
          <InfoCard>
            <InfoIcon><FiMapPin size={24} /></InfoIcon>
            <InfoContent>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>
                {settings.restaurantAddress || 'Lagos, Nigeria'}
              </InfoValue>
            </InfoContent>
          </InfoCard>
          
          {settings.restaurantPhone && (
            <InfoCard>
              <InfoIcon><FiPhone size={24} /></InfoIcon>
              <InfoContent>
                <InfoLabel>Call Us</InfoLabel>
                <InfoValue>{settings.restaurantPhone}</InfoValue>
              </InfoContent>
            </InfoCard>
          )}
        </QuickInfo>
      )}

      {/* Featured/Popular Items Section */}
      {featuredItems.length > 0 && (
        <FeaturedSection>
          <SectionHeader>
            <SectionTitle>Popular Dishes</SectionTitle>
            <ViewAllButton onClick={() => navigate('/menu')}>
              View All <FiArrowRight size={16} />
            </ViewAllButton>
          </SectionHeader>
          
          <FeaturedGrid>
            {featuredItems.map(item => (
              <FeaturedCard 
                key={item.id} 
                onClick={() => navigate(`/menu/${item.id}`)}
                $disabled={!isDeliveryOpen}
              >
                <FeaturedImage 
                  src={item.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                  }}
                />
                <FeaturedInfo>
                  <FeaturedName>{item.name}</FeaturedName>
                  <FeaturedCategory>{item.category}</FeaturedCategory>
                  <FeaturedFooter>
                    <FeaturedPrice>₦{item.price.toFixed(2)}</FeaturedPrice>
                    <AddButton 
                      onClick={(e) => handleAddToCart(item, e)}
                      disabled={!item.available || !isDeliveryOpen}
                    >
                      <FiShoppingBag size={18} />
                    </AddButton>
                  </FeaturedFooter>
                </FeaturedInfo>
              </FeaturedCard>
            ))}
          </FeaturedGrid>
        </FeaturedSection>
      )}

      {/* Why Choose Us Section */}
      <WhyChooseUs>
        <SectionTitle>Why Choose Us?</SectionTitle>
        <BenefitsGrid>
          <BenefitCard>
            <BenefitIcon>🚚</BenefitIcon>
            <BenefitTitle>Fast Delivery</BenefitTitle>
            <BenefitText>Quick and reliable delivery to your doorstep</BenefitText>
          </BenefitCard>
          
          <BenefitCard>
            <BenefitIcon>🍽️</BenefitIcon>
            <BenefitTitle>Fresh Ingredients</BenefitTitle>
            <BenefitText>We use only the freshest ingredients</BenefitText>
          </BenefitCard>
          
          <BenefitCard>
            <BenefitIcon>⭐</BenefitIcon>
            <BenefitTitle>Quality Food</BenefitTitle>
            <BenefitText>Authentic Nigerian recipes prepared with care</BenefitText>
          </BenefitCard>
          
          <BenefitCard>
            <BenefitIcon>💳</BenefitIcon>
            <BenefitTitle>Easy Payment</BenefitTitle>
            <BenefitText>Secure and convenient payment options</BenefitText>
          </BenefitCard>
        </BenefitsGrid>
      </WhyChooseUs>
    </Container>
  );
};

const Container = styled.div`
  padding: 0;
  padding-bottom: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
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
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 1rem;
`;

const HeroSection = styled.div`
  background: ${props => props.$hasImages 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  padding: 3rem 1.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
    z-index: 1;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
`;

const BackgroundImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.$active ? 1 : 0};
  transition: opacity 1.5s ease-in-out;
  z-index: 0;
  pointer-events: none;
  will-change: opacity;
  visibility: ${props => props.$active ? 'visible' : 'hidden'};
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.85) 0%,
    rgba(118, 75, 162, 0.85) 100%
  );
  z-index: 1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
`;

const HeroTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: ${props => props.$animated ? 'fadeInUp 1s ease-out' : 'none'};
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.95;
  font-weight: 400;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: ${props => props.$animated ? 'fadeInUp 1s ease-out 0.2s both' : 'none'};
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DeliveryStatus = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ClosedBadge = styled.span`
  background: #ef4444;
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const ClosedText = styled.p`
  font-size: 0.9375rem;
  margin: 0;
  opacity: 0.9;
`;

const CTAButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  animation: fadeInUp 1s ease-out 0.4s both;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PrimaryButton = styled.button`
  background: white;
  color: #667eea;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const SecondaryButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0.98);
  }
`;

const QuickInfo = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const InfoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const InfoValue = styled.div`
  font-size: 0.9375rem;
  color: #333;
  font-weight: 600;
`;

const FeaturedSection = styled.div`
  padding: 1.5rem;
  margin-top: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.9375rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  
  &:active {
    opacity: 0.7;
  }
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const FeaturedCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.$disabled ? 0.6 : 1};
  
  &:active:not([disabled]) {
    transform: scale(0.98);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
`;

const FeaturedInfo = styled.div`
  padding: 0.875rem;
`;

const FeaturedName = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  line-height: 1.3;
`;

const FeaturedCategory = styled.span`
  font-size: 0.75rem;
  color: #999;
  display: block;
  margin-bottom: 0.5rem;
`;

const FeaturedFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FeaturedPrice = styled.div`
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #667eea;
  letter-spacing: 0.01em;
`;

const AddButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.2s ease;
  
  &:active:not(:disabled) {
    transform: scale(0.9);
  }
  
  &:disabled {
    background: #ccc;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const WhyChooseUs = styled.div`
  padding: 1.5rem;
  background: white;
  margin-top: 1rem;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const BenefitCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
`;

const BenefitIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
`;

const BenefitTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const BenefitText = styled.p`
  font-size: 0.8125rem;
  color: #666;
  line-height: 1.4;
  margin: 0;
`;

export default Landing;




