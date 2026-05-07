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
import type { GenreChartRow } from "@/lib/types";

export function MoviesByGenreChart({ data }: { data: GenreChartRow[] }) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Movies by Genre</CardTitle>
        <CardDescription>Top genres after your filters.</CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        {data.length === 0 ? (
          <div className="flex aspect-[3/1] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No data for selected filters
          </div>
        ) : (
          <div className=" w-full aspect-[3.5/1] min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 30,
                  bottom: 0,
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
                  dataKey="genre"
                  interval={0}
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
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
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
                    color: "hsl(var(--foreground))", // title (movie name / label)
                  }}
                  itemStyle={{
                    color: "hsl(var(--foreground))", // value text (Movies / numbers)
                  }}
                  cursor={{ fill: "hsl(var(--muted)/0.25)" }}
                  formatter={(value) => [
                    Number(value ?? 0).toLocaleString(),
                    "Movies",
                  ]}
                />

                {/* Bars */}
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.map((item, index) => (
                    <Cell
                      key={item.genre}
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
