'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// ============================================
// BUTTON
// ============================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] select-none';

    const variants: Record<string, string> = {
      primary: 'bg-plum text-white hover:bg-plum-light shadow-soft hover:shadow-card rounded-xl',
      secondary: 'bg-coral text-white hover:bg-coral-dark shadow-soft hover:shadow-card rounded-xl',
      outline: 'border-2 border-plum text-plum hover:bg-plum-50 rounded-xl',
      ghost: 'text-plum hover:bg-plum-50 rounded-lg',
      danger: 'bg-red text-white hover:opacity-90 shadow-soft rounded-xl',
      gold: 'bg-gradient-to-r from-gold to-gold-light text-charcoal font-bold shadow-soft hover:shadow-card rounded-xl',
    };

    const sizes: Record<string, string> = {
      sm: 'text-sm px-4 py-2 gap-1.5',
      md: 'text-sm px-6 py-2.5 gap-2',
      lg: 'text-base px-8 py-3 gap-2.5',
      xl: 'text-lg px-10 py-4 gap-3',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ============================================
// CARD
// ============================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', children, ...props }, ref) => {
    const paddings: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-surface rounded-2xl border border-border-light shadow-soft',
          paddings[padding],
          hover && 'card-hover cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// ============================================
// INPUT
// ============================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-surface text-charcoal placeholder:text-charcoal-muted transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum',
            error ? 'border-red' : 'border-border',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red">{error}</p>}
        {helperText && !error && <p className="text-sm text-charcoal-muted">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ============================================
// TEXTAREA
// ============================================

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  charCount?: boolean;
  maxChars?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, charCount, maxChars, id, value, ...props }, ref) => {
    const inputId = id || props.name;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-surface text-charcoal placeholder:text-charcoal-muted transition-colors resize-none',
            'focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum',
            error ? 'border-red' : 'border-border',
            className
          )}
          {...props}
        />
        <div className="flex justify-between">
          <div>
            {error && <p className="text-sm text-red">{error}</p>}
            {helperText && !error && <p className="text-sm text-charcoal-muted">{helperText}</p>}
          </div>
          {charCount && maxChars && (
            <p className={cn('text-sm', currentLength > maxChars ? 'text-red' : 'text-charcoal-muted')}>
              {currentLength}/{maxChars}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ============================================
// SELECT
// ============================================

export interface SelectOption {
  value: string;
  label: string;
  emoji?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-surface text-charcoal transition-colors appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum',
            error ? 'border-red' : 'border-border',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.emoji ? `${opt.emoji} ${opt.label}` : opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// ============================================
// BADGE
// ============================================

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'plum' | 'coral' | 'gold' | 'emerald' | 'rose';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-plum-50 text-plum',
    plum: 'bg-plum text-white',
    coral: 'bg-coral/10 text-coral-dark',
    gold: 'bg-gold/10 text-gold-dark',
    emerald: 'bg-emerald/10 text-emerald',
    rose: 'bg-rose/10 text-rose-dark',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ============================================
// SKELETON
// ============================================

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('skeleton h-4 w-full', className)} {...props} />;
}

// ============================================
// DIALOG / MODAL
// ============================================

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Dialog({ isOpen, onClose, title, description, children, size = 'md' }: DialogProps) {
  const sizes: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn('relative bg-surface rounded-2xl shadow-elevated w-full animate-scale-in', sizes[size])}>
        {title && (
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-xl font-bold text-charcoal">{title}</h2>
            {description && <p className="text-sm text-charcoal-muted mt-1">{description}</p>}
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-plum-50 text-charcoal-muted hover:text-charcoal transition-colors"
          aria-label="Close dialog"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="px-6 pb-6 pt-2">{children}</div>
      </div>
    </div>
  );
}

// ============================================
// TABS
// ============================================

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 bg-ivory-dark rounded-xl p-1', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            activeTab === tab.id
              ? 'bg-surface text-plum shadow-soft'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-surface/50'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ============================================
// ACCORDION
// ============================================

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => (
        <div key={item.id} className="bg-surface rounded-xl border border-border-light overflow-hidden">
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-charcoal hover:bg-plum-50/50 transition-colors"
            aria-expanded={openId === item.id}
          >
            <span>{item.question}</span>
            <svg
              className={cn('w-5 h-5 text-charcoal-muted transition-transform duration-200', openId === item.id && 'rotate-180')}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {openId === item.id && (
            <div className="px-6 pb-4 text-charcoal-muted text-sm leading-relaxed animate-slide-down">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// PROGRESS BAR
// ============================================

export function ProgressBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full bg-ivory-dark rounded-full h-2 overflow-hidden', className)}>
      <div
        className="h-full gradient-plum rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      {icon && <div className="mb-4 text-charcoal-muted">{icon}</div>}
      <h3 className="text-lg font-semibold text-charcoal mb-2">{title}</h3>
      {description && <p className="text-charcoal-muted text-sm max-w-md mb-6">{description}</p>}
      {action}
    </div>
  );
}

// ============================================
// AVATAR
// ============================================

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className,
}: {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes: Record<string, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full gradient-plum flex items-center justify-center text-white font-semibold',
        sizes[size],
        className
      )}
      aria-label={alt || 'Avatar'}
    >
      {fallback || '?'}
    </div>
  );
}

// ============================================
// TOAST / NOTIFICATION (simple)
// ============================================

export function Toast({
  message,
  type = 'info',
  onClose,
}: {
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  onClose?: () => void;
}) {
  const colors: Record<string, string> = {
    info: 'bg-plum text-white',
    success: 'bg-emerald text-white',
    error: 'bg-red text-white',
    warning: 'bg-amber text-white',
  };

  return (
    <div className={cn('fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-elevated animate-slide-up', colors[type])}>
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:opacity-80" aria-label="Close notification">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
