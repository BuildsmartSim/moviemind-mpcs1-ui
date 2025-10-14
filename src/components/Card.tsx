import clsx from 'clsx';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'rounded-2xl shadow-mm-card bg-[color:var(--mm-bg-1)]/80 backdrop-blur border border-white/5',
        'transition-transform duration-300 ease-mm-fade hover:scale-[1.01] focus-within:scale-[1.01]',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
