"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/types";
import type { TopMovieRow } from "@/lib/types";

export function TopMoviesChart({ data }: { data: TopMovieRow[] }) {
  const chartData = data.map((item) => ({
    ...item,
    shortTitle:
      item.title.length > 30 ? `${item.title.slice(0, 30)}…` : item.title,
  }));

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Top Rated Movies</CardTitle>
        <CardDescription>
          Highest rated movies with ≥20 ratings.
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        {chartData.length === 0 ? (
          <div className="flex aspect-[3/1] min-h-[180px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No data for selected filters
          </div>
        ) : (
          <div
            className="w-full"
            style={{
              height: `${Math.max(180, chartData.length * 28)}px`,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                barCategoryGap="30%"
                margin={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >
                {/* Grid */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />

                {/* X Axis (ratings) */}
                <XAxis
                  type="number"
                  domain={[
                    (min: number) =>
                      Math.max(0, Math.floor(min * 100 - 2) / 100), // ~0.02 lower
                    (max: number) => Math.min(5, Math.ceil(max * 10) / 10),
                  ]}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />

                {/* Y Axis (titles) */}
                <YAxis
                  type="category"
                  dataKey="shortTitle"
                  width="auto"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 11,
                  }}
                />

                {/* Tooltip */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 13,
                  }}
                  labelStyle={{
                    color: "#fff", // movie title
                    fontWeight: 500,
                  }}
                  itemStyle={{
                    color: "#fff", // 👈 FIXES your black text issue
                  }}
                  cursor={{ fill: "hsl(var(--muted)/0.25)" }}
                  formatter={(value, _name, props) => [
                    `${Number(value ?? 0).toFixed(2)} ★ (${
                      props?.payload?.ratingCount ?? 0
                    } ratings)`,
                    "Rating",
                  ]}
                />

                {/* Bars */}
                <Bar
                  dataKey="avgRating"
                  radius={[0, 6, 6, 0]}
                  barSize={14}
                  name="Avg Rating"
                >
                  {chartData.map((item, index) => (
                    <Cell
                      key={item.title}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
