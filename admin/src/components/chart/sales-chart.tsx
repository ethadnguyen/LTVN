'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  {
    date: 'T1/22',
    Sales: 28900000,
    Orders: 2338,
  },
  {
    date: 'T2/22',
    Sales: 27560000,
    Orders: 2103,
  },
  {
    date: 'T3/22',
    Sales: 33220000,
    Orders: 2194,
  },
  {
    date: 'T4/22',
    Sales: 34700000,
    Orders: 2108,
  },
  {
    date: 'T5/22',
    Sales: 34750000,
    Orders: 1812,
  },
  {
    date: 'T6/22',
    Sales: 31290000,
    Orders: 1726,
  },
];

const formatCurrency = (value: number) => {
  if (typeof window !== 'undefined') {
    return `${value.toLocaleString('vi-VN')}đ`;
  }
  return `${value}đ`; // Dùng fallback nếu đang chạy trên server
};

export function SalesChart() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey='date'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          formatter={(value, name) => {
            const numericValue =
              typeof value === 'number' ? value : parseFloat(value as string);
            return [
              name === 'Sales'
                ? numericValue.toLocaleString('vi-VN') + 'đ'
                : numericValue,
              name === 'Sales' ? 'Doanh số' : 'Đơn hàng',
            ];
          }}
        />
        <Line
          type='monotone'
          dataKey='Sales'
          name='Doanh số'
          stroke='#8884d8'
          activeDot={{ r: 8 }}
        />
        <Line
          type='monotone'
          dataKey='Orders'
          name='Đơn hàng'
          stroke='#82ca9d'
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
