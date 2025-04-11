import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TreesIcon as Plant, Award, ThumbsUp, AlertCircle } from "lucide-react"

interface ResultsPanelProps {
  results: {
    cropName: string
    confidence: number
    alternatives: Array<{ name: string; confidence: number }>
  } | null
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-emerald-500/20 shadow-xl h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Plant className="mr-2 h-5 w-5 text-emerald-400" />
          Kết quả dự đoán
        </h2>

        {!results ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertCircle className="h-12 w-12 text-emerald-400 mb-4 opacity-50" />
            <p className="text-emerald-200 mb-2">Chưa có kết quả dự đoán</p>
            <p className="text-emerald-300 text-sm">Nhập các thông số và nhấn nút "Dự đoán cây trồng" để xem kết quả</p>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            <div className="bg-emerald-800/30 rounded-lg p-4 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-400 mr-2" />
                  <h3 className="font-bold text-white">Cây trồng phù hợp nhất</h3>
                </div>
                <span className="text-emerald-300 text-sm font-medium">{results.confidence}% phù hợp</span>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-bold text-white">{results.cropName}</h4>
                <Progress value={results.confidence} className="w-24 h-2" />
              </div>
            </div>

            <div>
              <div className="flex items-center mb-3">
                <ThumbsUp className="h-4 w-4 text-emerald-400 mr-2" />
                <h3 className="font-medium text-emerald-200">Các lựa chọn thay thế</h3>
              </div>

              <div className="space-y-3">
                {results.alternatives.map((alt, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-emerald-800/20 p-3 rounded-md border border-emerald-600/20"
                  >
                    <span className="text-white font-medium">{alt.name}</span>
                    <div className="flex items-center">
                      <span className="text-emerald-300 text-sm mr-2">{alt.confidence}%</span>
                      <Progress value={alt.confidence} className="w-16 h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-800/30 rounded-lg p-4 border border-emerald-500/30">
              <h3 className="font-medium text-emerald-200 mb-2">Thông tin thêm</h3>
              <p className="text-sm text-emerald-100">
                {results.cropName} phù hợp với điều kiện môi trường bạn đã nhập. Cây này có khả năng sinh trưởng tốt và
                cho năng suất cao trong điều kiện này.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

