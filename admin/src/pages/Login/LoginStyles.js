import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
`;

export const LoginBox = styled.div`
  background: white;
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  text-align: center;
`;

export const Logo = styled.div`
  font-size: 80px;
  margin-bottom: 10px;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #FF6B35;
  margin-bottom: 5px;
`;

export const Subtitle = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Input = styled.input`
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #FF6B35;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const Button = styled.button`
  padding: 15px;
  background-color: #FF6B35;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;

  &:hover:not(:disabled) {
    background-color: #E55A2B;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
`;

export const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

















