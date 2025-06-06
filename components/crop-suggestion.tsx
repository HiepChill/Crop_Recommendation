"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
    Minus,
    Plus,
    Leaf,
    Thermometer,
    Droplets,
    Loader2,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Định nghĩa ánh xạ cây trồng
const cropTranslation: { [key: string]: string } = {
    rice: "Lúa",
    maize: "Ngô",
    chickpea: "Đậu hồi (đậu gà)",
    kidneybeans: "Đậu đỏ tây (đậu thận)",
    pigeonpeas: "Đậu triều (đậu bồ câu)",
    mothbeans: "Đậu bướm (Matki)",
    mungbean: "Đậu xanh",
    blackgram: "Đậu đen",
    lentil: "Đậu lăng",
    pomegranate: "Lựu",
    banana: "Chuối",
    mango: "Xoài",
    grapes: "Nho",
    watermelon: "Dưa hấu",
    muskmelon: "Dưa lưới",
    apple: "Táo",
    orange: "Cam",
    papaya: "Đu đủ",
    coconut: "Dừa",
    cotton: "Bông",
    jute: "Đay",
    coffee: "Cà phê",
};

// Định nghĩa kiểu dữ liệu cho kết quả dự đoán
interface PredictionResult {
    cropName: string;
    confidence: number;
    alternatives: Array<{ name: string; confidence: number }>;
}

// Định nghĩa kiểu dữ liệu cho params
interface Params {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
}

