import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'sage' | 'light';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'right',
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-hidden focus:ring-2 focus:ring-elan-sage focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary: 'bg-elan-ink text-elan-ivory hover:bg-elan-ink-hover shadow-sm',
    secondary: 'bg-elan-ivory text-elan-ink border border-[#E8E1D7] hover:bg-[#F3EFEA]',
    outline: 'bg-transparent text-elan-ink border border-elan-ink hover:bg-elan-ink hover:text-elan-ivory',
    ghost: 'bg-transparent text-elan-ink hover:bg-elan-ink/5',
    sage: 'bg-elan-sage text-elan-ivory hover:bg-elan-sage-hover shadow-sm',
    light: 'bg-elan-ivory text-elan-ink hover:bg-white shadow-md',
  }[variant];

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  );
}
