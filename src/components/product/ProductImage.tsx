import { useState } from 'react';
import type { MouseEventHandler } from 'react';
import {
  isAiGeneratedConceptImage,
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
  onImageLoadStateChange?: (source: string, loaded: boolean) => void;
}

export function ProductImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  onClick,
  onImageLoadStateChange,
}: ProductImageProps) {
  const resolvedSource = productImageUrl(src);
  const [failedSource, setFailedSource] = useState('');
  const hasError = failedSource === resolvedSource;
  const accessibleAlt = isAiGeneratedConceptImage(src)
    ? `${alt}. AI-generated concept visual, not a verified product photo.`
    : alt;

  if (!resolvedSource || hasError) {
    const fallbackAlt = accessibleAlt || 'Product photo';
    const unavailable = !resolvedSource && requiresOwnerApprovedPhoto(src);
    const imageComingSoon = /w-ct15-(?:front|back)\.jpg/i.test(src);
    return (
      <div
        role="img"
        aria-label={`${fallbackAlt}: ${imageComingSoon || unavailable ? 'image coming soon' : 'product photo unavailable'}.`}
        className={`flex flex-col items-center justify-center gap-2 bg-[#F0ECE5] p-4 text-center text-xs leading-relaxed text-elan-muted ${className}`}
      >
        <span className="font-medium">{imageComingSoon ? 'Image coming soon' : 'Product photo unavailable'}</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSource}
      alt={accessibleAlt}
      loading={loading}
      decoding={decoding}
      onLoad={() => onImageLoadStateChange?.(src, true)}
      onError={() => {
        setFailedSource(resolvedSource);
        onImageLoadStateChange?.(src, false);
      }}
      onClick={onClick}
      className={className}
    />
  );
}
