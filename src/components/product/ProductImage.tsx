import { useState } from 'react';
import type { MouseEventHandler } from 'react';
import {
  productImageUrl,
  requiresOwnerApprovedPhoto,
} from '../../lib/productImages';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'auto' | 'sync';
  onClick?: MouseEventHandler<HTMLImageElement>;
}

export function ProductImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  onClick,
}: ProductImageProps) {
  const resolvedSource = productImageUrl(src);
  const [failedSource, setFailedSource] = useState('');
  const hasError = failedSource === resolvedSource;

  if (!resolvedSource || hasError) {
    const accessibleAlt = alt || 'Product photo';
    const needsOwnerReplacement = !resolvedSource && requiresOwnerApprovedPhoto(src);
    return (
      <div
        role="img"
        aria-label={`${accessibleAlt}: product photo unavailable${needsOwnerReplacement ? '; owner-approved replacement required' : ''}.`}
        className={`flex flex-col items-center justify-center gap-1 bg-[#F0ECE5] p-3 text-center text-[10px] leading-snug text-elan-muted ${className}`}
      >
        <span className="font-medium">Product photo unavailable</span>
        {needsOwnerReplacement && <span>Owner-approved replacement required</span>}
      </div>
    );
  }

  return (
    <img
      src={resolvedSource}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={() => setFailedSource(resolvedSource)}
      onClick={onClick}
      className={className}
    />
  );
}
