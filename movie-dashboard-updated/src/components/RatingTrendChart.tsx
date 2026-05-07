"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { RatingTrendRow } from "@/lib/types";

export function RatingTrendChart({ data }: { data: RatingTrendRow[] }) {
  const avg =
    data.length > 0
      ? data.reduce((s, r) => s + r.avgRating, 0) / data.length
      : null;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Average Rating by Year</CardTitle>
        <CardDescription>
          Rating trend over time.
          {avg && ` Overall avg: ${avg.toFixed(2)}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        {data.length === 0 ? (
          <div className="flex aspect-[3/1] min-h-[180px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No data for selected filters
          </div>
        ) : (
          <div className="w-full aspect-[3/1] min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  bottom: 20,
                  left: 10,
                  right: 10,
                }}
              >
                {/* Grid */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />

                {/* X Axis */}
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />

                {/* Y Axis */}
                <YAxis
                  width="auto"
                  domain={["auto", "auto"]}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />

                {/* Avg Line */}
                {avg && (
                  <ReferenceLine
                    y={avg}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="4 4"
                    label={{
                      value: "avg",
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 11,
                    }}
                  />
                )}

                {/* Tooltip */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    fontSize: 13,
                  }}
                  formatter={(value) => [
                    Number(value ?? 0).toFixed(2),
                    "Rating",
                  ]}
                />

                {/* Line */}
                <Line
                  type="monotone"
                  dataKey="avgRating"
                  stroke="#2563eb" // 🔥 darker vibrant blue
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 0,
                  }}
                  name="Avg Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}