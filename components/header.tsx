import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function Header() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 glass-card rounded-2xl p-6 shadow-xl">
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-3 rounded-xl mr-4 shadow-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">CropHelper</h1>
          <p className="text-gray-300">Hệ thống khuyến nghị cải thiện chất lượng mùa vụ</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white border-none shadow-lg">
          Tìm hiểu thêm
        </Button>
      </div>
    </header>
  )
}

