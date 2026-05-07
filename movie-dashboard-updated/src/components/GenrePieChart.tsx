"use client";

import { Cell, Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CHART_COLORS } from "@/lib/types";
import type { GenreChartRow } from "@/lib/types";

type Props = {
  data: GenreChartRow[];
  activeGenre: string;
  onSelectGenre: (genre: string) => void;
};

export function GenrePieChart({ data, activeGenre, onSelectGenre }: Props) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Genre Share</CardTitle>
            <CardDescription>
              Click a slice to filter all charts.
            </CardDescription>
          </div>

          {activeGenre !== "All" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectGenre("All")}
            >
              Reset
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {data.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground min-h-[250px]">
            No data for selected filters
          </div>
        ) : (
          <>
            {/* ✅ Responsive chart container (NO hardcoded height) */}
            <div className="w-full flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="genre"
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    paddingAngle={3}
                    onClick={(entry) => {
                      const data = entry as unknown as GenreChartRow;
                      onSelectGenre(data.genre);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {data.map((item, index) => {
                      const color = CHART_COLORS[index % CHART_COLORS.length];

                      return (
                        <Cell
                          key={item.genre}
                          fill={color}
                          stroke={
                            activeGenre === item.genre
                              ? "#ffffff"
                              : "transparent"
                          }
                          strokeWidth={activeGenre === item.genre ? 3 : 0}
                          opacity={
                            activeGenre !== "All" && activeGenre !== item.genre
                              ? 0.4
                              : 1
                          }
                        />
                      );
                    })}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                      fontSize: 13,
                    }}
                    formatter={(value, name) => [
                      Number(value ?? 0).toLocaleString(),
                      String(name),
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-2">
              {data.map((item, index) => {
                const color = CHART_COLORS[index % CHART_COLORS.length];

                return (
                  <button
                    key={item.genre}
                    onClick={() => onSelectGenre(item.genre)}
                    className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors hover:border-primary/60"
                    style={{
                      borderColor:
                        activeGenre === item.genre ? color : undefined,
                      color: activeGenre === item.genre ? color : undefined,
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {item.genre}
                    <Badge
                      variant="secondary"
                      className="ml-0.5 h-4 px-1 text-[10px]"
                    >
                      {item.count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
