import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: relative;
  max-width: 400px;
  animation: ${props => props.$isExiting ? slideOut : slideIn} 0.3s ease-out;
  margin-bottom: 10px;
`;

const Toast = styled.div`
  background: ${props => {
    switch (props.$type) {
      case 'success':
        return 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
      case 'error':
        return 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
      case 'info':
      default:
        return 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
    }
  }};
  color: white;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    width: ${props => props.$progress}%;
    background: rgba(255, 255, 255, 0.3);
    transition: width 0.1s linear;
  }
`;

const IconContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-top: 2px;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Message = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.8;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const ToastComponent = ({ message, type = 'info', onClose, duration = 5000 }) => {
  const [progress, setProgress] = React.useState(100);
  const [isExiting, setIsExiting] = React.useState(false);

  useEffect(() => {
    if (duration === 0) return; // Don't auto-dismiss if duration is 0

    const interval = 50; // Update every 50ms for smooth progress bar
    const decrement = (100 / duration) * interval;
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - decrement;
        if (newProgress <= 0) {
          clearInterval(progressInterval);
          setIsExiting(true);
          setTimeout(() => {
            if (onClose) onClose();
          }, 300);
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(progressInterval);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle size={24} />;
      case 'error':
        return <FiAlertCircle size={24} />;
      case 'warning':
        return <FiAlertCircle size={24} />;
      case 'info':
      default:
        return <FiInfo size={24} />;
    }
  };

  return (
    <ToastContainer $isExiting={isExiting}>
      <Toast $type={type} $progress={progress}>
        <IconContainer>{getIcon()}</IconContainer>
        <Content>
          <Message>{message}</Message>
        </Content>
        <CloseButton onClick={handleClose} aria-label="Close">
          <FiX size={18} />
        </CloseButton>
      </Toast>
    </ToastContainer>
  );
};

export default ToastComponent;

