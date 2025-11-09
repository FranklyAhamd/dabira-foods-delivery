import React from 'react';
import styled from 'styled-components';
import { FiAlertTriangle } from 'react-icons/fi';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fef3c7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    color: #f59e0b;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const Message = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`;

const CancelButton = styled(Button)`
  background-color: #f3f4f6;
  color: #374151;
  
  &:hover {
    background-color: #e5e7eb;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #ef4444;
  color: white;
  
  &:hover {
    background-color: #dc2626;
  }
`;

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <IconContainer>
            <FiAlertTriangle size={20} />
          </IconContainer>
          <Title>{title}</Title>
        </ModalHeader>
        <ModalBody>
          <Message>{message}</Message>
          <ButtonGroup>
            <CancelButton onClick={onClose}>
              {cancelText}
            </CancelButton>
            <ConfirmButton onClick={handleConfirm}>
              {confirmText}
            </ConfirmButton>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmModal;

