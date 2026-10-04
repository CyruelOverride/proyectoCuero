import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

type LogoProps = {
  to?: string;
  tone?: 'dark' | 'light';
  subtitle?: string;
  /** 'sm' para espacios angostos (sidebar y barra admin). */
  size?: 'sm' | 'md';
  className?: string;
};

export function Logo({ to = '/', tone = 'dark', subtitle, size = 'md', className }: LogoProps) {
  return (
    <Link to={to} className={cn('group inline-flex flex-col leading-none', className)} aria-label="Mare Estilo Artesanías, inicio">
      <span
        className={cn(
          'whitespace-nowrap font-serif font-semibold tracking-tight',
          size === 'md' ? 'text-[1.35rem] sm:text-[1.65rem]' : 'text-[1.3rem]',
          tone === 'dark' ? 'text-ink' : 'text-ivory',
        )}
      >
        Mare <span className="italic text-cognac">Estilo</span> Artesanías
      </span>
      {subtitle && (
        <span className={cn('mt-1 text-[10px] tracking-[0.3em] uppercase', tone === 'dark' ? 'text-muted' : 'text-ivory/50')}>
          {subtitle}
        </span>
      )}
    </Link>
  );
}
