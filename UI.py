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

# Giao diện nhập thông số
st.title("Dự đoán cây trồng phù hợp")
st.write("Nhập các thông số môi trường để dự đoán loại cây trồng phù hợp.")

N = st.number_input("Hàm lượng Nitrogen (N)", min_value=0, max_value=100, value=50)
P = st.number_input("Hàm lượng Phosphorus (P)", min_value=0, max_value=100, value=50)
K = st.number_input("Hàm lượng Potassium (K)", min_value=0, max_value=100, value=50)
temperature = st.number_input("Nhiệt độ (°C)", min_value=0.0, max_value=50.0, value=25.0)
humidity = st.number_input("Độ ẩm (%)", min_value=0.0, max_value=100.0, value=70.0)
ph = st.number_input("Độ pH của đất", min_value=0.0, max_value=14.0, value=6.5)
rainfall = st.number_input("Lượng mưa (mm)", min_value=0.0, max_value=500.0, value=200.0)

# Dự đoán
if st.button("Dự đoán"):
    input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    input_scaled = scaler.transform(input_data)
    prediction = knn.predict(input_scaled)
    st.success(f"Loại cây trồng phù hợp: {prediction[0]}")
