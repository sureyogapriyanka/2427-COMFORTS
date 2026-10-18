import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide' | 'full';
}

export function Container({ children, className = '', size = 'default' }: ContainerProps) {
  const sizeClass = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-full',
  }[size];

  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClass} ${className}`}>
      {children}
    </div>
  );
}
