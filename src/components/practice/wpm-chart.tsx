'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface WpmChartProps {
  data: { time: number; wpm: number }[];
}

export function WpmChart({ data }: WpmChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
        <XAxis
          dataKey="time"
          stroke="#6b7280"
          label={{
            value: 'Time (seconds)',
            position: 'insideBottomRight',
            offset: -5,
          }}
        />
        <YAxis
          stroke="#6b7280"
          label={{ value: 'WPM', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          formatter={(value) => [`${value} WPM`, 'Speed']}
          labelFormatter={(label) => `${label}s`}
        />
        <Line
          type="monotone"
          dataKey="wpm"
          name="WPM"
          stroke="#2ecc71"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
