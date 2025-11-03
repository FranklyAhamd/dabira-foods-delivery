import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  LoginBox,
  Logo,
  Title,
  Subtitle,
  Form,
  Input,
  Button,
  ErrorMessage,
  LoadingSpinner
} from './LoginStyles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Logo>🍔</Logo>
        <Title>Dabira Foods</Title>
        <Subtitle>Admin Dashboard</Subtitle>

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Login'}
          </Button>
        </Form>
      </LoginBox>
    </Container>
  );
};

export default Login;

