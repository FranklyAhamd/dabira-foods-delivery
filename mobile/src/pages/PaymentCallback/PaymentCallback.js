import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../config/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { success, error: showError } = useToast();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment reference from URL params
        const paymentReference = searchParams.get('paymentReference') || searchParams.get('transactionReference');
        
        if (!paymentReference) {
          setStatus('error');
          showError('Payment reference not found');
          setTimeout(() => navigate('/cart'), 3000);
          return;
        }

        // Verify payment with backend
        const response = await api.get(`/payment/verify/${paymentReference}`);

        if (response && response.success && response.data && response.data.order) {
          // Payment successful and order created
          clearCart();
          setStatus('success');
          success('Payment successful! Order confirmed.', 3000);
          
          // Redirect to order confirmation after a short delay
          setTimeout(() => {
            navigate('/order-confirmation', {
              state: { order: response.data.order }
            });
          }, 2000);
        } else {
          setStatus('error');
          showError(response?.message || 'Payment verification failed');
          setTimeout(() => navigate('/cart'), 3000);
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setStatus('error');
        showError(err.response?.data?.message || 'Error verifying payment. Please contact support.');
        setTimeout(() => navigate('/cart'), 3000);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, clearCart, success, showError]);

  return (
    <Container>
      {status === 'verifying' && (
        <>
          <Spinner />
          <Title>Verifying Payment...</Title>
          <Message>Please wait while we confirm your payment.</Message>
        </>
      )}
      
      {status === 'success' && (
        <>
          <SuccessIcon>✓</SuccessIcon>
          <Title>Payment Successful!</Title>
          <Message>Your order has been confirmed. Redirecting...</Message>
        </>
      )}
      
      {status === 'error' && (
        <>
          <ErrorIcon>✗</ErrorIcon>
          <Title>Payment Verification Failed</Title>
          <Message>There was an issue verifying your payment. Please contact support if you were charged.</Message>
          <Button onClick={() => navigate('/cart')}>Back to Cart</Button>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 3rem 1rem;
  text-align: center;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FF6B35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 2rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background-color: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  animation: scaleIn 0.3s ease-out;
  
  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background-color: #f44336;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  animation: scaleIn 0.3s ease-out;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background-color: #FF6B35;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e55a28;
  }
`;

export default PaymentCallback;

