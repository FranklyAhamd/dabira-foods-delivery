import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { info } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSave = async () => {
    setMessage('');
    setLoading(true);
    
    const result = await updateProfile({ name, phone });
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message || 'Failed to update profile');
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setIsEditing(false);
    setMessage('');
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <Header>
        <Avatar>{user?.name?.charAt(0).toUpperCase()}</Avatar>
        <UserInfo>
          <UserName>{user?.name}</UserName>
          <UserEmail>{user?.email}</UserEmail>
        </UserInfo>
      </Header>

      {message && (
        <Message success={message.includes('success')}>
          {message}
        </Message>
      )}

      <Section>
        <SectionHeader>
          <SectionTitle>Personal Information</SectionTitle>
          {!isEditing && (
            <EditButton onClick={() => setIsEditing(true)}>
              Edit
            </EditButton>
          )}
        </SectionHeader>

        <FormGroup>
          <Label>Full Name</Label>
          {isEditing ? (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          ) : (
            <Value>{user?.name}</Value>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <Value>{user?.email}</Value>
          <Helper>Email cannot be changed</Helper>
        </FormGroup>

        <FormGroup>
          <Label>Phone</Label>
          {isEditing ? (
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              disabled={loading}
            />
          ) : (
            <Value>{user?.phone || 'Not provided'}</Value>
          )}
        </FormGroup>

        {isEditing && (
          <ButtonGroup>
            <CancelButton onClick={handleCancel} disabled={loading}>
              Cancel
            </CancelButton>
            <SaveButton onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </SaveButton>
          </ButtonGroup>
        )}
      </Section>

      <Section>
        <SectionTitle>Account</SectionTitle>

        <MenuItem onClick={() => navigate('/my-orders')}>
          <MenuIcon>📦</MenuIcon>
          <MenuText>My Orders</MenuText>
          <MenuArrow>→</MenuArrow>
        </MenuItem>

        <MenuItem onClick={() => info('Coming soon!')}>
          <MenuIcon>❤️</MenuIcon>
          <MenuText>Favorites</MenuText>
          <MenuArrow>→</MenuArrow>
        </MenuItem>

        <MenuItem onClick={() => info('Coming soon!')}>
          <MenuIcon>📍</MenuIcon>
          <MenuText>Saved Addresses</MenuText>
          <MenuArrow>→</MenuArrow>
        </MenuItem>

        <MenuItem onClick={() => info('Coming soon!')}>
          <MenuIcon>💳</MenuIcon>
          <MenuText>Payment Methods</MenuText>
          <MenuArrow>→</MenuArrow>
        </MenuItem>
      </Section>

      <Section>
        <LogoutButton onClick={handleLogoutClick}>
          Logout
        </LogoutButton>
      </Section>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />

      <AppInfo>
        <AppVersion>Dabira Foods v1.0.0</AppVersion>
      </AppInfo>
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
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #1a1a1a;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border: 1px solid #2a2a2a;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #FF6B35;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.p`
  font-size: 0.875rem;
  color: #b3b3b3;
`;

const Message = styled.div`
  background-color: ${props => props.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  color: ${props => props.success ? '#10b981' : '#ef4444'};
  padding: 0.875rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
  border: 1px solid ${props => props.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
`;

const Section = styled.div`
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border: 1px solid #2a2a2a;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
`;

const EditButton = styled.button`
  color: #FF6B35;
  font-size: 0.875rem;
  font-weight: 600;
  background: none;
  padding: 0.5rem 1rem;
  
  &:active {
    opacity: 0.7;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #b3b3b3;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 1rem;
  color: #ffffff;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #1e1e1e;
  color: #ffffff;
  
  &:focus {
    outline: none;
    border-color: #FF6B35;
  }
  
  &:disabled {
    background-color: #121212;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #4d4d4d;
  }
`;

const Helper = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #808080;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  color: #b3b3b3;
  background-color: #1a1a1a;
  
  &:active:not(:disabled) {
    background-color: #121212;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #FF6B35;
  
  &:active:not(:disabled) {
    background-color: #e55a28;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #2a2a2a;
  text-align: left;
  background: none;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    opacity: 0.7;
  }
`;

const MenuIcon = styled.span`
  font-size: 1.5rem;
`;

const MenuText = styled.span`
  flex: 1;
  font-size: 1rem;
  color: #ffffff;
`;

const MenuArrow = styled.span`
  font-size: 1.25rem;
  color: #808080;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #F44336;
  
  &:active {
    background-color: #d32f2f;
  }
`;

const AppInfo = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const AppVersion = styled.p`
  font-size: 0.875rem;
  color: #808080;
`;

export default Profile;







