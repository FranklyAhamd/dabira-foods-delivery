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
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

export const AddButton = styled.button`
  padding: 12px 24px;
  background-color: #FF6B35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #E55A2B;
  }
`;

export const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 2px solid #e0e0e0;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
`;

export const TableRow = styled.tr`
  &:hover {
    background-color: #fafafa;
  }
`;

export const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #333;
`;

export const ActionButton = styled.button`
  padding: 6px 12px;
  margin-right: 8px;
  background-color: ${props => props.$edit ? '#2196F3' : '#F44336'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
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
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e0e0e0;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #333;
  }
`;

export const Form = styled.form`
  padding: 25px;
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
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s;
  font-family: inherit;

  &:focus {
    border-color: #FF6B35;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s;

  &:focus {
    border-color: #FF6B35;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
`;

export const SubmitButton = styled.button`
  padding: 12px 24px;
  background-color: #FF6B35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #E55A2B;
  }
`;

export const CancelButton = styled.button`
  padding: 12px 24px;
  background-color: transparent;
  color: #666;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #999;
    color: #333;
  }
`;

export const EmptyMessage = styled.div`
  background: white;
  padding: 60px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #999;
  font-size: 18px;
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

export const AvailableBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: ${props => props.$available ? '#4CAF50' : '#F44336'};
  color: white;
  font-size: 12px;
  font-weight: bold;
`;


