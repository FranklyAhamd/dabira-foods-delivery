import React from 'react';
import styled from 'styled-components';

const AuthLayout = ({ children }) => {
  return (
    <Container>
      <Content>
        <Header>
          <Logo>Dabira Foods</Logo>
          <Tagline>Authentic Nigerian cuisine delivered fresh</Tagline>
        </Header>
        {children}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  color: white;
`;

const Logo = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.125rem;
  opacity: 0.95;
  font-weight: 400;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export default AuthLayout;

