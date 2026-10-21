'use client';

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

/**
 * Placeholder dataset — swap with real metrics from the API later.
 * One sample every 2 hours over the last 24 hours.
 */
export const resourceData = [
  { time: '00:00', cpu: 32, ram: 55, disk: 20 },
  { time: '02:00', cpu: 28, ram: 58, disk: 18 },
  { time: '04:00', cpu: 24, ram: 52, disk: 15 },
  { time: '06:00', cpu: 30, ram: 60, disk: 22 },
  { time: '08:00', cpu: 42, ram: 68, disk: 28 },
  { time: '10:00', cpu: 38, ram: 72, disk: 25 },
  { time: '12:00', cpu: 45, ram: 75, disk: 30 },
  { time: '14:00', cpu: 40, ram: 70, disk: 26 },
  { time: '16:00', cpu: 35, ram: 65, disk: 22 },
  { time: '18:00', cpu: 33, ram: 62, disk: 20 },
  { time: '20:00', cpu: 36, ram: 67, disk: 24 },
  { time: '22:00', cpu: 30, ram: 60, disk: 19 },
];

const axisTick = { fill: '#94a3b8', fontSize: 12 };

export default function ResourceChart({
  data = resourceData,
  height = 280,
}: {
  data?: typeof resourceData;
  height?: number;
}) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#eef2f7" />
          <XAxis
            dataKey="time"
            ticks={['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '22:00']}
            tickLine={false}
            axisLine={false}
            tick={axisTick}
            dy={8}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(value: number) => `${value}%`}
            tickLine={false}
            axisLine={false}
            tick={axisTick}
            width={40}
          />
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #eef2f7',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
              fontSize: 12,
            }}
            labelStyle={{ color: '#6b7280', fontWeight: 500 }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: '#6b7280', paddingTop: 8 }}
          />
          <Line
            type="monotone"
            dataKey="cpu"
            name="CPU"
            stroke="#1a6ef5"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="ram"
            name="RAM"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="disk"
            name="Disk"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
