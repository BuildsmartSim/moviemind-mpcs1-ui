import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface FadeTransitionProps {
  children: React.ReactNode;
}

const FadeTransition: React.FC<FadeTransitionProps> = ({ children }) => {
  const location = useLocation();
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setVisible(false);
    const id = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, [location.key]);

  return (
    <div
      key={location.key}
      className={clsx(
        'mm-fade-transition h-full w-full',
        reduced ? 'transition-none opacity-100' : visible ? 'opacity-100' : 'opacity-0'
      )}
      aria-live="polite"
    >
      {children}
    </div>
  );
};

export default FadeTransition;
