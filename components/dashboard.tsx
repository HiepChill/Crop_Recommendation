"use client"

import { useState } from "react"
import { CropSuggestion } from "@/components/crop-suggestion"
import { SoilImprovement } from "@/components/soil-improvement"
import { Header } from "@/components/header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Leaf, Sprout, Bug, BarChart3 } from "lucide-react"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("crop-suggestion")

  return (
    <div className="min-h-screen bg-crop-pattern bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-gradient-to-br from-black/60 via-green-900/30 to-black/60">
        <div className="container mx-auto px-4 py-6">
          <Header />

          <div className="mt-8">
            <Tabs defaultValue="crop-suggestion" onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-black/40 p-1 rounded-xl">
                  <TabsTrigger
                    value="crop-suggestion"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg px-4 py-2"
                  >
                    <Leaf className="h-4 w-4" />
                    <span className="hidden md:inline">Gợi ý cây trồng</span>
                    <span className="md:hidden">Gợi ý</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="soil-improvement"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg px-4 py-2"
                  >
                    <Sprout className="h-4 w-4" />
                    <span className="hidden md:inline">Cải thiện đất</span>
                    <span className="md:hidden">Cải thiện</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="disease-detection"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg px-4 py-2"
                  >
                    <Bug className="h-4 w-4" />
                    <span className="hidden md:inline">Phát hiện bệnh</span>
                    <span className="md:hidden">Bệnh</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="yield-prediction"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg px-4 py-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden md:inline">Dự đoán năng suất</span>
                    <span className="md:hidden">Năng suất</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="glass-card rounded-2xl p-6 shadow-xl">
                <TabsContent value="crop-suggestion" className="mt-0">
                  <CropSuggestion />
                </TabsContent>
                <TabsContent value="soil-improvement" className="mt-0">
                  <SoilImprovement />
                </TabsContent>
                <TabsContent value="disease-detection" className="mt-0">
                  <div className="text-center py-12">
                    <Bug className="h-16 w-16 mx-auto text-green-400 mb-4 opacity-50" />
                    <h3 className="text-xl font-medium text-white mb-2">Tính năng đang phát triển</h3>
                    <p className="text-gray-300">Chức năng phát hiện bệnh sẽ sớm được ra mắt.</p>
                  </div>
                </TabsContent>
                <TabsContent value="yield-prediction" className="mt-0">
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 mx-auto text-green-400 mb-4 opacity-50" />
                    <h3 className="text-xl font-medium text-white mb-2">Tính năng đang phát triển</h3>
                    <p className="text-gray-300">Chức năng dự đoán năng suất sẽ sớm được ra mắt.</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

