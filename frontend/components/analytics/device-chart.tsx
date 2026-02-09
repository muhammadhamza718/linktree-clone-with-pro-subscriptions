"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DeviceChartProps {
  deviceData: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  browserData?: Array<{
    browser: string;
    count: number;
  }>;
  osData?: Array<{
    os: string;
    count: number;
  }>;
  title?: string;
  description?: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function DeviceChart({
  deviceData,
  browserData = [],
  osData = [],
  title = "Device & Browser Analytics",
  description = "Breakdown of devices, browsers, and operating systems",
}: DeviceChartProps) {
  // Prepare device data for pie chart
  const deviceChartData = [
    { name: "Mobile", value: deviceData.mobile },
    { name: "Tablet", value: deviceData.tablet },
    { name: "Desktop", value: deviceData.desktop },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Device Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Device Distribution</CardTitle>
          <CardDescription>How visitors access your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }: { name: string; percent: number }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {deviceChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} visitors`, "Count"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Browser Distribution Bar Chart */}
      {browserData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Browser Distribution</CardTitle>
            <CardDescription>
              Most common browsers used to access your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={browserData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="browser" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} visitors`, "Count"]}
                />
                <Legend />
                <Bar dataKey="count" name="Visitors" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* OS Distribution Bar Chart */}
      {osData.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Operating System Distribution</CardTitle>
            <CardDescription>
              Most common operating systems used to access your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={osData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="os" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} visitors`, "Count"]}
                />
                <Legend />
                <Bar dataKey="count" name="Visitors" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
