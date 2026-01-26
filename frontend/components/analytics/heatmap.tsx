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

interface HeatmapProps {
  data: Array<{
    linkId: string;
    title: string;
    clicks: number;
    percentage: number;
  }>;
  title?: string;
  description?: string;
}

export default function Heatmap({
  data,
  title = 'Link Click Heatmap',
  description = 'Performance of your links by click count'
}: HeatmapProps) {
  // Sort data by clicks in descending order
  const sortedData = [...data].sort((a, b) => b.clicks - a.clicks);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="title"
              type="category"
              width={90}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'clicks') {
                  return [`${value} clicks`, 'Clicks'];
                } else if (name === 'percentage') {
                  return [`${value}%`, 'Percentage'];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="clicks" name="Clicks" fill="#8884d8">
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`rgba(136, 132, 216, ${0.6 + (0.4 * entry.percentage / 100)})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Additional heatmap visualization using a grid */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Visual Click Heatmap</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedData.map((link, index) => (
              <div
                key={link.linkId}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{
                  opacity: 0.5 + (link.percentage / 100) * 0.5, // Scale opacity from 0.5 to 1.0
                  backgroundColor: `rgba(136, 132, 216, ${(link.percentage / 100) * 0.3})`
                }}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900 truncate">{link.title}</h4>
                  <span className="text-sm font-semibold text-indigo-600">
                    {link.clicks}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${Math.min(link.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{link.percentage}%</span>
                    <span>of clicks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}