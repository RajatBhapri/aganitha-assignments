import { Film, Star, BarChart2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompact, formatNumber } from "@/lib/utils";
import type { SummaryData } from "@/lib/types";

type StatCardProps = {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
};

function StatCard({ title, value, sub, icon: Icon, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={`rounded-lg p-2.5 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryCards({ summary }: { summary: SummaryData }) {
  const stats: StatCardProps[] = [
    {
      title: "Total Movies",
      value: formatCompact(summary.totalMovies),
      sub: formatNumber(summary.totalMovies) + " titles",
      icon: Film,
      color: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Total Ratings",
      value: formatCompact(summary.totalRatings),
      sub: formatNumber(summary.totalRatings) + " entries",
      icon: BarChart2,
      color: "bg-violet-500/10 text-violet-400",
    },
    {
      title: "Average Rating",
      value: summary.averageRating.toFixed(2),
      sub: "out of 5.0",
      icon: Star,
      color: "bg-amber-500/10 text-amber-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <StatCard key={s.title} {...s} />
      ))}
    </div>
  );
}
