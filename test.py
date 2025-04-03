import streamlit as st
import numpy as np
import joblib
from crop_knn_prepocessing import preprocess_data
from sklearn.neighbors import KNeighborsClassifier

# Đường dẫn file dữ liệu
file_path = "crop_recommendation.csv"

# Tiền xử lý dữ liệu
X_train, X_test, y_train, y_test, scaler = preprocess_data(file_path)

# Triển khai mô hình KNN
k = 5
knn = KNeighborsClassifier(n_neighbors=k)
knn.fit(X_train, y_train)

# Lưu mô hình và scaler
joblib.dump(knn, "knn_model.pkl")
joblib.dump(scaler, "scaler.pkl")

# Load mô hình và bộ chuẩn hóa
knn = joblib.load("knn_model.pkl")
scaler = joblib.load("scaler.pkl")

# Giao diện chính
st.title("CropSmart - Hệ thống gợi ý cây trồng")
option = st.sidebar.radio("Chọn tính năng", ["Gợi ý cây trồng", "Đề xuất cải thiện đất"])

if option == "Gợi ý cây trồng":
    tab1, tab2 = st.tabs(["Cơ bản", "Nâng cao"])
    
    with tab1:
        st.header("Gợi ý cây trồng - Cơ bản")
        soil_type = st.selectbox("Chọn loại đất", ["Đất sét", "Đất cát", "Đất phù sa"])
        region = st.selectbox("Chọn khu vực", ["Miền Bắc", "Miền Trung", "Miền Nam"])
        
        crop_suggestions = {
            "Đất sét": {"Miền Bắc": "Lúa", "Miền Trung": "Ngô", "Miền Nam": "Mía"},
            "Đất cát": {"Miền Bắc": "Khoai lang", "Miền Trung": "Đậu phộng", "Miền Nam": "Dưa hấu"},
            "Đất phù sa": {"Miền Bắc": "Cam", "Miền Trung": "Xoài", "Miền Nam": "Sầu riêng"}
        }
        
        if st.button("Xem cây trồng phù hợp"):
            st.success(f"Loại cây trồng phù hợp: {crop_suggestions[soil_type][region]}")
    
    with tab2:
        st.header("Gợi ý cây trồng - Nâng cao")
        st.write("Nhập các thông số môi trường để dự đoán 3 loại cây trồng phù hợp nhất.")

        N = st.number_input("Hàm lượng Nitrogen (N)", min_value=0, max_value=100, value=50)
        P = st.number_input("Hàm lượng Phosphorus (P)", min_value=0, max_value=100, value=50)
        K = st.number_input("Hàm lượng Potassium (K)", min_value=0, max_value=100, value=50)
        temperature = st.number_input("Nhiệt độ (°C)", min_value=0.0, max_value=50.0, value=25.0)
        humidity = st.number_input("Độ ẩm (%)", min_value=0.0, max_value=100.0, value=70.0)
        ph = st.number_input("Độ pH của đất", min_value=0.0, max_value=14.0, value=6.5)
        rainfall = st.number_input("Lượng mưa (mm)", min_value=0.0, max_value=500.0, value=200.0)
        
        if st.button("Dự đoán"):
            input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
            input_scaled = scaler.transform(input_data)
            predictions = knn.kneighbors(input_scaled, n_neighbors=3, return_distance=False)
            top_crops = [y_train[i] for i in predictions[0]]
            st.success(f"Top 3 cây trồng phù hợp: {', '.join(top_crops)}")

elif option == "Đề xuất cải thiện đất":
    st.header("Đề xuất cải thiện đất")
    crop = st.selectbox("Chọn loại cây muốn trồng", ["Lúa", "Ngô", "Khoai lang", "Đậu phộng", "Xoài", "Sầu riêng"])
    
    soil_improvement = {
        "Lúa": "Cần đất có độ ẩm cao, bón thêm phân hữu cơ và cải thiện hệ thống tưới nước.",
        "Ngô": "Tăng hàm lượng NPK trong đất, đảm bảo đất thoát nước tốt.",
        "Khoai lang": "Đất cần tơi xốp, giảm độ ẩm để tránh úng.",
        "Đậu phộng": "Đất cần giàu Kali và thoát nước tốt.",
        "Xoài": "Độ pH cần từ 5.5-7, cần nhiều ánh sáng.",
        "Sầu riêng": "Cải thiện độ ẩm và bổ sung vi lượng dinh dưỡng."
    }
    
    if st.button("Xem gợi ý cải thiện đất"):
        st.success(f"{soil_improvement[crop]}")
