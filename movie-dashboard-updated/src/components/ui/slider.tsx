"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    {/* Track */}
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-700">
      {/* Selected Range */}
      <SliderPrimitive.Range className="absolute h-full bg-blue-900 shadow-lg shadow-blue-900/40" /> 
    </SliderPrimitive.Track>

    {/* Thumbs */}
    {(props.value ?? props.defaultValue ?? []).map((_: number, i: number) => (
      <SliderPrimitive.Thumb
        key={i}
        className={cn(
          "block h-4 w-4 rounded-full shadow transition-all",
          "bg-white border-2 border-blue-600", 
          "hover:border-blue-500",
          "focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-blue-1700/60", 
          "disabled:pointer-events-none disabled:opacity-50"
        )}
      />
    ))}
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };