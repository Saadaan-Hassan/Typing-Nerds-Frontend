'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartDataItem } from '@/lib/services/drill-service';

interface AccuracyChartProps {
  data: ChartDataItem[];
  height?: number;
}

export function AccuracyChart({ data, height = 300 }: AccuracyChartProps) {
  // Format data for better display
  const chartData = useMemo(() => {
    if (!data?.length) return [];

    // Only use a subset of data points to prevent chart from being too crowded
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
      <AreaChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value.slice(0, 5)}
        />
        <YAxis tick={{ fontSize: 12 }} domain={[50, 100]} allowDataOverflow />
        <Tooltip
          formatter={(value: number) => [`${value}%`, 'Accuracy']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="accuracy"
          stroke="#ff7300"
          fill="#ff730020"
          name="Accuracy"
          strokeWidth={2}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="avgAccuracy"
          stroke="#82ca9d"
          name="Avg Accuracy"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
