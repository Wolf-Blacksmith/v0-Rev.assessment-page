"use client"

import { useEffect, useRef } from "react"
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js"

// Register the required components
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend)

interface DimensionResult {
  dimension: string
  score: number
}

interface RadarChartProps {
  data: DimensionResult[]
}

export function RadarChart({ data }: RadarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Format dimension labels to be shorter
    const labels = data.map((item) => {
      const parts = item.dimension.split(" vs. ")
      return parts[0]
    })

    const scores = data.map((item) => item.score)

    // Create the chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "radar",
        data: {
          labels,
          datasets: [
            {
              label: "Your Score",
              data: scores,
              backgroundColor: "rgba(51, 102, 204, 0.2)",
              borderColor: "rgba(51, 102, 204, 1)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(51, 102, 204, 1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(51, 102, 204, 1)",
            },
          ],
        },
        options: {
          scales: {
            r: {
              angleLines: {
                display: true,
              },
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: {
                stepSize: 20,
                callback: (value) => value + "%",
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${context.raw}%`,
              },
            },
          },
          maintainAspectRatio: false,
        },
      })
    }

    // Clean up on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}
