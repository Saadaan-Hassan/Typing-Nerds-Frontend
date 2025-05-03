import { Check, Clock, Gauge, X } from 'lucide-react';

interface LiveStatsProps {
  wpm: number;
  accuracy: number;
  errors: number;
  timeLeft: number;
}

export function LiveStats({ wpm, accuracy, errors, timeLeft }: LiveStatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-border flex h-full justify-between gap-2 rounded-md border bg-white p-2">
      <div className="bg-secondary mb-1 flex w-full flex-col items-center justify-center rounded-md px-4 py-2">
        <div className="text-primary flex items-center">
          <Gauge className="mr-1 h-4 w-4" />
          <span className="text-xs font-medium">WPM</span>
        </div>
        <span className="text-xl font-bold">{wpm}</span>
      </div>

      <div className="bg-secondary mb-1 flex w-full flex-col items-center justify-center rounded-md px-4 py-2">
        <div className="text-primary flex items-center">
          <Check className="mr-1 h-4 w-4" />
          <span className="text-xs font-medium">Accuracy</span>
        </div>
        <span className="text-xl font-bold">{accuracy}%</span>
      </div>

      <div className="bg-secondary mb-1 flex w-full flex-col items-center justify-center rounded-md px-4 py-2">
        <div className="text-primary flex items-center">
          <X className="mr-1 h-4 w-4" />
          <span className="text-xs font-medium">Errors</span>
        </div>
        <span className="text-xl font-bold">{errors}</span>
      </div>

      <div className="bg-secondary flex w-full flex-col items-center justify-center rounded-md px-4 py-2">
        <div className="text-primary flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          <span className="text-xs font-medium">Time</span>
        </div>
        <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
}
