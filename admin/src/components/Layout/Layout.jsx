import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { 
  FiBarChart2, 
  FiMenu, 
  FiPackage, 
  FiSettings, 
  FiLogOut, 
  FiUser,
  FiMapPin
} from 'react-icons/fi';
import {
  LayoutContainer,
  Sidebar,
  SidebarHeader,
  Logo,
  NavMenu,
  NavItem,
  NavIcon,
  NavText,
  LogoutButton,
  Content,
  Header,
  HeaderTitle,
  UserInfo,
  UserName
} from './LayoutStyles';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { path: '/', icon: FiBarChart2, label: 'Dashboard' },
    { path: '/menu', icon: FiMenu, label: 'Menu Management' },
    { path: '/orders', icon: FiPackage, label: 'Orders' },
    { path: '/delivery-locations', icon: FiMapPin, label: 'Delivery Locations' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <Logo>Dabira Foods 🇳🇬</Logo>
        </SidebarHeader>

        <NavMenu>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              $active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <NavIcon>
                <item.icon size={20} />
              </NavIcon>
              <NavText>{item.label}</NavText>
            </NavItem>
          ))}
        </NavMenu>

        <LogoutButton onClick={handleLogoutClick}>
          <NavIcon>
            <FiLogOut size={20} />
          </NavIcon>
          <NavText>Logout</NavText>
        </LogoutButton>
      </Sidebar>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />

      <Content>
        <Header>
          <HeaderTitle>
            {location.pathname === '/menu' ? 'Menu Management' :
             location.pathname === '/orders' ? 'Orders' :
             location.pathname === '/settings' ? 'Settings' :
             location.pathname === '/delivery-locations' ? 'Delivery Locations' :
             location.pathname === '/' ? 'Dashboard' :
             'Nigerian Food Admin Dashboard'}
          </HeaderTitle>
          <UserInfo>
            <UserName>
              <FiUser size={16} /> {user?.name}
            </UserName>
          </UserInfo>
        </Header>
        {children}
      </Content>
    </LayoutContainer>
  );
};

export default Layout;

