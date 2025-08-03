import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('3D Component Error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('3D Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Trigger showing main content immediately when 3D fails
      setTimeout(() => {
        console.log('3D Error - forcing main content display');
        const event = new CustomEvent('force-show-main-content');
        window.dispatchEvent(event);
      }, 0);

      return this.props.fallback || (
        <div className="flex items-center justify-center h-full bg-background/50 backdrop-blur-sm pointer-events-none">
          <div className="text-center space-y-4">
            <div className="text-2xl">🛡️</div>
            <p className="text-muted-foreground">3D visualization unavailable</p>
            <div className="w-full h-1 bg-primary/20 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground">Loading interface...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}