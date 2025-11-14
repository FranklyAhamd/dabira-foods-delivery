import React from 'react';
import styled from 'styled-components';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * Wrapper component that adds scroll animations to product cards
 * Images load immediately, animations trigger on scroll
 */
const AnimatedProductCard = ({ 
  children, 
  index = 0,
  animationType = 'auto',
  ...props 
}) => {
  const [ref, isVisible] = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px',
    triggerOnce: true,
  });

  // Determine animation type based on index if auto
  const getAnimationType = () => {
    if (animationType !== 'auto') return animationType;
    
    const types = [
      'slideUp',
      'slideLeft',
      'slideRight',
      'fadeIn',
      'scaleUp',
      'slideUp',
      'slideRight',
      'slideLeft',
      'fadeIn',
      'scaleUp',
    ];
    return types[index % types.length];
  };

  const animType = getAnimationType();
  const delay = Math.min(index * 50, 500);

  return (
    <AnimationWrapper
      ref={ref}
      $animationType={animType}
      $isVisible={isVisible}
      $delay={delay}
      {...props}
    >
      {children}
    </AnimationWrapper>
  );
};

const AnimationWrapper = styled.div`
  /* Base state - hidden, images still load */
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${props => props.$delay}ms;
  will-change: opacity, transform;
  
  /* Different animation types */
  ${props => {
    if (!props.$isVisible) {
      // Initial hidden state
      switch (props.$animationType) {
        case 'slideLeft':
          return `transform: translateX(50px);`;
        case 'slideRight':
          return `transform: translateX(-50px);`;
        case 'fadeIn':
          return `transform: translateY(0);`;
        case 'scaleUp':
          return `transform: scale(0.9) translateY(20px);`;
        default: // slideUp
          return `transform: translateY(30px);`;
      }
    } else {
      // Visible state
      switch (props.$animationType) {
        case 'slideLeft':
        case 'slideRight':
          return `transform: translateX(0);`;
        case 'fadeIn':
          return `transform: translateY(0);`;
        case 'scaleUp':
          return `transform: scale(1) translateY(0);`;
        default: // slideUp
          return `transform: translateY(0);`;
      }
    }
  }}
`;

export default AnimatedProductCard;

