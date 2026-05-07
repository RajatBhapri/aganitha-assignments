"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { ChartFilters } from "@/lib/types";
import { DEFAULT_FILTERS } from "@/lib/types";

type FilterPanelProps = {
  genres: string[];
  filters: ChartFilters;
  onChange: (next: ChartFilters) => void;
};

const RATING_OPTIONS = [
  { label: "2+", value: 2 },
  { label: "2.5+", value: 2.5 },
  { label: "3+", value: 3 },
  { label: "3.5+", value: 3.5 },
  { label: "4+", value: 4 },
  { label: "4.5+", value: 4.5 },
];

const LIMIT_OPTIONS = [5, 10, 15, 20];

export function FilterPanel({ genres, filters, onChange }: FilterPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Filters</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="h-8 gap-1.5 text-xs text-muted-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>
        <CardDescription>Adjust filters — charts update automatically.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">

          {/* Genre */}
          <div className="space-y-2">
            <Label>Genre</Label>
            <Select value={filters.genre} onValueChange={(v) => onChange({ ...filters, genre: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min Rating */}
          <div className="space-y-2">
            <Label>Min Rating</Label>
            <Select
              value={String(filters.minRating)}
              onValueChange={(v) => onChange({ ...filters, minRating: Number(v) })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {RATING_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Range — two plain number inputs */}
          <div className="space-y-2">
            <Label>Start Year</Label>
            <Input
              type="number"
              min={1900}
              max={filters.endYear}
              value={filters.startYear}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1900 && val <= filters.endYear) {
                  onChange({ ...filters, startYear: val });
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>End Year</Label>
            <Input
              type="number"
              min={filters.startYear}
              max={2025}
              value={filters.endYear}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= filters.startYear && val <= 2025) {
                  onChange({ ...filters, endYear: val });
                }
              }}
            />
          </div>

          {/* Top N Movies */}
          <div className="space-y-2">
            <Label>Top N Movies</Label>
            <Select
              value={String(filters.limit)}
              onValueChange={(v) => onChange({ ...filters, limit: Number(v) })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {LIMIT_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>Top {n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}