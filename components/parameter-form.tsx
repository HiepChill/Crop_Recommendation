"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Minus, Plus } from "lucide-react"

type ParameterKey = "nitrogen" | "phosphorus" | "potassium" | "temperature" | "humidity" | "ph" | "rainfall"

interface ParameterFormProps {
  params: Record<ParameterKey, number>
  setParams: React.Dispatch<React.SetStateAction<Record<ParameterKey, number>>>
  fields: ParameterKey[]
  onPredict: (() => void) | null
}

const parameterLabels: Record<ParameterKey, string> = {
  nitrogen: "Hàm lượng Nitrogen (N)",
  phosphorus: "Hàm lượng Phosphorus (P)",
  potassium: "Hàm lượng Potassium (K)",
  temperature: "Nhiệt độ (°C)",
  humidity: "Độ ẩm (%)",
  ph: "Độ pH của đất",
  rainfall: "Lượng mưa (mm)",
}

const parameterRanges: Record<ParameterKey, [number, number]> = {
  nitrogen: [0, 140],
  phosphorus: [0, 140],
  potassium: [0, 200],
  temperature: [0, 40],
  humidity: [0, 100],
  ph: [0, 14],
  rainfall: [0, 300],
}

export function ParameterForm({ params, setParams, fields, onPredict }: ParameterFormProps) {
  const updateParam = (param: ParameterKey, value: number) => {
    const [min, max] = parameterRanges[param]
    const clampedValue = Math.max(min, Math.min(max, value))

    setParams((prev) => ({
      ...prev,
      [param]: clampedValue,
    }))
  }

  const increment = (param: ParameterKey) => {
    const step = param === "temperature" || param === "humidity" || param === "ph" || param === "rainfall" ? 0.1 : 1
    updateParam(param, Number((params[param] + step).toFixed(2)))
  }

  const decrement = (param: ParameterKey) => {
    const step = param === "temperature" || param === "humidity" || param === "ph" || param === "rainfall" ? 0.1 : 1
    updateParam(param, Number((params[param] - step).toFixed(2)))
  }

  const handleInputChange = (param: ParameterKey, value: string) => {
    updateParam(param, Number(value))
  }

  const formatValue = (value: number) => {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1)
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field} className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm text-gray-300 font-medium">{parameterLabels[field]}</label>
            <span className="text-sm text-green-300">{formatValue(params[field])}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => decrement(field)}
              className="bg-black/30 border-white/10 text-white hover:bg-black/50 h-8 w-8 rounded-md flex items-center justify-center"
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Giảm</span>
            </Button>

            <Slider
              value={[params[field]]}
              min={parameterRanges[field][0]}
              max={parameterRanges[field][1]}
              step={field === "temperature" || field === "humidity" || field === "ph" || field === "rainfall" ? 0.1 : 1}
              onValueChange={(values) => updateParam(field, values[0])}
              className="flex-1"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={() => increment(field)}
              className="bg-black/30 border-white/10 text-white hover:bg-black/50 h-8 w-8 rounded-md flex items-center justify-center"
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Tăng</span>
            </Button>

            <Input
              type="number"
              value={formatValue(params[field])}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-16 h-8 bg-black/30 border-white/10 text-white text-center"
            />
          </div>
        </div>
      ))}

      {onPredict && (
        <Button
          onClick={onPredict}
          className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white border-none"
        >
          Dự đoán cây trồng
        </Button>
      )}
    </div>
  )
}

