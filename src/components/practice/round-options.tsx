'use client';

import { Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface RoundOptionsProps {
  duration: number;
  onDurationChange: (duration: number) => void;
}

export function RoundOptions({
  duration,
  onDurationChange,
}: RoundOptionsProps) {
  const timeOptions = [
    { value: 15, label: '15s' },
    { value: 30, label: '30s' },
    { value: 60, label: '60s' },
    { value: 120, label: '2min' },
  ];

  return (
    <div className="border-border flex h-full items-center rounded-md border bg-white p-4">
      <div className="mr-4 flex items-center">
        <Clock className="text-primary mr-2 h-5 w-5" />
        <span className="font-medium">Round Duration:</span>
      </div>
      <div className="flex space-x-2">
        {timeOptions.map((option) => (
          <Button
            key={option.value}
            variant={duration === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onDurationChange(option.value)}
            className={
              duration === option.value
                ? 'bg-primary text-primary-foreground'
                : ''
            }
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
