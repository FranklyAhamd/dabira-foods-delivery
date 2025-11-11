import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
import api, { API_URL } from '../../config/api';
import { useCart } from '../../context/CartContext';
import { usePlate } from '../../context/PlateContext';
import { useToast } from '../../context/ToastContext';
import PortionModal from '../../components/PortionModal/PortionModal';
import PlateCard from '../../components/PlateCard/PlateCard';
import PlateFilledAlert from '../../components/PlateFilledAlert/PlateFilledAlert';
import { FiSearch, FiPlus, FiRefreshCw } from 'react-icons/fi';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState('Delivery is closed for today.');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { warning } = useToast();
  const { createPlate, addItemToPlate, currentPlate } = usePlate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPortionModal, setShowPortionModal] = useState(false);
  const [isPlateCardHidden, setIsPlateCardHidden] = useState(false);
  const [showPlateFilledAlert, setShowPlateFilledAlert] = useState(false);
  const [filledPlateNumber, setFilledPlateNumber] = useState(1);

  useEffect(() => {
    fetchDeliveryStatus();
    fetchMenuItems();
    fetchCategories();
    
    // Setup Socket.IO connection for real-time updates
    const socketUrl = API_URL.replace('/api', '');
    const newSocket = io(socketUrl);
    
    // Listen for delivery status changes
    newSocket.on('delivery:statusChanged', (data) => {
      console.log('📢 Delivery status changed:', data);
      setIsDeliveryOpen(data.isDeliveryOpen);
      if (data.closedMessage) {
        setClosedMessage(data.closedMessage);
      }
    });
    
    // Listen for menu availability changes
    newSocket.on('menu:availabilityChanged', (data) => {
      console.log('📢 Menu availability changed:', data);
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === data.menuItemId 
            ? { ...item, available: data.available }
            : item
        )
      );
    });
    
    // Cleanup socket on unmount
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

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/menu');
      const fetchedItems = Array.isArray(response?.data?.menuItems)
        ? response.data.menuItems
        : [];
      setMenuItems(fetchedItems);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu:', err);
      if (err.message === 'Network Error' || err.code === 'ECONNABORTED' || err.userMessage) {
        setError(err.userMessage || 'Network connection issue. Please check your internet connection (Airtel, MTN, Glo, etc.) and try again.');
      } else if (err.response?.status >= 500) {
        setError('Server temporarily unavailable. Please try again in a moment.');
      } else {
        setError('Failed to load menu items. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/menu/categories');
      const fetchedCategories = Array.isArray(response?.data?.categories)
        ? response.data.categories
        : [];
      // Categories are now objects with { name, isTakeaway }, extract names for filtering
      const categoryNames = fetchedCategories.map(cat => 
        typeof cat === 'string' ? cat : cat.name
      );
      setCategories(['All', ...categoryNames]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];
  const filteredItems = safeMenuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleItemClick = (item, e) => {
    e.stopPropagation();
    
    // Prevent adding when delivery is closed
    if (!isDeliveryOpen) {
      warning(closedMessage || 'Delivery is currently closed. Orders cannot be placed at this time.');
      return;
    }
    
    // Prevent adding unavailable items
    if (!item.available) {
      return;
    }
    
    setSelectedItem(item);
    setShowPortionModal(true);
  };

  const handlePortionConfirm = (menuItem, portions) => {
    let result;
    if (currentPlate) {
      // Add to existing plate - this may create a new plate if limit is exceeded
      result = addItemToPlate(menuItem, portions);
    } else {
      // Create new plate
      const newPlate = createPlate(menuItem, portions);
      result = { plate: newPlate, newPlateCreated: false };
    }
    
    // Check if a new plate was created (takeaway limit exceeded)
    if (result.newPlateCreated) {
      setFilledPlateNumber(result.filledPlateNumber);
      setShowPlateFilledAlert(true);
    }
    
    // Show the PlateCard again when an item is added
    setIsPlateCardHidden(false);
    // Modal will close automatically via onClose callback in handleConfirm
  };

  // Check if we're editing a plate from cart
  useEffect(() => {
    if (currentPlate && currentPlate.items.length > 0) {
      // If there's a current plate, it means we're either creating or editing
      // The PlateCard will handle adding it back to cart
    }
  }, [currentPlate]);

  const handleAddMoreClick = (e) => {
    // Hide the PlateCard so the menu is fully visible
    setIsPlateCardHidden(true);
    
    // Scroll to the top of the menu to allow users to select more items
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Also close the portion modal if it's open
    setShowPortionModal(false);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <Container>
        <HeroSection>
          <HeroTitle>Nigerian Delicacies</HeroTitle>
          <HeroSubtitle>Authentic Nigerian food delivered to your doorstep</HeroSubtitle>
        </HeroSection>

        <SearchBar>
          <SearchIcon>
            <FiSearch size={20} />
          </SearchIcon>
          <SearchInput disabled placeholder="Searching menu..." value="" />
        </SearchBar>

        <Categories $sticky>
          <CategoriesScroll>
            {[...'Loading'.split('')].map((_, idx) => (
              <CategorySkeleton key={idx} />
            ))}
          </CategoriesScroll>
        </Categories>

        <ProductsGrid>
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCard key={i}>
              <ImageContainer>
                <ImageSkeleton />
              </ImageContainer>
              <ProductInfo>
                <NameSkeleton />
                <DescSkeleton />
                <ProductFooter>
                  <PriceSkeleton />
                  <ButtonSkeleton />
                </ProductFooter>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
      </Container>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorIcon>📡</ErrorIcon>
        <ErrorText>{error}</ErrorText>
        <ErrorHelp>
          If using Airtel, MTN, Glo, or 9mobile, ensure you have a stable connection.
        </ErrorHelp>
        <RetryButton onClick={fetchMenuItems}>
          <FiRefreshCw size={18} style={{ marginRight: '8px' }} />
          Retry Connection
        </RetryButton>
      </ErrorContainer>
    );
  }

  if (!isDeliveryOpen) {
    return (
      <Container>
        <HeroSection>
          <HeroTitle>We are closed</HeroTitle>
          <HeroSubtitle>Delivery Hours</HeroSubtitle>
        </HeroSection>

        <ClosedContainer>
          <ClosedEmoji>🕒</ClosedEmoji>
          <ClosedTitle>Delivery Closed</ClosedTitle>
          <ClosedText>{closedMessage}</ClosedText>
        </ClosedContainer>
      </Container>
    );
  }

  return (
    <Container>
      <HeroSection>
        <HeroTitle>Nigerian Delicacies</HeroTitle>
        <HeroSubtitle>Authentic Nigerian food delivered to your doorstep</HeroSubtitle>
      </HeroSection>

      <SearchBar>
        <SearchIcon>
          <FiSearch size={20} />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search for Nigerian dishes..."
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>

      <CategorySelectWrapper>
        <CategorySelect
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </CategorySelect>
      </CategorySelectWrapper>

      {filteredItems.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🍽️</EmptyIcon>
          <EmptyText>No items found</EmptyText>
        </EmptyState>
      ) : (
        <ProductsGrid>
          {filteredItems.map(item => (
            <ProductCard 
              key={item.id} 
              onClick={(e) => handleItemClick(item, e)}
              $disabled={!isDeliveryOpen || !item.available}
            >
              <ImageContainer>
                <ProductImage 
                  $unavailable={!item.available}
                  src={item.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="#f5f5f5"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#999" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>'} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="#f5f5f5"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#999" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>';
                  }}
                />
                {!item.available && (
                  <UnavailableBadge>Unavailable</UnavailableBadge>
                )}
              </ImageContainer>
              
              <ProductInfo>
                <ProductName>{item.name}</ProductName>
                <ProductDescription>{item.description}</ProductDescription>

                <ProductFooter>
                  <PriceContainer>
                    <Price $unavailable={!item.available}>
                      ₦{item.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Price>
                  </PriceContainer>
                  
                  <AddToCartButton 
                    onClick={(e) => handleItemClick(item, e)}
                    disabled={!item.available || !isDeliveryOpen}
                    $unavailable={!item.available}
                    aria-label={item.available && isDeliveryOpen ? "Add to plate" : "Item unavailable or delivery closed"}
                  >
                    {item.available ? (
                      <FiPlus size={16} />
                    ) : (
                      <span style={{ fontSize: '12px' }}>✕</span>
                    )}
                  </AddToCartButton>
                </ProductFooter>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}

              {/* Portion Modal */}
              <PortionModal
                isOpen={showPortionModal}
                onClose={() => {
                  setShowPortionModal(false);
                  setSelectedItem(null);
                }}
                menuItem={selectedItem}
                onConfirm={handlePortionConfirm}
                isDeliveryOpen={isDeliveryOpen}
              />

      {/* Plate Card */}
      {currentPlate && currentPlate.items.length > 0 && (
        <PlateCard
          onAddMoreClick={handleAddMoreClick}
          isDeliveryOpen={isDeliveryOpen}
          isHidden={isPlateCardHidden}
        />
      )}

      {/* Plate Filled Alert */}
      <PlateFilledAlert
        isOpen={showPlateFilledAlert}
        onClose={() => setShowPlateFilledAlert(false)}
        plateNumber={filledPlateNumber}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 0;
  padding-bottom: 2rem;
  background: #f8f9fa;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2.5rem 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
`;

const HeroTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const HeroSubtitle = styled.p`
  font-size: 0.9375rem;
  opacity: 0.95;
  font-weight: 400;
`;

const SearchBar = styled.div`
  margin: 0 1rem 1rem;
  position: relative;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  z-index: 1;
  color: #999;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Categories = styled.div`
  margin: 0 1rem 1.25rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: ${props => props.$sticky ? 'sticky' : 'static'};
  top: ${props => props.$sticky ? '0' : 'auto'};
  z-index: 5;
  background: ${props => props.$sticky ? 'linear-gradient(180deg, #f8f9fa 70%, rgba(248,249,250,0))' : 'transparent'};
  padding-top: ${props => props.$sticky ? '0.5rem' : '0'};
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoriesScroll = styled.div`
  display: flex;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
`;

const CategoryChip = styled.button`
  padding: 0.625rem 1.25rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
  background: ${props => props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: none;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  
  &:active {
    transform: scale(0.95);
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0 0.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding: 0 1rem;
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: ${props => props.$disabled ? 0.6 : 1};
  
  &:active {
    transform: ${props => props.$disabled ? 'none' : 'scale(0.98)'};
    box-shadow: ${props => props.$disabled ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 4px 12px rgba(0, 0, 0, 0.12)'};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 70%; /* Reduced from 100% to make images smaller */
  overflow: hidden;
  background: #f8f9fa;
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  opacity: ${props => props.$unavailable ? 0.6 : 1};
  filter: ${props => props.$unavailable ? 'grayscale(30%)' : 'none'};
  
  ${ProductCard}:active & {
    transform: scale(1.05);
  }
`;

// Skeletons
const shimmer = `
  background: linear-gradient(90deg, #eeeeee 25%, #f5f5f5 37%, #eeeeee 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
  @keyframes shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }
`;

const ImageSkeleton = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 8px;
  ${shimmer}
`;

const NameSkeleton = styled.div`
  height: 16px;
  width: 60%;
  border-radius: 8px;
  margin: 0.5rem 0 0.75rem;
  ${shimmer}
`;

const DescSkeleton = styled.div`
  height: 12px;
  width: 90%;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  ${shimmer}
`;

const PriceSkeleton = styled.div`
  height: 18px;
  width: 80px;
  border-radius: 8px;
  ${shimmer}
`;

const ButtonSkeleton = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  ${shimmer}
`;

const CategorySkeleton = styled.div`
  height: 36px;
  width: 80px;
  border-radius: 20px;
  ${shimmer}
`;

const UnavailableBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  z-index: 2;
`;

const ProductInfo = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProductName = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.125rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductDescription = styled.p`
  font-size: 0.6875rem;
  color: #666;
  margin-bottom: 0.375rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  letter-spacing: 0.01em;
  color: ${props => props.$unavailable ? '#999' : '#667eea'};
  line-height: 1.2;
  text-decoration: ${props => props.$unavailable ? 'line-through' : 'none'};
`;

const PriceSubtext = styled.span`
  font-size: 0.6875rem;
  color: #999;
  margin-top: 0.125rem;
`;

const AddToCartButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$unavailable 
    ? '#e5e7eb' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${props => props.$unavailable ? '#999' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.$unavailable 
    ? 'none' 
    : '0 4px 12px rgba(102, 126, 234, 0.4)'};
  transition: all 0.2s ease;
  flex-shrink: 0;
  cursor: ${props => props.$unavailable ? 'not-allowed' : 'pointer'};
  
  &:active:not(:disabled) {
    transform: scale(0.9);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
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
  color: #667eea;
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

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.p`
  color: #c33;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const ErrorHelp = styled.p`
  color: #666;
  font-size: 0.875rem;
  max-width: 300px;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s;
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  gap: 1rem;
  padding: 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
`;

const EmptyText = styled.p`
  color: #666;
  font-size: 1.125rem;
`;

// Delivery closed styles
const ClosedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin: 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.08);
`;

const ClosedEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 0.75rem;
`;

const ClosedTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
`;

const ClosedText = styled.p`
  font-size: 0.95rem;
  color: #666;
  text-align: center;
`;

const CategorySelectWrapper = styled.div`
  margin: 0 1rem 1.25rem;
  display: flex;
`;

const CategorySelect = styled.select`
  width: 100%;
  padding: 0.65rem 2.25rem 0.65rem 1rem;
  border: none;
  border-radius: 24px;
  font-size: 0.95rem;
  font-weight: 600;
  background: linear-gradient(90deg, #fff 80%, #f3f4f6 100%);
  box-shadow: 0 1px 5px 0 rgba(150, 150, 170, 0.10);
  color: #222;
  appearance: none;
  outline: none;
  position: relative;
  transition: box-shadow 0.15s;
  cursor: pointer;
  background-image:
    url('data:image/svg+xml;utf8,<svg width="24" height="24" fill="%23667eea" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 10l4 4 4-4" stroke="%23667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 22px 22px;
  &:focus {
    box-shadow: 0 3px 18px rgba(102, 126, 234, 0.13);
    border-color: #667eea;
  }

  option {
    font-size: 1rem;
    color: #222;
    background: white;
  }
`;

export default Menu;




