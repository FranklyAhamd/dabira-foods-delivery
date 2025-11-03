import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiBarChart2, 
  FiMenu, 
  FiPackage, 
  FiSettings, 
  FiLogOut, 
  FiUser 
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

  const menuItems = [
    { path: '/', icon: FiBarChart2, label: 'Dashboard' },
    { path: '/menu', icon: FiMenu, label: 'Menu Management' },
    { path: '/orders', icon: FiPackage, label: 'Orders' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
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

        <LogoutButton onClick={handleLogout}>
          <NavIcon>
            <FiLogOut size={20} />
          </NavIcon>
          <NavText>Logout</NavText>
        </LogoutButton>
      </Sidebar>

      <Content>
        <Header>
          <HeaderTitle>Nigerian Food Admin Dashboard</HeaderTitle>
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

