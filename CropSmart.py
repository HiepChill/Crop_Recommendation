import streamlit as st
import numpy as np
import pandas as pd
import joblib
from crop_knn_prepocessing import preprocess_data 
from translate_crops import translate_crops, reverse_translation
from crop_requirements import calculate_crop_requirements
from sklearn.neighbors import KNeighborsClassifier

# Đường dẫn file dữ liệu
file_path = "crop_recommendation.csv"

# Tiền xử lý dữ liệu 
# X_train, X_test, y_train, y_test, scaler, crop_labels = preprocess_data(file_path)
X_train, X_test, y_train, y_test, scaler = preprocess_data(file_path)
k = 5
knn = KNeighborsClassifier(n_neighbors=k)
knn.fit(X_train, y_train)
joblib.dump(knn, "knn_model.pkl")
joblib.dump(scaler, "scaler.pkl")

# Load mô hình và scaler
knn = joblib.load("knn_model.pkl")
scaler = joblib.load("scaler.pkl")

crop_requirements = calculate_crop_requirements()

# Dữ liệu mặc định cho tab Cơ bản (giả định dựa trên Việt Nam)
basic_data = {
    'Đất sét - Miền Bắc': {
        'crops': ['rice', 'maize', 'potato']
    },
    'Đất phù sa - Miền Bắc': {
        'crops': ['rice', 'lentil', 'chickpea']
    },
    'Đất cát - Miền Trung': {
        'crops': ['mungbean', 'cotton', 'peanut']
    },
    'Đất sét - Miền Trung': {
        'crops': ['coffee', 'jute', 'blackgram']
    },
    'Đất phù sa - Miền Nam': {
        'crops': ['rice', 'banana', 'coconut']
    },
    'Đất cát - Miền Nam': {
        'crops': ['watermelon', 'muskmelon', 'mango']
    }
    
}

# Trang chủ
st.title("CropSmart")
menu = st.sidebar.selectbox("Chọn chức năng", ["Gợi ý cây trồng", "Đề xuất cải thiện đất"])

# 1. Trang chủ với 2 lựa chọn
if menu == "Gợi ý cây trồng":
    tab = st.sidebar.radio("Chọn chế độ", ["Cơ bản", "Nâng cao"])

    # 2 & 3. Tab Gợi ý cây trồng - Nâng cao
    if tab == "Nâng cao":
        st.header("Gợi ý cây trồng - Nâng cao")
        st.write("Nhập các thông số môi trường để dự đoán loại cây trồng phù hợp.")

        N = st.number_input("Hàm lượng Nitrogen (N)", min_value=0, max_value=200, value=50)
        P = st.number_input("Hàm lượng Phosphorus (P)", min_value=0, max_value=200, value=50)
        K = st.number_input("Hàm lượng Potassium (K)", min_value=0, max_value=200, value=50)
        temperature = st.number_input("Nhiệt độ (°C)", min_value=0.0, max_value=50.0, value=25.0)
        humidity = st.number_input("Độ ẩm (%)", min_value=0.0, max_value=100.0, value=70.0)
        ph = st.number_input("Độ pH của đất", min_value=0.0, max_value=14.0, value=6.5)
        rainfall = st.number_input("Lượng mưa (mm)", min_value=0.0, max_value=2000.0, value=200.0)

        if st.button("Dự đoán"):
            input_data = pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]], 
                                      columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
            input_scaled = scaler.transform(input_data)
            probabilities = knn.predict_proba(input_scaled)[0]
            top_3_indices = np.argsort(probabilities)[-3:][::-1]  # Lấy top 3
            top_3_crops = [knn.classes_[i] for i in top_3_indices]
            top_3_probs = [probabilities[i] * 100 for i in top_3_indices]

            st.success("Top 3 cây trồng phù hợp:")
            for crop, prob in zip(top_3_crops, top_3_probs):
                st.write(f"- {translate_crops([crop])[0]}: {prob:.2f}%")

    # 4. Tab Gợi ý cây trồng - Cơ bản
    elif tab == "Cơ bản":
        st.header("Gợi ý cây trồng - Cơ bản")
        st.write("Chọn loại đất và khu vực để nhận gợi ý cây trồng.")

        option = st.selectbox("Chọn điều kiện đất và khu vực", list(basic_data.keys()))

        if st.button("Gợi ý"):
            result = basic_data[option]
            st.success("Cây trồng phù hợp:")
            for crop in translate_crops(result['crops']):  # Dịch toàn bộ danh sách
                st.write(f"- {crop}")

