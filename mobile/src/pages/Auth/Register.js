import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast/Toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const showToastMessage = (message, type = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setError(''); // Clear inline error when showing toast
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowToast(false);
    
    if (!name || !email || !password || !confirmPassword) {
      showToastMessage('Please fill in all required fields', 'warning');
      return;
    }
    
    if (password !== confirmPassword) {
      showToastMessage('Passwords do not match', 'warning');
      return;
    }
    
    if (password.length < 6) {
      showToastMessage('Password must be at least 6 characters', 'warning');
      return;
    }
    
    setLoading(true);
    const result = await register(name, email, password, phone);
    setLoading(false);
    
    if (result.success) {
      showToastMessage('Account created successfully! Welcome!', 'success');
      // Navigate after showing success message
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      // Show error toast with the specific error message from backend
      // This will show messages like "This email address is already registered..."
      const errorMsg = result.message || 'Registration failed. Please try again.';
      showToastMessage(errorMsg, 'error');
    }
  };

  return (
    <Container>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={toastType === 'success' ? 2000 : 5000}
        />
      )}
      <FormCard>
        <Title>Create Account</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Full Name *</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Email *</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Phone (Optional)</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Password *</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Confirm Password *</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={loading}
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </SubmitButton>
        </Form>
        
        <Footer>
          Already have an account? <StyledLink to="/login">Login</StyledLink>
        </Footer>
      </FormCard>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  padding: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #FF6B35;
    outline: none;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button`
  background-color: #FF6B35;
  color: white;
  padding: 1rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #e55a28;
  }
  
  &:disabled {
    background-color: #ffa07a;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: #FF6B35;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default Register;




