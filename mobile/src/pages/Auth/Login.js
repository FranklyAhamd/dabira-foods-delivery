import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirect || '/';
  const isGuestCheckout = location.state?.isGuest === false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate(redirectTo, { state: { isGuest: false } });
    } else {
      setError(result.message);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </SubmitButton>
        </Form>
        
        <Footer>
          Don't have an account? <StyledLink to="/register">Register</StyledLink>
        </Footer>
      </FormCard>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
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
  padding: 1rem 1.25rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.125rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 1rem;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #b4b4b4 0%, #999 100%);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: #667eea;
  font-weight: 700;
  transition: all 0.2s;
  
  &:hover {
    text-decoration: underline;
    color: #764ba2;
  }
`;

export default Login;

