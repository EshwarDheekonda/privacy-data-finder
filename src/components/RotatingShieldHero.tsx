import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';

interface RotatingShieldHeroProps {
  onAnimationComplete?: () => void;
}

export const RotatingShieldHero = ({ onAnimationComplete }: RotatingShieldHeroProps) => {
  const [animationPhase, setAnimationPhase] = useState<'shield-enter' | 'text-appear' | 'shield-rotate' | 'complete'>('shield-enter');

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Shield enters and grows (0-1s)
    timers.push(setTimeout(() => {
      setAnimationPhase('text-appear');
    }, 1000));

    // Phase 2: Text appears on shield (1-2s)
    timers.push(setTimeout(() => {
      setAnimationPhase('shield-rotate');
    }, 2000));

    // Phase 3: Shield rotates to reveal text (2-3.5s)
    timers.push(setTimeout(() => {
      setAnimationPhase('complete');
      onAnimationComplete?.();
    }, 3500));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [onAnimationComplete]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Shield Container */}
      <div 
        className={`
          relative transition-all duration-1000 ease-out
          ${animationPhase === 'shield-enter' ? 'shield-enter' : ''}
          ${animationPhase === 'text-appear' ? 'shield-centered' : ''}
          ${animationPhase === 'shield-rotate' ? 'shield-rotating' : ''}
          ${animationPhase === 'complete' ? 'shield-complete' : ''}
        `}
      >
        {/* The Shield Logo */}
        <div className="relative z-20">
          <Logo 
            variant="main" 
            size="xl" 
            className="w-48 h-48 md:w-64 md:h-64 transition-all duration-1000 shield-glow" 
          />
        </div>

        {/* Text Overlay on Shield */}
        <div 
          className={`
            absolute inset-0 flex items-center justify-center z-30
            transition-all duration-500
            ${animationPhase === 'text-appear' || animationPhase === 'shield-rotate' ? 'text-visible' : 'text-hidden'}
          `}
        >
          <div className="text-center px-4">
            <h1 className="text-2xl md:text-4xl font-bold text-white/90 drop-shadow-lg">
              Discover Your
            </h1>
            <h2 className="text-xl md:text-3xl font-semibold text-white/80 drop-shadow-lg mt-1">
              Digital Footprint
            </h2>
            <h3 className="text-lg md:text-2xl font-medium text-white/70 drop-shadow-lg mt-1">
              & Privacy Risk
            </h3>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Pulsing Ring Effects */}
        <div 
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-96 h-96 border-2 border-primary/30 rounded-full
            transition-all duration-2000
            ${animationPhase !== 'shield-enter' ? 'animate-pulse scale-150 opacity-0' : 'scale-100 opacity-100'}
          `}
        />
        <div 
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-80 h-80 border border-secondary/40 rounded-full
            transition-all duration-2000 delay-300
            ${animationPhase !== 'shield-enter' ? 'animate-pulse scale-125 opacity-0' : 'scale-100 opacity-100'}
          `}
        />
      </div>
    </div>
  );
};