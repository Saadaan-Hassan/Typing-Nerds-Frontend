'use client';

import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartDataItem } from '@/lib/services/drill-service';

interface ProgressionChartProps {
  data: ChartDataItem[];
  height?: number;
}

export function ProgressionChart({
  data,
  height = 300,
}: ProgressionChartProps) {
  // Format data for better display
  const chartData = useMemo(() => {
    if (!data?.length) return [];

    // Only use a subset of data points to prevent chart from being too crowded
    // For larger datasets, take every n-th entry or create aggregates
    const interval = Math.max(1, Math.floor(data.length / 30));

    return data
      .filter((_, index) => index % interval === 0)
      .map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString(),
      }));
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-sm">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value.slice(0, 5)}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: number) => [value, '']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="wpm"
          stroke="#8884d8"
          name="WPM"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="avgWpm"
          stroke="#82ca9d"
          name="Avg WPM"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
