"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Minus, Plus, Sprout, Leaf, Thermometer, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Định nghĩa kiểu dữ liệu cho kết quả đề xuất
interface ImprovementSuggestionData {
  title: string
  description: string
  priority: "Cao" | "Trung bình" | "Thấp"
}

interface ImprovementResult {
  suggestions: ImprovementSuggestionData[]
}

export function SoilImprovement() {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [improvementResult, setImprovementResult] = useState<ImprovementResult | null>(null)
  const [params, setParams] = useState({
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    temperature: 25.0,
    humidity: 70.0,
    ph: 6.5,
    rainfall: 200.0,
  })

  // Đảm bảo component chỉ render ở client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const crops = [
    "Lúa",
    "Ngô",
    "Đậu hồi (đậu gà)",
    "Đậu đỏ tây (đậu thận)",
    "Đậu triều (đậu bồ câu)",
    "Đậu bướm (Matki)",
    "Đậu xanh",
    "Đậu đen",
    "Đậu lăng",
    "Lựu",
    "Chuối",
    "Xoài",
    "Nho",
    "Dưa hấu",
    "Dưa lưới",
    "Táo",
    "Cam",
    "Đu đủ",
    "Dừa",
    "Bông",
    "Đay",
    "Cà phê",
  ]

  const updateParam = (param: keyof typeof params, value: number) => {
    setParams((prev) => ({
      ...prev,
      [param]: value,
    }))
  }

  const increment = (param: keyof typeof params) => {
    const step = param === "temperature" || param === "humidity" || param === "ph" || param === "rainfall" ? 0.1 : 1
    updateParam(param, Number((params[param] + step).toFixed(1)))
  }

  const decrement = (param: keyof typeof params) => {
    const step = param === "temperature" || param === "humidity" || param === "ph" || param === "rainfall" ? 0.1 : 1
    updateParam(param, Number((params[param] - step).toFixed(1)))
  }

  const handleInputChange = (param: keyof typeof params, value: string) => {
    updateParam(param, Number(value))
  }

  const formatValue = (value: number) => {
    if (Number.isInteger(value)) {
      return value.toString()
    }
    return value.toFixed(1)
  }

  const handleCropSelect = (value: string) => {
    setSelectedCrop(value)

    // Cập nhật thông số tối ưu dựa trên loại cây trồng
    if (value === "Lúa") {
      setParams({
        ...params,
        nitrogen: 60,
        phosphorus: 40,
        potassium: 30,
        ph: 6.0,
        temperature: 28.0,
        humidity: 80.0,
        rainfall: 200.0,
      })
    } else if (value === "Ngô") {
      setParams({
        ...params,
        nitrogen: 80,
        phosphorus: 50,
        potassium: 40,
        ph: 6.5,
        temperature: 25.0,
        humidity: 65.0,
        rainfall: 150.0,
      })
    } else if (value === "Đậu hồi (đậu gà)") {
      setParams({
        ...params,
        nitrogen: 40,
        phosphorus: 60,
        potassium: 80,
        ph: 6.5,
        temperature: 20.0,
        humidity: 50.0,
        rainfall: 100.0,
      })
    } else if (value === "Đậu đỏ tây (đậu thận)") {
      setParams({
        ...params,
        nitrogen: 20,
        phosphorus: 60,
        potassium: 20,
        ph: 6.0,
        temperature: 20.0,
        humidity: 70.0,
        rainfall: 100.0,
      })
    } else if (value === "Đậu triều (đậu bồ câu)") {
      setParams({
        ...params,
        nitrogen: 20,
        phosphorus: 60,
        potassium: 20,
        ph: 6.5,
        temperature: 25.0,
        humidity: 60.0,
        rainfall: 120.0,
      })
    } else if (value === "Đậu bướm (Matki)") {
      setParams({
        ...params,
        nitrogen: 20,
        phosphorus: 40,
        potassium: 20,
        ph: 6.0,
        temperature: 25.0,
        humidity: 50.0,
        rainfall: 80.0,
      })
    } else if (value === "Đậu xanh") {
      setParams({
        ...params,
        nitrogen: 20,
        phosphorus: 40,
        potassium: 20,
        ph: 6.5,
        temperature: 28.0,
        humidity: 80.0,
        rainfall: 100.0,
      })
    } else if (value === "Đậu đen") {
      setParams({
        ...params,
        nitrogen: 40,
        phosphorus: 60,
        potassium: 20,
        ph: 6.0,
        temperature: 25.0,
        humidity: 70.0,
        rainfall: 90.0,
      })
    } else if (value === "Đậu lăng") {
      setParams({
        ...params,
        nitrogen: 20,
        phosphorus: 60,
        potassium: 20,
        ph: 6.5,
        temperature: 20.0,
        humidity: 60.0,
        rainfall: 100.0,
      })
    } else if (value === "Lựu") {
      setParams({
        ...params,
        nitrogen: 20,
        phosphorus: 20,
        potassium: 20,
        ph: 6.0,
        temperature: 25.0,
        humidity: 50.0,
        rainfall: 80.0,
      })
    } else if (value === "Chuối") {
      setParams({
        ...params,
        nitrogen: 100,
        phosphorus: 20,
        potassium: 50,
        ph: 6.5,
        temperature: 27.0,
        humidity: 80.0,
        rainfall: 200.0,
      })
    } else if (value === "Xoài") {
      setParams({
        ...params,
        nitrogen: 20,
        phosphorus: 20,
        potassium: 20,
        ph: 6.0,
        temperature: 30.0,
        humidity: 60.0,
        rainfall: 150.0,
      })
    } else if (value === "Nho") {
      setParams({
        ...params,
        nitrogen: 20,
        phosphorus: 20,
        potassium: 20,
        ph: 6.5,
        temperature: 25.0,
        humidity: 50.0,
        rainfall: 100.0,
      })
    } else if (value === "Dưa hấu") {
      setParams({
        ...params,
        nitrogen: 100,
        phosphorus: 20,
        potassium: 20,
        ph: 6.0,
        temperature: 28.0,
        humidity: 80.0,
        rainfall: 100.0,
      })
    } else if (value === "Dưa lưới") {
      setParams({
        ...params,
        nitrogen: 100,
        phosphorus: 20,
        potassium: 20,
        ph: 6.5,
        temperature: 28.0,
        humidity: 80.0,
        rainfall: 100.0,
      })
    } else if (value === "Táo") {
      setParams({
        ...params,
        nitrogen: 20,
        phosphorus: 20,
        potassium: 20,
        ph: 6.0,
        temperature: 20.0,
        humidity: 70.0,
        rainfall: 100.0,
      })
    } else if (value === "Cam") {
      setParams({
        ...params,
        nitrogen: 20,
        phosphorus: 20,
        potassium: 20,
        ph: 6.5,
        temperature: 25.0,
        humidity: 70.0,
        rainfall: 120.0,
      })
    } else if (value === "Đu đủ") {
      setParams({
        ...params,
        nitrogen: 100,
        phosphorus: 20,
        potassium: 50,
        ph: 6.0,
        temperature: 28.0,
        humidity: 80.0,
        rainfall: 150.0,
      })
    } else if (value === "Dừa") {
      setParams({
        ...params,
        nitrogen: 20,
        phosphorus: 20,
        potassium: 50,
        ph: 6.5,
        temperature: 28.0,
        humidity: 80.0,
        rainfall: 200.0,
      })
    } else if (value === "Bông") {
      setParams({
        ...params,
        nitrogen: 120,
        phosphorus: 40,
        potassium: 20,
        ph: 6.0,
        temperature: 25.0,
        humidity: 70.0,
        rainfall: 100.0,
      })
    } else if (value === "Đay") {
      setParams({
        ...params,
        nitrogen: 80,
        phosphorus: 40,
        potassium: 40,
        ph: 6.5,
        temperature: 28.0,
        humidity: 80.0,
        rainfall: 200.0,
      })
    } else if (value === "Cà phê") {
      setParams({
        ...params,
        nitrogen: 70,
        phosphorus: 45,
        potassium: 60,
        ph: 5.5,
        temperature: 22.0,
        humidity: 70.0,
        rainfall: 180.0,
      })
    }

    // Gọi handleSuggest với giá trị value
    if (value) {
      handleSuggest(value)
    }
  }

  const handleSuggest = async (crop?: string) => {
    // Sử dụng crop từ tham số, nếu không có thì dùng selectedCrop
    const cropToUse = crop || selectedCrop

    // Kiểm tra xem đã chọn cây trồng chưa
    if (!cropToUse) {
      alert("Vui lòng chọn loại cây trồng trước khi đề xuất cải thiện đất.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setShowResults(false)

    try {
      // Gọi API FastAPI với URL đúng
      const response = await fetch("http://localhost:8000/suggest-improvement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crop: cropToUse,
          ...params,
        }),
      })

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { detail: "Không thể phân tích dữ liệu lỗi từ API" };
        }
        console.error('Error from API:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
        });
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }

      // Xử lý kết quả từ API
      const data = await response.json()

      // Sử dụng kết quả từ API
      setImprovementResult(data)
      setShowResults(true)
    } catch (error) {
      console.error("Error suggesting improvements:", error)

      // Sử dụng kết quả giả lập trong trường hợp lỗi
      const mockResult: ImprovementResult = {
        suggestions: [
          {
            title: "Bón phân đạm",
            description: "Tăng lượng phân đạm để đạt mức Nitrogen tối ưu cho cây trồng.",
            priority: "Cao",
          },
          {
            title: "Điều chỉnh độ pH",
            description: "Sử dụng vôi nông nghiệp để tăng độ pH của đất.",
            priority: "Trung bình",
          },
          {
            title: "Tưới nước",
            description: "Tăng cường tưới nước để đảm bảo độ ẩm phù hợp cho cây trồng.",
            priority: "Thấp",
          },
        ],
      }

      setImprovementResult(mockResult)
      setShowResults(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Trả về null hoặc skeleton trong quá trình hydration
  if (!isMounted) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-700/30 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-10 bg-gray-700/30 rounded mb-6"></div>
            <div className="h-40 bg-gray-700/30 rounded"></div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-60 bg-gray-700/30 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Sprout className="h-6 w-6 text-green-400 mr-2" />
        <h2 className="text-2xl font-bold text-white">Đề xuất cải thiện đất</h2>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
          >
            Cơ bản
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
          >
            Nâng cao
          </TabsTrigger>
        </TabsList>

        {/* Tab Cơ bản: Chỉ hiển thị phần chọn cây trồng và thông số tối ưu */}
        <TabsContent value="basic">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Chọn loại cây trồng</label>
              <Select value={selectedCrop} onValueChange={handleCropSelect}>
                <SelectTrigger className="w-full bg-black/30 border-white/10 text-white focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Chọn loại cây trồng" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10 text-white max-h-60">
                  {crops.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCrop && (
              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-3">
                  Thông số đất và khí hậu tối ưu cho {selectedCrop}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">
                      Nitrogen: <span className="text-green-300">{params.nitrogen}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Phosphorus: <span className="text-green-300">{params.phosphorus}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Potassium: <span className="text-green-300">{params.potassium}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      pH: <span className="text-green-300">{params.ph}</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">
                      Nhiệt độ: <span className="text-green-300">{params.temperature}°C</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Độ ẩm: <span className="text-green-300">{params.humidity}%</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Lượng mưa: <span className="text-green-300">{params.rainfall} mm</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab Nâng cao: Hiển thị cả phần điều chỉnh thông số và kết quả đề xuất */}
        <TabsContent value="advanced">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-black/30 border-white/10 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-4">
                        <Leaf className="h-5 w-5 text-green-400 mr-2" />
                        <h3 className="font-medium text-white">Thông số đất</h3>
                      </div>
                      <div className="space-y-4">
                        <ParameterInput
                          label="Hàm lượng Nitrogen (N)"
                          value={params.nitrogen}
                          min={0}
                          max={140}
                          onChange={(value) => updateParam("nitrogen", value)}
                          onIncrement={() => increment("nitrogen")}
                          onDecrement={() => decrement("nitrogen")}
                          displayValue={formatValue(params.nitrogen)}
                          optimal={params.nitrogen}
                          formatValue={formatValue} // Truyền formatValue
                        />

                        <ParameterInput
                          label="Hàm lượng Phosphorus (P)"
                          value={params.phosphorus}
                          min={0}
                          max={140}
                          onChange={(value) => updateParam("phosphorus", value)}
                          onIncrement={() => increment("phosphorus")}
                          onDecrement={() => decrement("phosphorus")}
                          displayValue={formatValue(params.phosphorus)}
                          optimal={params.phosphorus}
                          formatValue={formatValue} // Truyền formatValue
                        />

                        <ParameterInput
                          label="Hàm lượng Potassium (K)"
                          value={params.potassium}
                          min={0}
                          max={200}
                          onChange={(value) => updateParam("potassium", value)}
                          onIncrement={() => increment("potassium")}
                          onDecrement={() => decrement("potassium")}
                          displayValue={formatValue(params.potassium)}
                          optimal={params.potassium}
                          formatValue={formatValue} // Truyền formatValue
                        />

                        <ParameterInput
                          label="Độ pH của đất"
                          value={params.ph}
                          min={0}
                          max={14}
                          step={0.1}
                          onChange={(value) => updateParam("ph", value)}
                          onIncrement={() => increment("ph")}
                          onDecrement={() => decrement("ph")}
                          displayValue={formatValue(params.ph)}
                          optimal={params.ph}
                          formatValue={formatValue} // Truyền formatValue
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/30 border-white/10 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-4">
                        <Thermometer className="h-5 w-5 text-green-400 mr-2" />
                        <h3 className="font-medium text-white">Thông số khí hậu</h3>
                      </div>
                      <div className="space-y-4">
                        <ParameterInput
                          label="Nhiệt độ (°C)"
                          value={params.temperature}
                          min={0}
                          max={40}
                          step={0.1}
                          onChange={(value) => updateParam("temperature", value)}
                          onIncrement={() => increment("temperature")}
                          onDecrement={() => decrement("temperature")}
                          displayValue={formatValue(params.temperature)}
                          optimal={params.temperature}
                          formatValue={formatValue} // Truyền formatValue
                        />

                        <ParameterInput
                          label="Độ ẩm (%)"
                          value={params.humidity}
                          min={0}
                          max={100}
                          step={0.1}
                          onChange={(value) => updateParam("humidity", value)}
                          onIncrement={() => increment("humidity")}
                          onDecrement={() => decrement("humidity")}
                          displayValue={formatValue(params.humidity)}
                          optimal={params.humidity}
                          formatValue={formatValue} // Truyền formatValue
                        />

                        <ParameterInput
                          label="Lượng mưa (mm)"
                          value={params.rainfall}
                          min={0}
                          max={300}
                          step={0.1}
                          onChange={(value) => updateParam("rainfall", value)}
                          onIncrement={() => increment("rainfall")}
                          onDecrement={() => decrement("rainfall")}
                          displayValue={formatValue(params.rainfall)}
                          optimal={params.rainfall}
                          formatValue={formatValue} // Truyền formatValue
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-4 flex justify-center">
                  <Button
                    onClick={() => handleSuggest()}
                    disabled={isLoading || !selectedCrop}
                    className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white border-none shadow-lg px-8 py-6 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang phân tích...
                      </>
                    ) : (
                      "Đề xuất cải thiện đất"
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-black/30 border-white/10 shadow-lg h-full">
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <Loader2 className="h-16 w-16 text-green-400 mb-4 animate-spin" />
                      <h3 className="text-xl font-medium text-white mb-2">Đang phân tích...</h3>
                      <p className="text-gray-300">Vui lòng đợi trong giây lát</p>
                    </div>
                  ) : !showResults ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <Sprout className="h-16 w-16 text-green-400 mb-4 opacity-50" />
                      <h3 className="text-xl font-medium text-white mb-2">Đề xuất cải thiện</h3>
                      <p className="text-gray-300">Chọn loại cây trồng để xem đề xuất.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium text-white mb-4">Đề xuất cải thiện đất</h3>

                      <div className="space-y-4">
                        {improvementResult &&
                          improvementResult.suggestions.map((suggestion, index) => (
                            <ImprovementSuggestion
                              key={index}
                              title={suggestion.title}
                              description={suggestion.description}
                              priority={suggestion.priority}
                            />
                          ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/10">
                        <h4 className="font-medium text-white mb-2">Lưu ý</h4>
                        <p className="text-gray-300 text-sm">
                          Các đề xuất dựa trên thông số hiện tại và yêu cầu của loại cây trồng đã chọn. Hãy tham khảo ý kiến
                          chuyên gia nông nghiệp để có kết quả tốt nhất.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ParameterInputProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  onIncrement: () => void
  onDecrement: () => void
  displayValue: string
  optimal?: number
  formatValue: (value: number) => string // Thêm formatValue vào props
}

function ParameterInput({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  onIncrement,
  onDecrement,
  displayValue,
  optimal,
  formatValue, // Nhận formatValue từ props
}: ParameterInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm text-gray-300 font-medium">{label}</label>
        <div className="flex items-center">
          {optimal !== undefined && <span className="text-xs text-gray-400 mr-2">Tối ưu: {formatValue(optimal)}</span>}
          <span className="text-sm text-green-300 font-medium">{displayValue}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onDecrement}
          className="bg-black/30 border-white/10 text-white hover:bg-black/50 h-8 w-8 rounded-md flex items-center justify-center"
        >
          <Minus className="h-3 w-3" />
          <span className="sr-only">Giảm</span>
        </Button>

        <div className="flex-1">
          <Slider
            value={[value]}
            min={min}
            max={max}
            step={step}
            onValueChange={(values) => onChange(values[0])}
            className="py-1"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onIncrement}
          className="bg-black/30 border-white/10 text-white hover:bg-black/50 h-8 w-8 rounded-md flex items-center justify-center"
        >
          <Plus className="h-3 w-3" />
          <span className="sr-only">Tăng</span>
        </Button>

        <Input
          type="number"
          value={displayValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 h-8 bg-black/30 border-white/10 text-white text-center"
        />
      </div>
      {optimal !== undefined && (
        <div className="relative w-full h-1">
          <div
            className="absolute h-3 w-3 rounded-full bg-green-500 top-0 transform -translate-y-1/2"
            style={{ left: `${((optimal - min) / (max - min)) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}

interface ImprovementSuggestionProps {
  title: string
  description: string
  priority: "Cao" | "Trung bình" | "Thấp"
}

function ImprovementSuggestion({ title, description, priority }: ImprovementSuggestionProps) {
  const priorityColor = priority === "Cao" ? "bg-red-500" : priority === "Trung bình" ? "bg-yellow-500" : "bg-green-500"

  return (
    <div className="bg-black/20 rounded-lg p-4 border border-white/10 transition-all hover:border-green-500/50 hover:bg-black/30">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-white">{title}</h4>
        <span className={`text-sm text-white px-2 py-1 rounded-full ${priorityColor}`}>{priority}</span>
      </div>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  )
}