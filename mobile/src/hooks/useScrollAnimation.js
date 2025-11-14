import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * Uses Intersection Observer for optimal performance
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Root margin for intersection observer
 * @param {boolean} options.triggerOnce - Only trigger animation once
 * @returns {[React.RefObject, boolean]} - [ref, isVisible]
 */
export const useScrollAnimation = ({
  threshold = 0.1,
  rootMargin = '0px 0px -30px 0px',
  triggerOnce = true,
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if element is already visible on mount
    const checkInitialVisibility = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const isInView = rect.top < windowHeight && rect.bottom > 0;
      
      if (isInView) {
        // Small delay to ensure smooth animation even for initially visible items
        setTimeout(() => setIsVisible(true), 100);
        return true;
      }
      return false;
    };

    // If already visible and triggerOnce, don't set up observer
    if (isVisible && triggerOnce) return;

    // Check initial visibility
    const wasInitiallyVisible = checkInitialVisibility();
    if (wasInitiallyVisible && triggerOnce) return;

    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce && observerRef.current) {
              observerRef.current.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isVisible];
};

