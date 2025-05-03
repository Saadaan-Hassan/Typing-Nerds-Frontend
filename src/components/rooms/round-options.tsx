'use client';

import { Clock, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoundOptionsProps {
  duration: number;
  onDurationChange: (duration: number) => void;
}

export function RoundOptions({
  duration,
  onDurationChange,
}: RoundOptionsProps) {
  return (
    <Card className="h-full border shadow-sm">
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="text-primary h-4 w-4" />
          Round Options
        </CardTitle>
        <CardDescription className="text-xs">
          Customize your typing experience
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">Duration:</span>
          </div>
          <Select
            value={duration.toString()}
            onValueChange={(value) => onDurationChange(Number.parseInt(value))}
          >
            <SelectTrigger className="h-8 w-[110px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">1 minute</SelectItem>
              <SelectItem value="120">2 minutes</SelectItem>
              <SelectItem value="180">3 minutes</SelectItem>
              <SelectItem value="300">5 minutes</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8"
            onClick={() => onDurationChange(duration)}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
