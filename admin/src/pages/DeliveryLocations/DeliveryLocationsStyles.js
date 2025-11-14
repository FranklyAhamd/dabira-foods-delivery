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
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FloatingAddButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #FF6B35;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 999;

  &:hover {
    background-color: #E55A2B;
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(255, 107, 53, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  width: 100%;
`;

export const LocationCard = styled.div`
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.15s;
  min-height: 110px;
  max-width: 100%;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    border-color: #d1d5db;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-bottom: 1px solid #f3f4f6;
  min-height: 36px;
  gap: 6px;
`;

export const CardTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  flex: 1;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardContent = styled.div`
  padding: 8px 10px;
  flex: 1;
  min-height: 40px;
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  gap: 4px;
`;

export const CardLabel = styled.span`
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
`;

export const CardValue = styled.span`
  font-size: 11px;
  color: #374151;
  font-weight: 600;
  font-family: 'Space Grotesk', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  white-space: nowrap;
`;

export const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 6px 10px;
  border-top: 1px solid #f3f4f6;
  gap: 4px;
  min-height: 36px;
`;

export const ActionButton = styled.button`
  padding: 4px;
  background-color: transparent;
  color: ${props => props.$edit ? '#2563eb' : '#ef4444'};
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover {
    opacity: 0.7;
    background-color: ${props => props.$edit ? 'rgba(37, 99, 235, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  background-color: ${props => props.$active ? '#10b981' : '#ef4444'};
  color: white;
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
  white-space: nowrap;
  line-height: 1.3;
  flex-shrink: 0;

  &:hover {
    opacity: 0.85;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 6px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #e5e7eb;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
`;

export const ModalTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.15s;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #374151;
  }
`;

export const Form = styled.form`
  padding: 12px 16px;
`;

export const FormGroup = styled.div`
  margin-bottom: 10px;
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

  &::placeholder {
    color: #9ca3af;
    font-size: 11px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

export const SubmitButton = styled.button`
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

  &:hover {
    background-color: #E55A2B;
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

  &:hover {
    border-color: #9ca3af;
    color: #374151;
    background: #f9fafb;
  }
`;

export const EmptyMessage = styled.div`
  background: white;
  padding: 24px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
  border: 1px solid #e5e7eb;
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

