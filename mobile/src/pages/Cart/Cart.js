import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api, { API_URL } from '../../config/api';
import { 
  FiShoppingCart, 
  FiTrash2, 
  FiMinus, 
  FiPlus, 
  FiArrowRight,
  FiEdit
} from 'react-icons/fi';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updatePlateItemPortions, removeFromCart, removePlateItem, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const { warning } = useToast();
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState('');
  const [expandedPlate, setExpandedPlate] = useState(null);

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
      warning(closedMessage || 'Delivery is currently closed. Orders cannot be placed at this time.');
      return;
    }
    
    if (cartItems.length === 0) {
      return;
    }
    
    navigate('/checkout', { state: { isGuest: true } });
  };

  const handleLoginCheckout = () => {
    if (!isDeliveryOpen) {
      warning(closedMessage || 'Delivery is currently closed. Orders cannot be placed at this time.');
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
        {cartItems.map((plate, index) => {
          const plateTotal = plate.items.reduce(
            (sum, item) => sum + (item.menuItem.price * item.portions),
            0
          );
          const isExpanded = expandedPlate === plate.id;
          const totalItems = plate.items.reduce((sum, item) => sum + item.portions, 0);
          
          return (
            <PlateWrapper key={plate.id}>
              <CompactPlateCard 
                onClick={() => setExpandedPlate(isExpanded ? null : plate.id)}
                $expanded={isExpanded}
              >
                <PlateSVGContainer>
                  <PlateNumberBadge>#{index + 1}</PlateNumberBadge>
                  <PlateSVG viewBox="0 0 148 113" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FCFCFC" opacity="1.000000" stroke="none" d="M1.000000,38.000000 C1.000000,25.677130 1.000000,13.354259 1.000000,1.015695 C50.281013,1.015695 99.562027,1.015695 148.921524,1.015695 C148.921524,38.582260 148.921524,76.164726 148.921524,113.873596 C99.666855,113.873596 50.333481,113.873596 1.000054,113.876190 C1.000000,90.898300 1.000000,67.917809 1.271612,44.696140 C5.749721,45.577686 9.950054,47.647953 14.163676,47.675358 C52.807735,47.926723 91.454124,47.839943 130.099747,47.792046 C133.081436,47.788349 136.117386,47.605335 139.031464,47.022480 C143.722290,46.084251 145.320770,43.060226 143.931320,38.541489 C140.615692,27.758305 132.494781,20.972294 121.181984,20.891424 C88.711594,20.659309 56.238285,20.865133 23.766254,20.814766 C14.863879,20.800957 8.551422,24.838196 4.262136,32.433262 C3.204665,34.305729 2.088943,36.145306 1.000000,38.000000 M114.204361,104.887161 C123.392792,104.484604 126.114189,102.553749 128.257507,93.801743 C131.068680,82.322601 133.543976,70.760811 136.119019,59.224590 C136.638763,56.896191 136.958908,54.523239 137.392181,52.050362 C93.790253,52.050362 50.868744,52.050362 7.312910,52.050362 C10.423323,65.897041 13.298814,79.383682 16.514364,92.788757 C18.947800,102.933311 21.733543,104.888657 32.279373,104.892128 C59.276024,104.901024 86.272682,104.891808 114.204361,104.887161 z"></path>
                    <path fill="#575757" opacity="1.000000" stroke="none" d="M1.000000,38.428463 C2.088943,36.145306 3.204665,34.305729 4.262136,32.433262 C8.551422,24.838196 14.863879,20.800957 23.766254,20.814766 C56.238285,20.865133 88.711594,20.659309 121.181984,20.891424 C132.494781,20.972294 140.615692,27.758305 143.931320,38.541489 C145.320770,43.060226 143.722290,46.084251 139.031464,47.022480 C136.117386,47.605335 133.081436,47.788349 130.099747,47.792046 C91.454124,47.839943 52.807735,47.926723 14.163676,47.675358 C9.950054,47.647953 5.749721,45.577686 1.271612,44.227482 C1.000000,42.285641 1.000000,40.571285 1.000000,38.428463 z"></path>
                    <path fill="#575757" opacity="1.000000" stroke="none" d="M113.736847,104.888504 C86.272682,104.891808 59.276024,104.901024 32.279373,104.892128 C21.733543,104.888657 18.947800,102.933311 16.514364,92.788757 C13.298814,79.383682 10.423323,65.897041 7.312910,52.050362 C50.868744,52.050362 93.790253,52.050362 137.392181,52.050362 C136.958908,54.523239 136.638763,56.896191 136.119019,59.224590 C133.543976,70.760811 131.068680,82.322601 128.257507,93.801743 C126.114189,102.553749 123.392792,104.484604 113.736847,104.888504 M82.176437,93.537888 C84.864281,95.865959 86.215919,94.494591 86.264687,91.696358 C86.417480,82.928177 86.476845,74.151207 86.239532,65.386658 C86.134079,61.492115 84.227448,61.059189 80.954201,64.286339 C80.647392,64.834579 80.077812,65.380623 80.073212,65.931389 C80.005180,74.078735 79.960388,82.227448 80.076538,90.373451 C80.088974,91.245644 81.143097,92.102989 82.176437,93.537888 M64.307602,91.682014 C64.482803,83.209846 64.678703,74.737930 64.779221,66.264877 C64.784950,65.781998 64.010223,65.289848 63.245094,64.261917 C62.254513,63.633892 61.263935,63.005867 60.273354,62.377838 C59.747108,63.490406 58.781502,64.596329 58.764553,65.716599 C58.636295,74.195831 58.636143,82.678749 58.763420,91.158005 C58.780293,92.281868 59.740925,93.391563 60.264481,94.507828 C61.371552,93.750061 62.478626,92.992302 64.307602,91.682014 M97.987572,63.579285 C94.343193,60.440254 93.407539,62.897068 93.353546,66.043449 C93.216705,74.017456 93.184151,81.999496 93.427902,89.968590 C93.477150,91.578850 94.928009,93.146233 95.732674,94.733391 C96.552185,93.179909 98.017342,91.653198 98.083054,90.068459 C98.426834,81.778580 98.415604,73.473976 98.992470,64.936935 C98.785324,64.663261 98.578186,64.389595 97.987572,63.579285 M51.738510,87.284279 C51.737911,80.665131 51.899494,74.039352 51.629772,67.431190 C51.556667,65.640007 50.179985,63.902027 49.401619,62.139626 C48.525459,63.817272 46.954628,65.469742 46.892765,67.176903 C46.617275,74.778931 46.639080,82.400902 46.882183,90.005150 C46.933342,91.605339 48.369766,93.161240 49.167873,94.737549 C50.024300,93.223732 50.954865,91.744972 51.696507,90.176872 C51.952408,89.635803 51.737934,88.872261 51.738510,87.284279 M40.013947,82.465927 C40.010025,76.817001 40.128304,71.163132 39.900295,65.523270 C39.854042,64.379143 38.501167,63.287834 37.750652,62.172173 C36.889381,63.179192 35.303497,64.170044 35.280617,65.195770 C35.084278,73.996979 35.086647,82.806374 35.282551,91.607689 C35.306087,92.665268 36.837082,93.689293 37.669376,94.728874 C38.441959,93.627510 39.726406,92.593727 39.882572,91.410980 C40.227692,88.797142 40.005024,86.108353 40.013947,82.465927 M75.002701,76.511955 C74.997879,72.851387 75.173874,69.176399 74.883904,65.538559 C74.790489,64.366730 73.470154,63.292694 72.711090,62.173920 C71.823166,63.325447 70.195702,64.458069 70.165695,65.631531 C69.948883,74.111755 69.953262,82.602852 70.171280,91.083221 C70.203186,92.323921 71.739899,93.525932 72.580330,94.745850 C73.384621,93.491608 74.798042,92.276978 74.882629,90.975945 C75.173508,86.502098 74.999535,81.998016 75.002701,76.511955 M109.889244,76.512421 C109.886154,72.855804 110.061363,69.185234 109.777077,65.550613 C109.685448,64.379257 108.384369,63.302502 107.636566,62.182476 C106.775002,63.351467 105.197250,64.502090 105.166740,65.692390 C104.949554,74.163589 104.948883,82.645332 105.157341,91.116890 C105.187592,92.346634 106.700897,93.539902 107.527946,94.750046 C108.314339,93.489624 109.696358,92.266884 109.778908,90.961937 C110.061691,86.492088 109.888481,81.993401 109.889244,76.512421 z"></path>
                    <path fill="#EAEAEA" opacity="1.000000" stroke="none" d="M51.738419,87.747314 C51.737934,88.872261 51.952408,89.635803 51.696507,90.176872 C50.954865,91.744972 50.024300,93.223732 49.167877,94.737549 C48.369766,93.161240 46.933342,91.605339 46.882183,90.005150 C46.639080,82.400902 46.617275,74.778931 46.892765,67.176903 C46.954628,65.469742 48.525459,63.817272 49.401619,62.139626 C50.179985,63.902027 51.556667,65.640007 51.629772,67.431190 C51.899494,74.039352 51.737911,80.665131 51.738419,87.747314 z"></path>
                    <path fill="#E9E9E9" opacity="1.000000" stroke="none" d="M98.527794,65.174492 C98.415604,73.473976 98.426834,81.778580 98.083054,90.068459 C98.017342,91.653198 96.552185,93.179909 95.732674,94.733391 C94.928009,93.146233 93.477150,91.578850 93.427902,89.968590 C93.184151,81.999496 93.216705,74.017456 93.353546,66.043449 C93.407539,62.897068 94.343193,60.440254 98.169617,64.119514 C98.410362,64.831322 98.469078,65.002907 98.527794,65.174492 z"></path>
                    <path fill="#E6E6E6" opacity="1.000000" stroke="none" d="M40.013962,82.958031 C40.005024,86.108353 40.227692,88.797142 39.882572,91.410980 C39.726406,92.593727 38.441959,93.627510 37.669376,94.728874 C36.837082,93.689293 35.306087,92.665268 35.282551,91.607689 C35.086647,82.806374 35.084278,73.996979 35.280617,65.195770 C35.303497,64.170044 36.889381,63.179192 37.750656,62.172173 C38.501167,63.287834 39.854042,64.379143 39.900295,65.523270 C40.128304,71.163132 40.010025,76.817001 40.013962,82.958031 z"></path>
                    <path fill="#E5E5E5" opacity="1.000000" stroke="none" d="M75.002701,77.008713 C74.999535,81.998016 75.173508,86.502098 74.882629,90.975945 C74.798042,92.276978 73.384621,93.491608 72.580330,94.745850 C71.739899,93.525932 70.203186,92.323921 70.171280,91.083221 C69.953262,82.602852 69.948883,74.111755 70.165695,65.631531 C70.195702,64.458069 71.823166,63.325447 72.711090,62.173920 C73.470154,63.292694 74.790489,64.366730 74.883904,65.538559 C75.173874,69.176399 74.997879,72.851387 75.002701,77.008713 z"></path>
                    <path fill="#E5E5E5" opacity="1.000000" stroke="none" d="M109.889198,77.009064 C109.888481,81.993401 110.061691,86.492088 109.778908,90.961937 C109.696358,92.266884 108.314339,93.489624 107.527939,94.750046 C106.700897,93.539902 105.187592,92.346634 105.157341,91.116890 C104.948883,82.645332 104.949554,74.163589 105.166740,65.692390 C105.197250,64.502090 106.775002,63.351467 107.636566,62.182472 C108.384369,63.302502 109.685448,64.379257 109.777077,65.550613 C110.061363,69.185234 109.886154,72.855804 109.889198,77.009064 z"></path>
                    <path fill="#F6F6F6" opacity="1.000000" stroke="none" d="M63.585701,92.234543 C62.478626,92.992302 61.371552,93.750061 60.264481,94.507828 C59.740925,93.391563 58.780293,92.281868 58.763420,91.158005 C58.636143,82.678749 58.636295,74.195831 58.764553,65.716599 C58.781502,64.596329 59.747108,63.490406 60.273354,62.377838 C61.263935,63.005867 62.254513,63.633892 63.300240,64.941216 C63.432159,74.491859 63.508930,83.363197 63.585701,92.234543 z"></path>
                    <path fill="#F5F5F5" opacity="1.000000" stroke="none" d="M81.685417,64.034325 C84.227448,61.059189 86.134079,61.492115 86.239532,65.386658 C86.476845,74.151207 86.417480,82.928177 86.264687,91.696358 C86.215919,94.494591 84.864281,95.865959 81.992706,92.788437 C81.767792,82.704102 81.726601,73.369217 81.685417,64.034325 z"></path>
                    <path fill="#474747" opacity="1.000000" stroke="none" d="M81.319809,64.160332 C81.726601,73.369217 81.767792,82.704102 81.761490,92.503105 C81.143097,92.102989 80.088974,91.245644 80.076538,90.373451 C79.960388,82.227448 80.005180,74.078735 80.073212,65.931389 C80.077812,65.380623 80.647392,64.834579 81.319809,64.160332 z"></path>
                    <path fill="#474747" opacity="1.000000" stroke="none" d="M63.946651,91.958282 C63.508930,83.363197 63.432159,74.491859 63.477058,65.211266 C64.010223,65.289848 64.784950,65.781998 64.779221,66.264877 C64.678703,74.737930 64.482803,83.209846 63.946651,91.958282 z"></path>
                    <path fill="#4B4B4B" opacity="1.000000" stroke="none" d="M98.760132,65.055710 C98.469078,65.002907 98.410362,64.831322 98.361343,64.387833 C98.578186,64.389595 98.785324,64.663261 98.760132,65.055710 z"></path>
                  </PlateSVG>
                </PlateSVGContainer>
                
                <PlateInfo>
                  <PlateTotalCompact>₦{plateTotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</PlateTotalCompact>
                  <PlateItemsCount>{totalItems} {totalItems === 1 ? 'item' : 'items'}</PlateItemsCount>
                </PlateInfo>
                
                <PlateActions onClick={(e) => e.stopPropagation()}>
                  <EditButton onClick={() => {/* TODO: Implement edit functionality */}}>
                    <FiEdit size={16} />
                  </EditButton>
                  <DeleteButton onClick={() => removeFromCart(plate.id)}>
                    <FiTrash2 size={16} />
                  </DeleteButton>
                </PlateActions>
              </CompactPlateCard>
              
              {isExpanded && (
                <ExpandedContent>
                  {plate.items.map(item => (
                    <CompactCartItem key={item.menuItem.id}>
                      <ItemImageCompact 
                        src={item.menuItem.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="#f0f0f0"/></svg>'}
                        alt={item.menuItem.name}
                      />
                      
                      <ItemDetailsCompact>
                        <ItemNameCompact>{item.menuItem.name}</ItemNameCompact>
                        <ItemPriceCompact>₦{item.menuItem.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/portion</ItemPriceCompact>
                        
                        <QuantityControlsCompact>
                          <QuantityButtonCompact 
                            onClick={() => updatePlateItemPortions(plate.id, item.menuItem.id, item.portions - 1)}
                          >
                            <FiMinus size={12} />
                          </QuantityButtonCompact>
                          <QuantityValueCompact>{item.portions}</QuantityValueCompact>
                          <QuantityButtonCompact 
                            onClick={() => updatePlateItemPortions(plate.id, item.menuItem.id, item.portions + 1)}
                          >
                            <FiPlus size={12} />
                          </QuantityButtonCompact>
                        </QuantityControlsCompact>
                      </ItemDetailsCompact>
                      
                      <ItemActionsCompact>
                        <ItemTotalCompact>₦{(item.menuItem.price * item.portions).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</ItemTotalCompact>
                        <RemoveButtonCompact onClick={() => removePlateItem(plate.id, item.menuItem.id)}>
                          <FiTrash2 size={14} />
                        </RemoveButtonCompact>
                      </ItemActionsCompact>
                    </CompactCartItem>
                  ))}
                </ExpandedContent>
              )}
            </PlateWrapper>
          );
        })}
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
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.25);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const Title = styled.h2`
  font-size: 1.625rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  position: relative;
  z-index: 1;
`;

const ClearButton = styled.button`
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.25);
  padding: 0.625rem 1rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: none;
  transition: all 0.2s;
  position: relative;
  z-index: 1;
  
  &:active {
    background: rgba(255, 255, 255, 0.35);
    transform: scale(0.95);
  }
`;

const ItemsList = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  padding-bottom: 1.5rem;
`;

const PlateWrapper = styled.div`
  margin-bottom: 1rem;
`;

const CompactPlateCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: ${props => props.$expanded ? '2px solid #667eea' : '2px solid transparent'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$expanded 
      ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' 
      : 'transparent'};
    transition: all 0.3s;
  }
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
`;

const PlateSVGContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 0.5rem;
`;

const PlateNumberBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.625rem;
  font-weight: 800;
  padding: 0.25rem 0.375rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  z-index: 2;
  min-width: 24px;
  text-align: center;
  line-height: 1;
`;

const PlateSVG = styled.svg`
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const PlateInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const PlateTotalCompact = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.02em;
`;

const PlateItemsCount = styled.div`
  font-size: 0.8125rem;
  color: #6c757d;
  font-weight: 500;
`;

const PlateActions = styled.div`
  display: flex;
  gap: 0.625rem;
  flex-shrink: 0;
`;

const EditButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8edff 100%);
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.15);
  transition: all 0.2s;
  
  &:active {
    background: linear-gradient(135deg, #e0e8ff 0%, #d8e0ff 100%);
    transform: scale(0.92);
    box-shadow: 0 1px 3px rgba(102, 126, 234, 0.2);
  }
`;

const DeleteButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.15);
  transition: all 0.2s;
  
  &:active {
    background: linear-gradient(135deg, #ffe0e0 0%, #ffd8d8 100%);
    transform: scale(0.92);
    box-shadow: 0 1px 3px rgba(239, 68, 68, 0.2);
  }
`;

const ExpandedContent = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CompactCartItem = styled.div`
  display: flex;
  gap: 0.75rem;
  background: white;
  padding: 0.75rem;
  border-radius: 10px;
  margin-bottom: 0.625rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }
`;

const ItemImageCompact = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const ItemDetailsCompact = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const ItemNameCompact = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #212529;
  line-height: 1.3;
  letter-spacing: -0.2px;
`;

const ItemPriceCompact = styled.div`
  font-size: 0.8125rem;
  color: #6c757d;
  font-weight: 500;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  letter-spacing: 0.01em;
`;

const QuantityControlsCompact = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-top: 0.375rem;
`;

const QuantityButtonCompact = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
  transition: all 0.2s;
  
  &:active {
    transform: scale(0.9);
    box-shadow: 0 1px 3px rgba(102, 126, 234, 0.4);
  }
`;

const QuantityValueCompact = styled.span`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #212529;
  min-width: 24px;
  text-align: center;
`;

const ItemActionsCompact = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.375rem;
`;

const ItemTotalCompact = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.02em;
`;

const RemoveButtonCompact = styled.button`
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  border: none;
  color: #ef4444;
  padding: 0.375rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(239, 68, 68, 0.15);
  transition: all 0.2s;
  
  &:active {
    background: linear-gradient(135deg, #ffe0e0 0%, #ffd8d8 100%);
    transform: scale(0.9);
  }
`;

const Footer = styled.div`
  background: white;
  padding: 1.5rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom));
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.2) 50%, transparent 100%);
  }
