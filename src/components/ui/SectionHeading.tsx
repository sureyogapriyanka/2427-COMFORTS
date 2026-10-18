import React, { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
  action,
}: SectionHeadingProps) {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }[align];

  return (
    <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12 ${className}`}>
      <div className={`flex flex-col ${alignClass} max-w-2xl`}>
        {eyebrow && (
          <span className="eyebrow mb-2">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1F2022] leading-[1.1]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm sm:text-base text-[#5E6064] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
