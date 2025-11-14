import React from 'react';
import styled from 'styled-components';
import { FiCheckCircle, FiX } from 'react-icons/fi';

const PlateFilledAlert = ({ isOpen, onClose, plateNumber }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <AlertContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FiX size={18} />
        </CloseButton>
        
        <IconContainer>
          <FiCheckCircle size={48} />
        </IconContainer>
        
        <Title>Plate {plateNumber} is Full!</Title>
        
        <Message>
          Your takeaway plate has reached its maximum capacity. You can now add extra items like drinks or sides to this plate, or continue building a new plate.
        </Message>
        
        <Button onClick={onClose}>
          Got it
        </Button>
      </AlertContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const AlertContainer = styled.div`
  background: #1a1a1a;
  border-radius: 20px;
  width: 100%;
  max-width: 360px;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #2a2a2a;

  @keyframes slideUp {
    from {
      transform: translateY(20px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.95);
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  color: #10b981;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 0.75rem;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Message = styled.p`
  font-size: 0.9375rem;
  color: #b3b3b3;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.875rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  }
`;

export default PlateFilledAlert;


