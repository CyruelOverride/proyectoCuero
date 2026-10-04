import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { buttonClasses, type ButtonStyleProps } from './buttonStyles';
import { Spinner } from './Spinner';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleProps & {
    isLoading?: boolean;
    loadingText?: string;
    leftIcon?: ReactNode;
  };

export function Button({
  variant,
  size,
  fullWidth,
  isLoading = false,
  loadingText,
  leftIcon,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : leftIcon}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}

type ButtonLinkProps = LinkProps & ButtonStyleProps & { leftIcon?: ReactNode };

export function ButtonLink({ variant, size, fullWidth, leftIcon, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonClasses({ variant, size, fullWidth }), className)} {...props}>
      {leftIcon}
      {children}
    </Link>
  );
}
