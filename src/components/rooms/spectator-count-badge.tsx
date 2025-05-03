'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SpectatorCountBadgeProps {
  count: number;
  showTooltip?: boolean;
}

export function SpectatorCountBadge({
  count,
  showTooltip = true,
}: SpectatorCountBadgeProps) {
  const [prevCount, setPrevCount] = useState(count);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Highlight the badge when count changes
  useEffect(() => {
    if (count !== prevCount) {
      setPrevCount(count);
      setIsHighlighted(true);

      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [count, prevCount]);

  const badge = (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 transition-colors duration-300 ${
        isHighlighted
          ? 'border-blue-500/50 bg-blue-500/20 text-blue-600'
          : 'border-muted-foreground/20 bg-muted-foreground/10'
      }`}
    >
      <Eye className="h-3 w-3" />
      <span>{count}</span>
    </Badge>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>
            {count} {count === 1 ? 'spectator' : 'spectators'} watching
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
