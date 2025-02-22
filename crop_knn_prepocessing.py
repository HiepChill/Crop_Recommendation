import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def preprocess_data(file_path):
    # Đọc dữ liệu
    data = pd.read_csv(file_path)

    # Xác định các cột đầu vào (features) và đầu ra (label)
    features = data[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    labels = data['label']

    # Chia dữ liệu thành tập huấn luyện và tập kiểm tra
    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

    # Chuẩn hóa dữ liệu
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Trả về dữ liệu đã xử lý và scaler
    return X_train, X_test, y_train, y_test, scaler
