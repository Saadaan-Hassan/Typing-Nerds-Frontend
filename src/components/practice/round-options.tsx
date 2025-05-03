'use client';

import { Clock, Code, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RoundOptionsProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  category: 'word' | 'code';
  onCategoryChange: (category: 'word' | 'code') => void;
}

export function RoundOptions({
  duration,
  onDurationChange,
  category,
  onCategoryChange,
}: RoundOptionsProps) {
  const timeOptions = [
    { value: 15, label: '15s' },
    { value: 30, label: '30s' },
    { value: 60, label: '60s' },
    { value: 120, label: '2min' },
  ];

  return (
    <div className="border-border flex h-full flex-col justify-between rounded-md border bg-white p-4">
      <div className="flex items-center">
        <Clock className="text-primary mr-2 h-5 w-5" />
        <span className="font-medium">Round Duration:</span>
        <div className="ml-4 flex space-x-2">
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

      <div className="mt-2 flex items-center">
        <span className="mr-4 font-medium">Category:</span>
        <Tabs
          value={category}
          onValueChange={(value) => onCategoryChange(value as 'word' | 'code')}
          className="w-auto"
        >
          <TabsList className="bg-secondary">
            <TabsTrigger value="word" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center">
              <Code className="mr-2 h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
