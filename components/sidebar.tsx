"use client"

import { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Sidebar() {
  const [selectedFunction, setSelectedFunction] = useState("crop-suggestion")
  const [mode, setMode] = useState("basic")

  // Lưu giá trị vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("activeFunction", selectedFunction)
    // Kích hoạt sự kiện storage để MainContent có thể lắng nghe
    window.dispatchEvent(new Event("storage"))
  }, [selectedFunction])

  return (
    <div className="w-64 bg-[#14151a] border-r border-gray-800 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#1c1d24]">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Quay lại</span>
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-400 font-medium">Chọn chức năng</p>
          <Select value={selectedFunction} onValueChange={setSelectedFunction}>
            <SelectTrigger className="w-full bg-[#1c1d24] border-gray-800 text-white focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Chọn chức năng" />
            </SelectTrigger>
            <SelectContent className="bg-[#1c1d24] border-gray-800 text-white">
              <SelectItem value="crop-suggestion">Gợi ý cây trồng</SelectItem>
              <SelectItem value="soil-improvement">Đề xuất cải thiện đất</SelectItem>
              <SelectItem value="disease-detection">Phát hiện bệnh</SelectItem>
              <SelectItem value="yield-prediction">Dự đoán năng suất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400 font-medium">Chọn chế độ</p>
          <RadioGroup value={mode} onValueChange={setMode} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="basic" id="basic" className="text-purple-500 border-gray-600" />
              <Label htmlFor="basic" className="text-gray-300 cursor-pointer">
                Cơ bản
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" className="text-purple-500 border-gray-600" />
              <Label htmlFor="advanced" className="text-gray-300 cursor-pointer">
                Nâng cao
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}

