'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CategoryStats, TypeStats } from '@/lib/services/drill-service';

interface ComparisonChartProps {
  typeStats?: TypeStats;
  categoryStats?: {
    word: CategoryStats;
    code: CategoryStats;
  };
  mode: 'type' | 'category';
  height?: number;
}

export function ComparisonChart({
  typeStats,
  categoryStats,
  mode = 'type',
  height = 300,
}: ComparisonChartProps) {
  // Format data for charts
  const data =
    mode === 'type' && typeStats
      ? [
          {
            name: 'Drill',
            wpm: typeStats.drill.avgWpm,
            accuracy: typeStats.drill.avgAccuracy,
            count: typeStats.drill.count,
          },
          {
            name: 'Race',
            wpm: typeStats.race.avgWpm,
            accuracy: typeStats.race.avgAccuracy,
            count: typeStats.race.count,
          },
        ]
      : categoryStats
        ? [
            {
              name: 'Text',
              wpm: categoryStats.word.avgWpm,
              accuracy: categoryStats.word.avgAccuracy,
              count: categoryStats.word.count,
            },
            {
              name: 'Code',
              wpm: categoryStats.code.avgWpm,
              accuracy: categoryStats.code.avgAccuracy,
              count: categoryStats.code.count,
            },
          ]
        : [];

  if (!data.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-sm">No data available</p>
      </div>
    );
  }

  const colors = {
    wpm: ['#8884d8', '#83a6ed'],
    accuracy: ['#ff7300', '#ff9b59'],
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 12 }}
          width={60}
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === 'accuracy') return [`${value}%`, 'Accuracy'];
            return [value, name.toUpperCase()];
          }}
        />
        <Legend />
        <Bar dataKey="wpm" name="WPM" barSize={20} radius={[0, 4, 4, 0]}>
          {data.map((_, index) => (
            <Cell
              key={`cell-wpm-${index}`}
              fill={colors.wpm[index % colors.wpm.length]}
            />
          ))}
        </Bar>
        <Bar
          dataKey="accuracy"
          name="Accuracy (%)"
          barSize={20}
          radius={[0, 4, 4, 0]}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-acc-${index}`}
              fill={colors.accuracy[index % colors.accuracy.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
