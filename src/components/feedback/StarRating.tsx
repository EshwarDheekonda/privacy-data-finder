import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export const StarRating = ({ value, onChange, error }: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    onChange(rating);
  };

  const handleMouseEnter = (rating: number) => {
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isActive = (hoverValue || value) >= rating;
          return (
            <button
              key={rating}
              type="button"
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              className={cn(
                "transition-all duration-200 ease-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
                "min-w-[44px] min-h-[44px] flex items-center justify-center"
              )}
              aria-label={`Rate ${rating} stars`}
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-all duration-200",
                  isActive
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground hover:text-yellow-400"
                )}
              />
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
