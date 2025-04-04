import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from crop_knn_prepocessing import preprocess_data  # Import file tiền xử lý

# Đường dẫn file dữ liệu
file_path = "crop_recommendation.csv"  # Thay bằng đường dẫn thực tế

# 1. Tiền xử lý dữ liệu
X_train, X_test, y_train, y_test, scaler = preprocess_data(file_path)

# 2. Triển khai KNN
# Chọn số lượng láng giềng k
k = 5
knn = KNeighborsClassifier(n_neighbors=k)

# Huấn luyện mô hình
knn.fit(X_train, y_train)

# 3. Đánh giá mô hình
y_pred = knn.predict(X_test)

print("\nĐộ chính xác của mô hình KNN (Accuracy):", accuracy_score(y_test, y_pred))
print("\nBáo cáo phân loại (Classification Report):")
print(classification_report(y_test, y_pred))
print("\nMa trận nhầm lẫn (Confusion Matrix):")
print(confusion_matrix(y_test, y_pred))

