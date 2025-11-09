import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  padding: 16px;
  overflow-y: auto;
  height: calc(100vh - 80px);
  background: #f8f9fa;
`;

export const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
`;

export const Form = styled.form`
  max-width: 100%;
`;

export const Section = styled.div`
  background: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
`;

export const SectionTitle = styled.h2`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
  margin-bottom: 8px;
`;

export const FormGroup = styled.div`
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.2px;
`;

export const Input = styled.input`
  width: 100%;
  height: 22px;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.15s;
  background: white;

  &:focus {
    border-color: #FF6B35;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    color: #9ca3af;
  }

  &::placeholder {
    color: #9ca3af;
    font-size: 11px;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 44px;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.15s;
  background: white;
  line-height: 1.4;

  &:focus {
    border-color: #FF6B35;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    color: #9ca3af;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

export const SaveButton = styled.button`
  padding: 6px 16px;
  background-color: #FF6B35;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  height: 24px;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &:hover:not(:disabled) {
    background-color: #E55A2B;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  padding: 6px 16px;
  background-color: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  height: 24px;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &:hover:not(:disabled) {
    border-color: #9ca3af;
    color: #374151;
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 11px;
  margin-top: 12px;
  border-left: 3px solid #10b981;
`;

export const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 11px;
  margin-top: 12px;
  border-left: 3px solid #ef4444;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const LoadingSpinner = styled.div`
  border: 3px solid #f3f4f6;
  border-top: 3px solid #FF6B35;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: ${spin} 1s linear infinite;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: ${props => props.$isOpen ? '#d1fae5' : '#fee2e2'};
  color: ${props => props.$isOpen ? '#065f46' : '#991b1b'};
`;

















