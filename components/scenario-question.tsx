"use client"

import type { Option } from "@/data/questions"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ScenarioQuestionProps {
  options: Option[]
  value: string | null
  onChange: (value: string) => void
}

export function ScenarioQuestion({ options, value, onChange }: ScenarioQuestionProps) {
  return (
    <RadioGroup value={value?.toString() || ""} onValueChange={onChange} className="space-y-4 mt-6">
      {options.map((option, index) => (
        <div
          key={option.value}
          className={cn(
            "flex items-start space-x-3 rounded-lg p-4 transition-colors cursor-pointer",
            "border hover:border-primary/40 hover:bg-primary/5",
            value === option.value && "border-primary bg-primary/10",
            index < 2 && "border-green-200 hover:border-green-400 hover:bg-green-50",
            index > 3 && "border-orange-200 hover:border-orange-400 hover:bg-orange-50",
            index < 2 && value === option.value && "border-green-400 bg-green-50",
            index > 3 && value === option.value && "border-orange-400 bg-orange-50",
          )}
          onClick={() => onChange(option.value)}
        >
          <RadioGroupItem value={option.value} id={`option-${option.value}`} className="mt-1" />
          <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
            <div className="font-medium mb-1">{option.label}</div>
            <div className="text-xs text-muted-foreground">{getOptionDescription(index, options.length)}</div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

// Helper function to add more descriptive text based on the option position
function getOptionDescription(index: number, total: number): string {
  if (index === 0) return "Best practice with strongest results"
  if (index === 1) return "Good practice with positive results"
  if (index === Math.floor(total / 2)) return "Moderate approach with average results"
  if (index === total - 2) return "Less effective approach"
  if (index === total - 1) return "Least effective approach"
  return ""
}
