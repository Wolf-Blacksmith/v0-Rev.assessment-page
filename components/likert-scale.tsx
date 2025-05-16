"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface LikertScaleProps {
  value: number | null
  onChange: (value: number) => void
  labels?: {
    left: string
    center?: string
    right: string
  }
  steps?: number
}

export function LikertScale({
  value,
  onChange,
  labels = { left: "Strongly Agree", center: "Neutral", right: "Strongly Disagree" },
  steps = 7,
}: LikertScaleProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate array of step values
  const options = Array.from({ length: steps }, (_, i) => i + 1)
  const midpoint = Math.ceil(steps / 2)

  useEffect(() => {
    // Focus the selected option when value changes
    if (value && containerRef.current) {
      const selectedElement = containerRef.current.querySelector(`[data-value="${value}"]`)
      if (selectedElement instanceof HTMLElement) {
        selectedElement.focus()
      }
    }
  }, [value])

  return (
    <div className="w-full max-w-3xl mx-auto my-8" ref={containerRef}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-primary">{labels.left}</span>
        {labels.center && <span className="text-sm font-medium text-gray-500">{labels.center}</span>}
        <span className="text-sm font-medium text-purple-500">{labels.right}</span>
      </div>

      <div className="grid grid-cols-7 gap-2" aria-label="Rating scale">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            data-value={option}
            className={cn(
              "flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-4 py-3 transition-all",
              option < midpoint
                ? "focus:ring-primary hover:bg-primary/10"
                : option === midpoint
                  ? "focus:ring-gray-400 hover:bg-gray-100"
                  : "focus:ring-purple-400 hover:bg-purple-50",
              value === option &&
                (option < midpoint
                  ? "bg-primary/20 border-2 border-primary"
                  : option === midpoint
                    ? "bg-gray-200 border-2 border-gray-400"
                    : "bg-purple-100 border-2 border-purple-400"),
            )}
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            aria-label={`Rating ${option} of ${steps}`}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                option < midpoint ? "bg-primary/10" : option === midpoint ? "bg-gray-100" : "bg-purple-50",
              )}
            >
              {option}
            </div>
            <span className="text-xs">
              {option < midpoint ? "Agree" : option === midpoint ? "Neutral" : "Disagree"}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
