import React from 'react';

interface ColorDotsProps {
  colors: { name: string; hex: string }[];
  selectedColor?: string;
  onSelect?: (colorName: string) => void;
  size?: 'sm' | 'md';
}

export function ColorDots({
  colors,
  selectedColor,
  onSelect,
  size = 'sm',
}: ColorDotsProps) {
  const sizeClasses = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Product color choices">
      {colors.map((color) => {
        const isSelected = selectedColor === color.name;
        return (
          <button
            key={color.name}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect?.(color.name);
            }}
            title={color.name}
            aria-label={`Select ${color.name}`}
            className={`group relative rounded-full transition-transform hover:scale-110 focus:outline-hidden ${sizeClasses} ${
              isSelected ? 'ring-2 ring-offset-2 ring-[#637666]' : 'ring-1 ring-[#1F2022]/15'
            }`}
            style={{ backgroundColor: color.hex }}
          >
            <span className="sr-only">{color.name}</span>
          </button>
        );
      })}
    </div>
  );
}
