"use client"

import { useState, useEffect } from "react"
import { CropSuggestion } from "@/components/crop-suggestion"
import { SoilImprovement } from "@/components/soil-improvement"

export function MainContent() {
  const [activeFunction, setActiveFunction] = useState("crop-suggestion")

  // Lắng nghe sự thay đổi từ localStorage hoặc một event nào đó
  // Đây chỉ là ví dụ, trong ứng dụng thực tế bạn có thể sử dụng context hoặc props
  useEffect(() => {
    const handleStorageChange = () => {
      const storedFunction = localStorage.getItem("activeFunction")
      if (storedFunction) {
        setActiveFunction(storedFunction)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Kiểm tra giá trị ban đầu
    const initialFunction = localStorage.getItem("activeFunction")
    if (initialFunction) {
      setActiveFunction(initialFunction)
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <div className="flex-1 bg-[#0f0f14] overflow-auto">
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">CropHelper</h1>
      </div>

      <div className="p-6">
        {activeFunction === "crop-suggestion" && <CropSuggestion />}
        {activeFunction === "soil-improvement" && <SoilImprovement />}
      </div>
    </div>
  )
}

