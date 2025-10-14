import clsx from 'clsx';
import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ParallaxLayerProps {
  className?: string;
  depth?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ className, depth = 12, children, style }) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const location = useLocation();

  const offset = useMemo(() => (reducedMotion ? 0 : clamp(depth, -16, 16)), [depth, reducedMotion]);

  useEffect(() => {
    const element = layerRef.current;
    if (!element || reducedMotion) return;

    element.classList.add('mm-parallax');
    element.style.transform = `translate3d(0, ${offset * -1}px, 0)`;

    const animate = () => {
      if (typeof element.animate === 'function') {
        element.animate(
          [{ transform: `translate3d(0, ${offset}px, 0)` }, { transform: `translate3d(0, ${offset * -1}px, 0)` }],
          {
            duration: 6000,
            direction: 'alternate',
            easing: 'ease-in-out',
            iterations: Infinity
          }
        );
      }
    };

    animate();

    return () => {
      element.getAnimations?.().forEach((animation) => animation.cancel());
    };
  }, [offset, reducedMotion, location.key]);

  return (
    <div ref={layerRef} className={clsx('absolute inset-0 pointer-events-none select-none', className)} style={style}>
      {children}
    </div>
  );
};

export default ParallaxLayer;
