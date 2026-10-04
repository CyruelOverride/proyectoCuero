import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/utils/cn';

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
};

/** Imagen de producto con placeholder mientras carga y fallback si la URL falla. */
export function ProductImage({ src, alt, className, imgClassName, loading = 'lazy' }: ProductImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);

  // Reinicia el estado si cambia la imagen (ej. preview en el formulario admin).
  if (currentSrc !== src) {
    setCurrentSrc(src);
    setStatus('loading');
  }

  return (
    <div className={cn('relative overflow-hidden bg-sand/60', className)}>
      {status === 'loading' && <div aria-hidden className="absolute inset-0 animate-pulse bg-sand/70" />}
      {status === 'error' || !src ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink/30">
          <ImageOff className="size-8" />
          <span className="text-xs">Imagen no disponible</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'size-full object-cover transition-opacity duration-500',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
