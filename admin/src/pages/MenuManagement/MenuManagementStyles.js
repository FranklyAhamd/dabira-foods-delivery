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

export const CategoryManageButton = styled.button`
  padding: 6px;
  background-color: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
    color: #374151;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border-collapse: collapse;
  border: 1px solid #e5e7eb;
  font-size: 11px;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 6px 8px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 10px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  height: 22px;
  white-space: nowrap;
`;

export const TableRow = styled.tr`
  &:hover {
    background-color: #f9fafb;
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 4px 8px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 11px;
  color: #374151;
  height: 22px;
  vertical-align: middle;
`;

export const ActionButton = styled.button`
  padding: 4px;
  margin-right: 4px;
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
  }
  
  &:last-child {
    margin-right: 0;
  }

  svg {
    width: 18px;
    height: 18px;
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
  max-width: 600px;
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

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 44px;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  resize: vertical;
  transition: all 0.15s;
  font-family: inherit;
  line-height: 1.4;

  &:focus {
    border-color: #FF6B35;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 22px;
  padding: 2px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  background-color: white;
  cursor: pointer;
  transition: all 0.15s;
  color: #374151;

  &:focus {
    border-color: #FF6B35;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
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

export const AvailableBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  background-color: ${props => props.$available ? '#10b981' : '#ef4444'};
  color: white;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: all 0.15s;
  border: none;

  &:hover {
    opacity: 0.85;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  align-items: center;
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  height: 24px;
  transition: all 0.15s;

  &:focus-within {
    border-color: #FF6B35;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
  }

  svg {
    color: #9ca3af;
    flex-shrink: 0;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 12px;
  background: transparent;
  color: #374151;

  &::placeholder {
    color: #9ca3af;
    font-size: 11px;
  }
`;

export const FilterSelect = styled.select`
  min-width: 150px;
  height: 24px;
  padding: 2px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  background-color: white;
  cursor: pointer;
  transition: all 0.15s;
  color: #374151;

  &:focus {
    border-color: #FF6B35;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
  }
`;


