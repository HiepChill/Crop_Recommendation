from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pandas as pd
import joblib
import os
import sys

# Thêm thư mục hiện tại vào sys.path để import các module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import các module từ các file Python đã cung cấp
from crop_knn_prepocessing import preprocess_data
from translate_crops import translate_crops, reverse_translation
from crop_requirements import calculate_crop_requirements

# Khởi tạo FastAPI app
app = FastAPI(title="CropHelper API", description="API cho ứng dụng CropHelper")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả các origin trong môi trường phát triển
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đường dẫn file dữ liệu
file_path = "crop_recommendation.csv"

# Tiền xử lý dữ liệu và huấn luyện mô hình nếu chưa có
try:
    knn = joblib.load("knn_model.pkl")
    scaler = joblib.load("scaler.pkl")
except:
    X_train, X_test, y_train, y_test, scaler = preprocess_data(file_path)
    k = 5
    from sklearn.neighbors import KNeighborsClassifier
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    joblib.dump(knn, "knn_model.pkl")
    joblib.dump(scaler, "scaler.pkl")

# Tính toán yêu cầu cho từng loại cây trồng
crop_requirements = calculate_crop_requirements()

# Định nghĩa model cho dữ liệu đầu vào
class PredictionInput(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class ImprovementInput(BaseModel):
    crop: str
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

# Endpoint dự đoán cây trồng
@app.post("/predict")
async def predict_crop(input_data: PredictionInput):
    try:
        # Chuyển đổi dữ liệu đầu vào thành DataFrame
        input_df = pd.DataFrame([[
            input_data.nitrogen,
            input_data.phosphorus,
            input_data.potassium,
            input_data.temperature,
            input_data.humidity,
            input_data.ph,
            input_data.rainfall
        ]], columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
        
        # Chuẩn hóa dữ liệu
        input_scaled = scaler.transform(input_df)
        
        # Dự đoán xác suất
        probabilities = knn.predict_proba(input_scaled)[0]
        
        # Lấy top 3 cây trồng có xác suất cao nhất
        top_3_indices = np.argsort(probabilities)[-3:][::-1]
        top_3_crops = [knn.classes_[i] for i in top_3_indices]
        top_3_probs = [int(probabilities[i] * 100) for i in top_3_indices]
        
        # Dịch tên cây trồng sang tiếng Việt
        top_3_crops_vi = translate_crops(top_3_crops)
        
        # Tạo kết quả trả về
        result = {
            "cropName": top_3_crops_vi[0],
            "confidence": top_3_probs[0],
            "alternatives": [
                {"name": top_3_crops_vi[1], "confidence": top_3_probs[1]},
                {"name": top_3_crops_vi[2], "confidence": top_3_probs[2]}
            ]
        }
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi dự đoán: {str(e)}")

# Endpoint đề xuất cải thiện đất
@app.post("/suggest-improvement")
async def suggest_improvement(input_data: ImprovementInput):
    try:
        # print(f"Received input: {input_data.dict()}")

        # Lấy tên cây trồng tiếng Anh từ tên tiếng Việt
        crop_key = reverse_translation.get(input_data.crop)

        # print(f"Translated crop: {input_data.crop} -> {crop_key}")
        
        if not crop_key or crop_key not in crop_requirements:
            # print(f"Crop not found: {input_data.crop}")
            raise HTTPException(status_code=404, detail=f"Không tìm thấy thông tin về cây trồng: {input_data.crop}")
        
        # Lấy yêu cầu của cây trồng
        req = crop_requirements[crop_key]
        # print(f"Crop requirements for {crop_key}: {req}")
        
        # Tạo danh sách đề xuất
        suggestions = []
        
        # Kiểm tra và đề xuất cải thiện cho từng thông số
        if input_data.nitrogen < req['N'][0]:
            suggestions.append({
                "title": "Bón phân đạm",
                "description": f"Tăng hàm lượng Nitrogen lên ít nhất {req['N'][0]} (hiện tại: {input_data.nitrogen})",
                "priority": "Cao"
            })
        elif input_data.nitrogen > req['N'][1]:
            suggestions.append({
                "title": "Giảm phân đạm",
                "description": f"Giảm hàm lượng Nitrogen xuống dưới {req['N'][1]} (hiện tại: {input_data.nitrogen})",
                "priority": "Cao"
            })
            
        if input_data.phosphorus < req['P'][0]:
            suggestions.append({
                "title": "Bón phân lân",
                "description": f"Tăng hàm lượng Phosphorus lên ít nhất {req['P'][0]} (hiện tại: {input_data.phosphorus})",
                "priority": "Trung bình"
            })
        elif input_data.phosphorus > req['P'][1]:
            suggestions.append({
                "title": "Giảm phân lân",
                "description": f"Giảm hàm lượng Phosphorus xuống dưới {req['P'][1]} (hiện tại: {input_data.phosphorus})",
                "priority": "Trung bình"
            })
            
        if input_data.potassium < req['K'][0]:
            suggestions.append({
                "title": "Bón phân kali",
                "description": f"Tăng hàm lượng Potassium lên ít nhất {req['K'][0]} (hiện tại: {input_data.potassium})",
                "priority": "Cao"
            })
        elif input_data.potassium > req['K'][1]:
            suggestions.append({
                "title": "Giảm phân kali",
                "description": f"Giảm hàm lượng Potassium xuống dưới {req['K'][1]} (hiện tại: {input_data.potassium})",
                "priority": "Cao"
            })
            
        if input_data.ph < req['ph'][0]:
            suggestions.append({
                "title": "Điều chỉnh độ pH",
                "description": f"Tăng độ pH lên ít nhất {req['ph'][0]} (hiện tại: {input_data.ph}). Có thể sử dụng vôi nông nghiệp.",
                "priority": "Trung bình"
            })
        elif input_data.ph > req['ph'][1]:
            suggestions.append({
                "title": "Điều chỉnh độ pH",
                "description": f"Giảm độ pH xuống dưới {req['ph'][1]} (hiện tại: {input_data.ph}). Có thể sử dụng phân hữu cơ hoặc lưu huỳnh.",
                "priority": "Trung bình"
            })
            
        if input_data.humidity < req['humid'][0]:
            suggestions.append({
                "title": "Tăng độ ẩm",
                "description": f"Tăng độ ẩm lên ít nhất {req['humid'][0]}% (hiện tại: {input_data.humidity}%). Có thể tưới nước thường xuyên hơn.",
                "priority": "Thấp"
            })
        elif input_data.humidity > req['humid'][1]:
            suggestions.append({
                "title": "Giảm độ ẩm",
                "description": f"Giảm độ ẩm xuống dưới {req['humid'][1]}% (hiện tại: {input_data.humidity}%). Cải thiện thoát nước và thông gió.",
                "priority": "Thấp"
            })
            
        if input_data.rainfall < req['rain'][0]:
            suggestions.append({
                "title": "Tưới nước",
                "description": f"Tăng lượng nước tưới để bù đắp lượng mưa thấp (cần ít nhất {req['rain'][0]} mm, hiện tại: {input_data.rainfall} mm)",
                "priority": "Thấp"
            })
        elif input_data.rainfall > req['rain'][1]:
            suggestions.append({
                "title": "Cải thiện thoát nước",
                "description": f"Cải thiện hệ thống thoát nước do lượng mưa cao (tối đa {req['rain'][1]} mm, hiện tại: {input_data.rainfall} mm)",
                "priority": "Thấp"
            })
        
        # Nếu không có đề xuất nào, đất đã phù hợp
        if not suggestions:
            suggestions.append({
                "title": "Đất đã phù hợp",
                "description": f"Các thông số đất hiện tại đã phù hợp để trồng {input_data.crop}",
                "priority": "Thấp"
            })
        
        # print(f"Suggestions: {suggestions}")
        return {"suggestions": suggestions}
    
    except HTTPException:
        raise
    except Exception as e:
        # print(f"Error in suggest_improvement: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi đề xuất cải thiện: {str(e)}")

# Endpoint kiểm tra trạng thái API
@app.get("/")
async def root():
    return {"message": "CropHelper API đang hoạt động", "status": "online"}

# Chạy ứng dụng với Uvicorn nếu file được chạy trực tiếp
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

