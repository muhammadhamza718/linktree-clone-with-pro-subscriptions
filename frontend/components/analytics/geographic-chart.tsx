'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface GeographicChartProps {
  data: Array<{
    country: string;
    count: number;
  }>;
  title?: string;
  description?: string;
}

export default function GeographicChart({ data, title = 'Visitor Locations', description = 'Top countries visiting your profile' }: GeographicChartProps) {
  // Sort data by count in descending order and take top 10
  const sortedData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sortedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="country"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} visitors`, 'Count']}
              labelFormatter={(label) => `Country: ${label}`}
            />
            <Legend />
            <Bar dataKey="count" name="Visitors" fill="#8884d8">
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#8884d8" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}