"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step?: number
  className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onValueChange, min, max, step = 1, className }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newValue = [...value]
      newValue[index] = Number(e.target.value)
      onValueChange(newValue)
    }

    return (
      <div ref={ref} className={cn("relative flex w-full items-center space-x-2", className)}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => handleChange(e, 0)}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        {value.length > 1 && (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[1]}
            onChange={(e) => handleChange(e, 1)}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        )}
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }
