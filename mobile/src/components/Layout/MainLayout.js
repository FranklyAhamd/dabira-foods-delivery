import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiPackage,
  FiLogIn
} from 'react-icons/fi';

const MainLayout = () => {
  const location = useLocation();
  const { getTotalPlates } = useCart();
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isCartPage = location.pathname === '/cart';

  return (
    <Container>
      {/* Header - Hidden on Cart page */}
      {!isCartPage && (
        <Header>
          <Logo>Dabira Foods</Logo>
          <HeaderRight>
            <CartLink to="/cart">
              <FiShoppingCart size={24} />
              {getTotalPlates() > 0 && (
                <CartBadge>{getTotalPlates()}</CartBadge>
              )}
            </CartLink>
            <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
              <FiMenu size={24} />
            </MenuButton>
          </HeaderRight>
        </Header>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <MobileMenu>
          <MenuOverlay onClick={() => setMenuOpen(false)} />
          <MenuContent>
            <MenuHeader>
              <MenuTitle>Menu</MenuTitle>
              <CloseButton onClick={() => setMenuOpen(false)}>
                <FiX size={20} />
              </CloseButton>
            </MenuHeader>
            <MenuList>
              <MenuItem onClick={() => setMenuOpen(false)}>
                <Link to="/">Home</Link>
              </MenuItem>
              <MenuItem onClick={() => setMenuOpen(false)}>
                <Link to="/menu">Menu</Link>
              </MenuItem>
              {isAuthenticated && (
                <>
                  <MenuItem onClick={() => setMenuOpen(false)}>
                    <Link to="/my-orders">My Orders</Link>
                  </MenuItem>
                  <MenuItem onClick={() => setMenuOpen(false)}>
                    <Link to="/profile">Profile</Link>
                  </MenuItem>
                </>
              )}
              {!isAuthenticated && (
                <MenuItem onClick={() => setMenuOpen(false)}>
                  <Link to="/login">Login</Link>
                </MenuItem>
              )}
            </MenuList>
          </MenuContent>
        </MobileMenu>
      )}

      {/* Main Content */}
      <MainContent>
        <Outlet />
      </MainContent>

      {/* Bottom Navigation */}
      <BottomNav>
        <NavItem to="/" $active={isActive('/') && !isActive('/menu')}>
          <NavIcon>
            <FiHome size={20} />
          </NavIcon>
          <NavLabel>Home</NavLabel>
        </NavItem>
        
        <NavItem to="/menu" $active={isActive('/menu')}>
          <NavIcon>
            <FiMenu size={20} />
          </NavIcon>
          <NavLabel>Menu</NavLabel>
        </NavItem>
        
        {isAuthenticated && (
          <NavItem to="/my-orders" $active={isActive('/my-orders')}>
            <NavIcon>
              <FiPackage size={20} />
            </NavIcon>
            <NavLabel>Orders</NavLabel>
          </NavItem>
        )}
        
        <NavItem to="/cart" $active={isActive('/cart')}>
          <NavIcon>
            <FiShoppingCart size={20} />
            {getTotalPlates() > 0 && (
              <NavBadge>{getTotalPlates()}</NavBadge>
            )}
          </NavIcon>
          <NavLabel>Cart</NavLabel>
        </NavItem>
        
        <NavItem to={isAuthenticated ? "/profile" : "/login"} $active={isActive('/profile')}>
          <NavIcon>
            {isAuthenticated ? <FiUser size={20} /> : <FiLogIn size={20} />}
          </NavIcon>
          <NavLabel>{isAuthenticated ? 'Profile' : 'Login'}</NavLabel>
        </NavItem>
      </BottomNav>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f8f8;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  backdrop-filter: blur(10px);
`;

const Logo = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CartLink = styled(Link)`
  position: relative;
  font-size: 1.5rem;
  cursor: pointer;
`;

const CartIcon = styled.span`
  display: flex;
  align-items: center;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

const MenuOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const MenuContent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  max-width: 300px;
  background-color: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #eee;
`;

const MenuTitle = styled.h2`
  font-size: 1.25rem;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  a {
    display: block;
    padding: 1rem 1.5rem;
    color: #333;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f8f8f8;
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding-bottom: 60px; /* Space for bottom nav */
  overflow-y: auto;
`;

const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -4px 16px rgba(102, 126, 234, 0.1);
  padding: 0.5rem 0 max(0.5rem, env(safe-area-inset-bottom));
  z-index: 100;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding: 0.375rem 0.75rem;
  color: ${props => props.$active ? '#667eea' : '#666'};
  font-size: 0.75rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    color: #667eea;
    transform: translateY(-1px);
  }
  
  ${props => props.$active && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 32px;
      height: 2px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 0 0 3px 3px;
    }
  `}
`;

const NavIcon = styled.span`
  font-size: 1.25rem;
  position: relative;
`;

const NavLabel = styled.span`
  font-size: 0.625rem;
  line-height: 1.2;
`;

const NavBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

export default MainLayout;

