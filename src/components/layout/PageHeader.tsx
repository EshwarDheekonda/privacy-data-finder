import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string | ReactNode;
  subtitle?: string;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  className?: string;
  sticky?: boolean;
}

export const PageHeader = ({
  title,
  subtitle,
  leftActions,
  rightActions,
  className,
  sticky = true
}: PageHeaderProps) => {
  return (
    <header className={cn(
      "glass-card border-b z-50 w-full",
      sticky && "sticky top-0",
      className
    )}>
      <div className="container-responsive mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {leftActions}
            {(leftActions && (title || subtitle)) && (
              <div className="h-6 w-px bg-border shrink-0" />
            )}
            {(title || subtitle) && (
              <div className="min-w-0 flex-1">
                {typeof title === 'string' ? (
                  <h1 className="text-xl font-semibold truncate">{title}</h1>
                ) : title}
                {subtitle && (
                  <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          {rightActions && (
            <div className="flex items-center gap-2 shrink-0">
              {rightActions}
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col gap-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {leftActions}
            </div>
            
            {rightActions && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col gap-2 mt-6">
                    {rightActions}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>

          {(title || subtitle) && (
            <div className="min-w-0">
              {typeof title === 'string' ? (
                <h1 className="text-lg font-semibold truncate">{title}</h1>
              ) : title}
              {subtitle && (
                <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};