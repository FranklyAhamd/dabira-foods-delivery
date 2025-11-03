import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  padding: 30px;
  overflow-y: auto;
  height: calc(100vh - 80px);
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
`;

export const Form = styled.form`
  max-width: 800px;
`;

export const Section = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #FF6B35;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s;

  &:focus {
    border-color: #FF6B35;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
`;

export const SaveButton = styled.button`
  padding: 14px 32px;
  background-color: #FF6B35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background-color: #E55A2B;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  padding: 14px 32px;
  background-color: transparent;
  color: #666;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    border-color: #999;
    color: #333;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 20px;
  border-left: 4px solid #4caf50;
`;

export const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 20px;
  border-left: 4px solid #f44336;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FF6B35;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;