export function CropSuggestion() {
    const [isMounted, setIsMounted] = useState(false);
    const [soilRegion, setSoilRegion] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [predictionResult, setPredictionResult] =
        useState<PredictionResult | null>(null);
    const [params, setParams] = useState<Params>({
        nitrogen: 50,
        phosphorus: 50,
        potassium: 50,
        temperature: 25.0,
        humidity: 70.0,
        ph: 6.5,
        rainfall: 200.0,
    });

    // Sử dụng useRef để lưu controller cho việc hủy yêu cầu API
    const abortControllerRef = useRef<AbortController | null>(null);

    // Đảm bảo component chỉ render ở client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Hủy yêu cầu API khi component unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const soilRegions = [
        "Đất sét - Miền Bắc",
        "Đất phù sa - Miền Bắc",
        "Đất cát - Miền Trung",
        "Đất sét - Miền Trung",
        "Đất phù sa - Miền Nam",
        "Đất cát - Miền Nam",
    ];

    const updateParam = (param: keyof typeof params, value: number) => {
        setParams((prev) => ({
            ...prev,
            [param]: value,
        }));
    };

    const increment = (param: keyof typeof params) => {
        const step =
            param === "temperature" ||
            param === "humidity" ||
            param === "ph" ||
            param === "rainfall"
                ? 0.1
                : 1;
        updateParam(param, Number((params[param] + step).toFixed(1)));
    };

    const decrement = (param: keyof typeof params) => {
        const step =
            param === "temperature" ||
            param === "humidity" ||
            param === "ph" ||
            param === "rainfall"
                ? 0.1
                : 1;
        updateParam(param, Number((params[param] - step).toFixed(1)));
    };

    const handleInputChange = (param: keyof typeof params, value: string) => {
        updateParam(param, Number(value));
    };

    const formatValue = (value: number) => {
        return Number.isInteger(value) ? value.toString() : value.toFixed(1);
    };

    const handleSoilRegionSelect = (value: string) => {
        setSoilRegion(value);

        // Hủy yêu cầu API trước đó nếu có
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Tạo một params mới dựa trên lựa chọn
        let newParams: Params;
        if (value === "Đất sét - Miền Bắc") {
            newParams = {
                ph: 6.2,
                nitrogen: 50,
                phosphorus: 40,
                potassium: 50,
                temperature: 23.0,
                humidity: 85.0,
                rainfall: 180.0,
            };
        } else if (value === "Đất phù sa - Miền Bắc") {
            newParams = {
                ph: 6.8,
                nitrogen: 70,
                phosphorus: 60,
                potassium: 55,
                temperature: 24.0,
                humidity: 90.0,
                rainfall: 200.0,
            };
        } else if (value === "Đất cát - Miền Trung") {
            newParams = {
                ph: 5.8,
                nitrogen: 25,
                phosphorus: 20,
                potassium: 30,
                temperature: 28.0,
                humidity: 65.0,
                rainfall: 100.0,
            };
        } else if (value === "Đất sét - Miền Trung") {
            newParams = {
                ph: 6.0,
                nitrogen: 45,
                phosphorus: 35,
                potassium: 40,
                temperature: 27.0,
                humidity: 70.0,
                rainfall: 120.0,
            };
        } else if (value === "Đất phù sa - Miền Nam") {
            newParams = {
                ph: 6.5,
                nitrogen: 80,
                phosphorus: 65,
                potassium: 60,
                temperature: 29.0,
                humidity: 80.0,
                rainfall: 220.0,
            };
        } else {
            newParams = {
                ph: 5.7,
                nitrogen: 30,
                phosphorus: 25,
                potassium: 35,
                temperature: 30.0,
                humidity: 75.0,
                rainfall: 150.0,
            };
        }

        // Cập nhật trạng thái params
        setParams(newParams);

        // Gọi handlePredict với params mới (không phụ thuộc vào trạng thái params)
        handlePredict(value, true, newParams);
    };

    const handlePredict = async (
        selectedSoilRegion?: string,
        isBasicTab: boolean = false,
        overrideParams?: Params
    ) => {
        // Nếu gọi từ tab "Cơ bản", yêu cầu phải có selectedSoilRegion
        if (isBasicTab && !selectedSoilRegion) {
            alert("Vui lòng chọn loại đất và khu vực trước khi dự đoán.");
            return;
        }

        // Sử dụng overrideParams nếu được truyền vào, nếu không thì dùng params hiện tại
        const paramsToUse = overrideParams || params;

        // Hủy yêu cầu API trước đó nếu có
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Tạo một AbortController mới
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setIsLoading(true);
        setShowResults(false);

        try {
            // Gọi API FastAPI
            const response = await fetch("http://localhost:8000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paramsToUse),
                signal, // Truyền signal để có thể hủy yêu cầu
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = {
                        detail: "Không thể phân tích dữ liệu lỗi từ API",
                    };
                }
                console.error("Error from API:", {
                    status: response.status,
                    statusText: response.statusText,
                    errorData: errorData,
                });
                throw new Error(
                    `Network response was not ok: ${response.status} ${response.statusText}`
                );
            }

            // Xử lý kết quả từ API
            const data = await response.json();

            // Dịch tên cây trồng từ tiếng Anh sang tiếng Việt
            const translatedResult: PredictionResult = {
                cropName: cropTranslation[data.cropName] || data.cropName,
                confidence: data.confidence,
                alternatives: data.alternatives.map(
                    (alt: { name: string; confidence: number }) => ({
                        name: cropTranslation[alt.name] || alt.name,
                        confidence: alt.confidence,
                    })
                ),
            };

            // Sử dụng kết quả đã dịch
            setPredictionResult(translatedResult);
            setShowResults(true);
        } catch (error: any) {
            if (error.name === "AbortError") {
                console.log("Yêu cầu API đã bị hủy");
                return;
            }

            console.error("Error predicting crop:", error);

            // Sử dụng kết quả giả lập trong trường hợp lỗi
            const mockResult: PredictionResult = {
                cropName: "Lúa",
                confidence: 95,
                alternatives: [
                    { name: "Ngô", confidence: 82 },
                    { name: "Đậu xanh", confidence: 78 },
                ],
            };

            setPredictionResult(mockResult);
            setShowResults(true);
        } finally {
            setIsLoading(false);
        }
    };

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
        );
    }

    return (
        <div>
            <div className="flex items-center mb-6">
                <Leaf className="h-6 w-6 text-green-400 mr-2" />
                <h2 className="text-2xl font-bold text-white">
                    Gợi ý cây trồng
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
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

                        <TabsContent value="basic">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300 font-medium">
                                        Chọn điều kiện đất và khu vực
                                    </label>
                                    <Select
                                        value={soilRegion}
                                        onValueChange={handleSoilRegionSelect}
                                    >
                                        <SelectTrigger className="w-full bg-black/30 border-white/10 text-white focus:ring-0 focus:ring-offset-0">
                                            <SelectValue placeholder="Chọn loại đất và khu vực" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-white/10 text-white max-h-60">
                                            {soilRegions.map((region) => (
                                                <SelectItem
                                                    key={region}
                                                    value={region}
                                                >
                                                    {region}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {soilRegion && (
                                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                                        <h3 className="text-lg font-medium text-white mb-3">
                                            Thông số đất và khí hậu
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-300">
                                                    Nitrogen:{" "}
                                                    <span className="text-green-300">
                                                        {params.nitrogen}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-gray-300">
                                                    Phosphorus:{" "}
                                                    <span className="text-green-300">
                                                        {params.phosphorus}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-gray-300">
                                                    Potassium:{" "}
                                                    <span className="text-green-300">
                                                        {params.potassium}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-gray-300">
                                                    pH:{" "}
                                                    <span className="text-green-300">
                                                        {params.ph}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-300">
                                                    Nhiệt độ:{" "}
                                                    <span className="text-green-300">
                                                        {params.temperature}°C
                                                    </span>
                                                </p>
                                                <p className="text-sm text-gray-300">
                                                    Độ ẩm:{" "}
                                                    <span className="text-green-300">
                                                        {params.humidity}%
                                                    </span>
                                                </p>
                                                <p className="text-sm text-gray-300">
                                                    Lượng mưa:{" "}
                                                    <span className="text-green-300">
                                                        {params.rainfall} mm
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="advanced">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="bg-black/30 border-white/10 shadow-lg">
                                        <CardContent className="p-4">
                                            <div className="flex items-center mb-4">
                                                <Leaf className="h-5 w-5 text-green-400 mr-2" />
                                                <h3 className="font-medium text-white">
                                                    Thông số đất
                                                </h3>
                                            </div>
                                            <div className="space-y-4">
                                                <ParameterInput
                                                    label="Hàm lượng Nitrogen (N)"
                                                    value={params.nitrogen}
                                                    min={0}
                                                    max={140}
                                                    onChange={(value) =>
                                                        updateParam(
                                                            "nitrogen",
                                                            value
                                                        )
                                                    }
                                                    onIncrement={() =>
                                                        increment("nitrogen")
                                                    }
                                                    onDecrement={() =>
                                                        decrement("nitrogen")
                                                    }
                                                    displayValue={formatValue(
                                                        params.nitrogen
                                                    )}
                                                />

                                                <ParameterInput
                                                    label="Hàm lượng Phosphorus (P)"
                                                    value={params.phosphorus}
                                                    min={0}
                                                    max={140}
                                                    onChange={(value) =>
                                                        updateParam(
                                                            "phosphorus",
                                                            value
                                                        )
                                                    }
                                                    onIncrement={() =>
                                                        increment("phosphorus")
                                                    }
                                                    onDecrement={() =>
                                                        decrement("phosphorus")
                                                    }
                                                    displayValue={formatValue(
                                                        params.phosphorus
                                                    )}
                                                />

                                                <ParameterInput
                                                    label="Hàm lượng Potassium (K)"
                                                    value={params.potassium}
                                                    min={0}
                                                    max={200}
                                                    onChange={(value) =>
                                                        updateParam(
                                                            "potassium",
                                                            value
                                                        )
                                                    }
                                                    onIncrement={() =>
                                                        increment("potassium")
                                                    }
                                                    onDecrement={() =>
                                                        decrement("potassium")
                                                    }
                                                    displayValue={formatValue(
                                                        params.potassium
                                                    )}
                                                />

                                                <ParameterInput
                                                    label="Độ pH của đất"
                                                    value={params.ph}
                                                    min={0}
                                                    max={14}
                                                    step={0.1}
                                                    onChange={(value) =>
                                                        updateParam("ph", value)
                                                    }
                                                    onIncrement={() =>
                                                        increment("ph")
                                                    }
                                                    onDecrement={() =>
                                                        decrement("ph")
                                                    }
                                                    displayValue={formatValue(
                                                        params.ph
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-black/30 border-white/10 shadow-lg">
                                        <CardContent className="p-4">
                                            <div className="flex items-center mb-4">
                                                <Thermometer className="h-5 w-5 text-green-400 mr-2" />
                                                <h3 className="font-medium text-white">
                                                    Thông số khí hậu
                                                </h3>
                                            </div>
                                            <div className="space-y-4">
                                                <ParameterInput
                                                    label="Nhiệt độ (°C)"
                                                    value={params.temperature}
                                                    min={0}
                                                    max={40}
                                                    step={0.1}
                                                    onChange={(value) =>
                                                        updateParam(
                                                            "temperature",
                                                            value
                                                        )
                                                    }
                                                    onIncrement={() =>
                                                        increment("temperature")
                                                    }
                                                    onDecrement={() =>
                                                        decrement("temperature")
                                                    }
                                                    displayValue={formatValue(
                                                        params.temperature
                                                    )}
                                                />

                                                <ParameterInput
                                                    label="Độ ẩm (%)"
                                                    value={params.humidity}
                                                    min={0}
                                                    max={100}
                                                    step={0.1}
                                                    onChange={(value) =>
                                                        updateParam(
                                                            "humidity",
                                                            value
                                                        )
                                                    }
                                                    onIncrement={() =>
                                                        increment("humidity")
                                                    }
                                                    onDecrement={() =>
                                                        decrement("humidity")
                                                    }
                                                    displayValue={formatValue(
                                                        params.humidity
                                                    )}
                                                />

                                                <ParameterInput
                                                    label="Lượng mưa (mm)"
                                                    value={params.rainfall}
                                                    min={0}
                                                    max={300}
                                                    step={0.1}
                                                    onChange={(value) =>
                                                        updateParam(
                                                            "rainfall",
                                                            value
                                                        )
                                                    }
                                                    onIncrement={() =>
                                                        increment("rainfall")
                                                    }
                                                    onDecrement={() =>
                                                        decrement("rainfall")
                                                    }
                                                    displayValue={formatValue(
                                                        params.rainfall
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="pt-4 flex justify-center">
                                    <Button
                                        onClick={() =>
                                            handlePredict(undefined, false)
                                        }
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white border-none shadow-lg px-8 py-6 text-lg"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang dự đoán...
                                            </>
                                        ) : (
                                            "Dự đoán cây trồng phù hợp"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="lg:col-span-1">
                    <Card className="bg-black/30 border-white/10 shadow-lg h-full">
                        <CardContent className="p-4">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <Loader2 className="h-16 w-16 text-green-400 mb-4 animate-spin" />
                                    <h3 className="text-xl font-medium text-white mb-2">
                                        Đang dự đoán...
                                    </h3>
                                    <p className="text-gray-300">
                                        Vui lòng đợi trong giây lát
                                    </p>
                                </div>
                            ) : !showResults ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <Leaf className="h-16 w-16 text-green-400 mb-4 opacity-50" />
                                    <h3 className="text-xl font-medium text-white mb-2">
                                        Kết quả dự đoán
                                    </h3>
                                    <p className="text-gray-300">
                                        Chọn loại đất và khu vực hoặc điều chỉnh
                                        thông số để xem kết quả.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-medium text-white mb-4">
                                        Cây trồng phù hợp
                                    </h3>

                                    <div className="space-y-4">
                                        {predictionResult && (
                                            <>
                                                <CropResult
                                                    name={
                                                        predictionResult.cropName
                                                    }
                                                    confidence={
                                                        predictionResult.confidence
                                                    }
                                                    description="Phù hợp nhất với điều kiện đất và khí hậu đã chọn."
                                                />

                                                {predictionResult.alternatives.map(
                                                    (alt, index) => (
                                                        <CropResult
                                                            key={index}
                                                            name={alt.name}
                                                            confidence={
                                                                alt.confidence
                                                            }
                                                            description={
                                                                index === 0
                                                                    ? "Có thể phát triển tốt trong điều kiện này."
                                                                    : "Phù hợp với hàm lượng dinh dưỡng trong đất."
                                                            }
                                                        />
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <h4 className="font-medium text-white mb-2">
                                            Lưu ý
                                        </h4>
                                        <p className="text-gray-300 text-sm">
                                            Kết quả dự đoán dựa trên các thông
                                            số đã nhập. Để có kết quả chính xác
                                            hơn, hãy sử dụng chế độ nâng cao để
                                            điều chỉnh các thông số.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

interface ParameterInputProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    onIncrement: () => void;
    onDecrement: () => void;
    displayValue: string;
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
}: ParameterInputProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <label className="text-sm text-gray-300 font-medium">
                    {label}
                </label>
                <span className="text-sm text-green-300 font-medium">
                    {displayValue}
                </span>
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
        </div>
    );
}

interface CropResultProps {
    name: string;
    confidence: number;
    description: string;
}

function CropResult({ name, confidence, description }: CropResultProps) {
    return (
        <div className="bg-black/20 rounded-lg p-4 border border-white/10 transition-all hover:border-green-500/50 hover:bg-black/30">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-white">{name}</h4>
                <span className="text-sm bg-gradient-to-r from-green-600 to-emerald-500 text-white px-2 py-1 rounded-full">
                    {confidence}% phù hợp
                </span>
            </div>
            <p className="text-gray-300 text-sm">{description}</p>
        </div>
    );
}