`;

const Summary = styled.div`
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.625rem;
  align-items: center;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  font-size: 0.9375rem;
  color: #6c757d;
  font-weight: 500;
`;

const SummaryValue = styled.span`
  font-size: 0.9375rem;
  color: #212529;
  font-weight: 600;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  letter-spacing: 0.01em;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.2) 50%, transparent 100%);
  margin: 0.875rem 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 800;
  color: #212529;
  letter-spacing: -0.3px;
`;

const TotalValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.03em;
`;

const ClosedWarning = styled.div`
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #ffc107;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
`;

const ClosedWarningText = styled.p`
  color: #856404;
  font-size: 0.875rem;
  text-align: center;
  margin: 0;
  font-weight: 600;
  line-height: 1.4;
`;

const CheckoutButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const ExpressCheckoutButton = styled.button`
  width: 100%;
  background: ${props => props.disabled 
    ? 'linear-gradient(135deg, #ccc 0%, #bbb 100%)' 
    : 'linear-gradient(135deg, #FF6B35 0%, #f7931e 100%)'};
  color: white;
  padding: 1.125rem 1.5rem;
  border-radius: 14px;
  font-size: 1.0625rem;
  font-weight: 800;
  box-shadow: ${props => props.disabled 
    ? 'none' 
    : '0 6px 20px rgba(255, 107, 53, 0.35)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  border: none;
  letter-spacing: -0.3px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.97);
    box-shadow: 0 3px 12px rgba(255, 107, 53, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const LoginCheckoutButton = styled.button`
  width: 100%;
  background: ${props => props.disabled 
    ? 'linear-gradient(135deg, #ccc 0%, #bbb 100%)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  padding: 1.125rem 1.5rem;
  border-radius: 14px;
  font-size: 1.0625rem;
  font-weight: 800;
  box-shadow: ${props => props.disabled 
    ? 'none' 
    : '0 6px 20px rgba(102, 126, 234, 0.35)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  border: none;
  letter-spacing: -0.3px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.97);
    box-shadow: 0 3px 12px rgba(102, 126, 234, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: 1.5rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 0.75rem;
`;

const EmptyTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.9375rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

const BrowseButton = styled.button`
  background-color: #FF6B35;
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  
  &:active {
    background-color: #e55a28;
    transform: scale(0.98);
  }
`;

export default Cart;
