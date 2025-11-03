import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

export const Sidebar = styled.div`
  width: 260px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

export const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #FF6B35;
  margin: 0;
`;

export const NavMenu = styled.nav`
  flex: 1;
  padding: 20px 0;
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: ${props => props.$active ? '#FF6B35' : 'transparent'};
  border-left: 4px solid ${props => props.$active ? '#fff' : 'transparent'};

  &:hover {
    background-color: ${props => props.$active ? '#FF6B35' : 'rgba(255, 107, 53, 0.2)'};
  }
`;

export const NavIcon = styled.span`
  font-size: 24px;
  margin-right: 15px;
`;

export const NavText = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

export const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background-color: rgba(244, 67, 54, 0.2);
  }
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Header = styled.div`
  background-color: white;
  padding: 20px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const UserName = styled.span`
  font-size: 16px;
  color: #666;
  font-weight: 500;
`;


