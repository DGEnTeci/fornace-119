import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Clases base: inline-flex, centrado, tipografía cuidada y objetivo táctil mínimo de 44px
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-full min-h-[44px] min-w-[44px] transition-colors duration-200 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100';

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-terracotta text-white hover:bg-terracotta-hover active:bg-terracotta-dark shadow-sm',
      secondary:
        'bg-charcoal-900 text-cream-50 hover:bg-charcoal-800 active:bg-charcoal-950 shadow-sm',
      outline:
        'border border-charcoal-700/30 text-charcoal-900 hover:border-terracotta hover:text-terracotta hover:bg-terracotta/5',
      ghost:
        'text-charcoal-800 hover:bg-cream-200/80 hover:text-terracotta',
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg font-semibold',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span>Cargando...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