# 5. Tab Đề xuất cải thiện đất
elif menu == "Đề xuất cải thiện đất":
    st.header("Đề xuất cải thiện đất")
    st.write("Chọn loại cây và nhập thông số đất hiện tại để nhận đề xuất cải thiện.")

    crop_translated = st.selectbox("Chọn cây trồng", list(reverse_translation.keys()))
    crop_key = reverse_translation[crop_translated]  # Lấy key gốc từ tên đã dịch

    N = st.number_input("Hàm lượng Nitrogen (N)", min_value=0, max_value=200, value=50)
    P = st.number_input("Hàm lượng Phosphorus (P)", min_value=0, max_value=200, value=50)
    K = st.number_input("Hàm lượng Potassium (K)", min_value=0, max_value=200, value=50)
    temperature = st.number_input("Nhiệt độ (°C)", min_value=0.0, max_value=50.0, value=25.0)
    humidity = st.number_input("Độ ẩm (%)", min_value=0.0, max_value=100.0, value=70.0)
    ph = st.number_input("Độ pH của đất", min_value=0.0, max_value=14.0, value=6.5)
    rainfall = st.number_input("Lượng mưa (mm)", min_value=0.0, max_value=2000.0, value=200.0)

    if st.button("Đề xuất"):
        req = crop_requirements[crop_key]
        suggestions = []
        if N < req['N'][0]: suggestions.append(f"Tăng N lên ít nhất {req['N'][0]} (hiện tại: {N})")
        if N > req['N'][1]: suggestions.append(f"Giảm N xuống dưới {req['N'][1]} (hiện tại: {N})")
        if P < req['P'][0]: suggestions.append(f"Tăng P lên ít nhất {req['P'][0]} (hiện tại: {P})")
        if P > req['P'][1]: suggestions.append(f"Giảm P xuống dưới {req['P'][1]} (hiện tại: {P})")
        if K < req['K'][0]: suggestions.append(f"Tăng K lên ít nhất {req['K'][0]} (hiện tại: {K})")
        if K > req['K'][1]: suggestions.append(f"Giảm K xuống dưới {req['K'][1]} (hiện tại: {K})")
        if ph < req['ph'][0]: suggestions.append(f"Tăng pH lên ít nhất {req['ph'][0]} (hiện tại: {ph})")
        if ph > req['ph'][1]: suggestions.append(f"Giảm pH xuống dưới {req['ph'][1]} (hiện tại: {ph})")
        if temperature < req['temp'][0]: suggestions.append(f"Tăng nhiệt độ lên ít nhất {req['temp'][0]}°C")
        if temperature > req['temp'][1]: suggestions.append(f"Giảm nhiệt độ xuống dưới {req['temp'][1]}°C")
        if humidity < req['humid'][0]: suggestions.append(f"Tăng độ ẩm lên ít nhất {req['humid'][0]}%")
        if humidity > req['humid'][1]: suggestions.append(f"Giảm độ ẩm xuống dưới {req['humid'][1]}%")
        if rainfall < req['rain'][0]: suggestions.append(f"Tăng lượng mưa lên ít nhất {req['rain'][0]} mm")
        if rainfall > req['rain'][1]: suggestions.append(f"Giảm lượng mưa xuống dưới {req['rain'][1]} mm")

        if suggestions:
            st.success(f"Đề xuất cải thiện đất để trồng {crop_translated}:")
            for suggestion in suggestions:
                st.write(f"- {suggestion}")
        else:
            st.success(f"Đất đã phù hợp để trồng {crop_translated}!")