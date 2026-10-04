import { cn } from '@/utils/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  /** Variantes para fondos oscuros (hero, secciones espresso). */
  | 'light'
  | 'outline-light'
  | 'ghost-light'
  | 'whatsapp';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-ivory hover:bg-espresso disabled:bg-ink/40',
  secondary: 'bg-sand text-ink hover:bg-linen disabled:bg-sand/60 disabled:text-ink/40',
  outline:
    'border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-ivory disabled:border-ink/10 disabled:text-ink/30 disabled:hover:bg-transparent',
  ghost: 'bg-transparent text-ink hover:bg-ink/5 disabled:text-ink/30',
  danger: 'bg-danger text-white hover:bg-danger/90 disabled:bg-danger/40',
  light: 'bg-ivory text-ink hover:bg-sand',
  'outline-light': 'border border-ivory/30 bg-transparent text-ivory hover:border-ivory hover:bg-ivory hover:text-ink',
  'ghost-light': 'bg-transparent text-ivory hover:bg-ivory/10',
  whatsapp: 'bg-[#1f7a4d] text-white hover:bg-[#19663f]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
};

export function buttonClasses({ variant = 'primary', size = 'md', fullWidth }: ButtonStyleProps = {}) {
  return cn(
    'inline-flex shrink-0 select-none items-center justify-center rounded-full font-medium tracking-wide',
    'transition-colors duration-200 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
  );
}

