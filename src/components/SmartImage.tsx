import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export function SmartImage({ src, alt, title, className = '' }: SmartImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-200/70 to-zinc-100 text-zinc-500 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <ShoppingBag className="w-7 h-7 stroke-[1.5] text-zinc-400 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-zinc-600 max-w-[18ch] leading-snug">
          {title || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="eager"
    />
  );
}
