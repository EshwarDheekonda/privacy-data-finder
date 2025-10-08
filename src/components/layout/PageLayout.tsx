import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'wide';
  withGradient?: boolean;
}

export const PageLayout = ({ 
  children, 
  className,
  variant = 'default',
  withGradient = true 
}: PageLayoutProps) => {
  const variantClasses = {
    default: 'max-w-7xl',
    narrow: 'max-w-4xl',
    wide: 'max-w-[1600px]'
  };

  return (
    <div className={cn(
      "min-h-screen w-full",
      withGradient && "bg-gradient-to-br from-background via-background to-primary/5"
    )}>
      <main className={cn(
        "container-responsive mx-auto w-full",
        variantClasses[variant],
        className
      )}>
        {children}
      </main>
    </div>
  );
};