import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { CarouselSlide } from '@/data/carouselSlides';
import { cn } from '@/utils/cn';
import { ButtonLink } from '../ui';

type HeroCarouselProps = {
  slides: CarouselSlide[];
  intervalMs?: number;
};

export function HeroCarousel({ slides, intervalMs = 6000 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const total = slides.length;

  const goTo = useCallback((index: number) => setCurrent((index + total) % total), [total]);
  const next = useCallback(() => setCurrent((index) => (index + 1) % total), [total]);
  const prev = () => goTo(current - 1);

  useEffect(() => {
    if (!isPlaying || isHovered || total < 2) return;
    const timer = window.setInterval(next, intervalMs);
    return () => window.clearInterval(timer);
  }, [isPlaying, isHovered, next, intervalMs, total]);

  if (total === 0) return null;

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Colecciones destacadas"
      className="relative isolate h-[78svh] min-h-[520px] overflow-hidden bg-espresso text-ivory sm:max-h-[820px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') next();
        if (event.key === 'ArrowLeft') prev();
      }}
    >
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${total}: ${slide.title}`}
            aria-hidden={!isActive}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-out',
              isActive ? 'z-10 opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <img
              src={slide.image}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              className={cn(
                'absolute inset-0 size-full object-cover transition-transform duration-[7000ms] ease-out',
                isActive ? 'scale-105' : 'scale-100',
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

            <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-28 sm:items-center sm:px-6 sm:pb-0 lg:px-8">
              <div className={cn('max-w-xl', isActive && 'animate-slide-up')}>
                <p className="text-xs font-medium tracking-[0.3em] text-sand uppercase">{slide.eyebrow}</p>
                <h2 className="mt-4 text-5xl leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">{slide.title}</h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/80 sm:text-lg">{slide.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink
                    to="/#coleccion"
                    size="lg"
                    variant="light"
                    tabIndex={isActive ? undefined : -1}
                  >
                    Ver colección
                  </ButtonLink>
                  <ButtonLink
                    to="/#taller"
                    size="lg"
                    variant="ghost-light"
                    tabIndex={isActive ? undefined : -1}
                  >
                    Conocé el taller
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {total > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-8 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ir a la diapositiva ${index + 1}`}
                  aria-current={index === current}
                  className="group flex h-6 items-center"
                >
                  <span
                    className={cn(
                      'block h-0.5 rounded-full transition-all duration-500',
                      index === current ? 'w-10 bg-ivory' : 'w-5 bg-ivory/35 group-hover:bg-ivory/60',
                    )}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <CarouselButton label={isPlaying ? 'Pausar carrusel' : 'Reanudar carrusel'} onClick={() => setIsPlaying((p) => !p)}>
                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
              </CarouselButton>
              <CarouselButton label="Diapositiva anterior" onClick={prev}>
                <ChevronLeft className="size-5" />
              </CarouselButton>
              <CarouselButton label="Diapositiva siguiente" onClick={next}>
                <ChevronRight className="size-5" />
              </CarouselButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CarouselButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-10 items-center justify-center rounded-full border border-ivory/25 text-ivory/80 backdrop-blur-sm transition-colors hover:border-ivory hover:bg-ivory hover:text-ink"
    >
      {children}
    </button>
  );
}
