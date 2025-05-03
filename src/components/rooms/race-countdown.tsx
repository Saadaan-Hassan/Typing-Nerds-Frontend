'use client';

import { useEffect, useState } from 'react';
import { Keyboard } from 'lucide-react';

interface RaceCountdownProps {
  count: number;
}

export function RaceCountdown({ count }: RaceCountdownProps) {
  const [scale, setScale] = useState(1);

  // Animation effect
  useEffect(() => {
    setScale(1.5);
    const timer = setTimeout(() => setScale(1), 300);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4 rounded-xl bg-white p-10 shadow-lg">
        <Keyboard className="text-primary h-16 w-16" />
        <h2 className="text-2xl font-bold">Get Ready!</h2>
        <div
          className="bg-primary flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold text-white transition-transform duration-300"
          style={{ transform: `scale(${scale})` }}
        >
          {count}
        </div>
        <p className="text-muted-foreground">Race starts in {count} seconds</p>
      </div>
    </div>
  );
}
