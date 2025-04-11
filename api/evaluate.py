# Import các thư viện cần thiết
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# 1. Đọc dữ liệu từ file crop_recommendation.csv
file_path = r"./api/crop_recommendation.csv"  # Đảm bảo file nằm trong thư mục làm việc
try:
    cropdf = pd.read_csv(file_path)
    print("Dữ liệu đã được đọc thành công từ file crop_recommendation.csv")
    print("Kích thước dữ liệu:", cropdf.shape)
except FileNotFoundError:
    print(f"Không tìm thấy file {file_path}. Vui lòng kiểm tra đường dẫn!")
    exit()

# Tách đặc trưng (X) và nhãn (y)
X = cropdf.drop('label', axis=1)
y = cropdf['label']

# Phân chia dữ liệu thành tập huấn luyện và kiểm tra
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Chuẩn hóa dữ liệu
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 2. Khởi tạo dictionary để lưu kết quả
results = {'Model': [], 'Accuracy': [], 'Precision': [], 'Recall': [], 'F1-Score': []}
confusion_matrices = {}

# Hàm đánh giá mô hình và lưu kết quả
def evaluate_model(model, model_name, X_train, X_test, y_train, y_test):
    y_pred = model.predict(X_test)
    results['Model'].append(model_name)
    results['Accuracy'].append(accuracy_score(y_test, y_pred))
    results['Precision'].append(precision_score(y_test, y_pred, average='weighted'))
    results['Recall'].append(recall_score(y_test, y_pred, average='weighted'))
    results['F1-Score'].append(f1_score(y_test, y_pred, average='weighted'))
    confusion_matrices[model_name] = confusion_matrix(y_test, y_pred)

# 3. Huấn luyện và đánh giá các mô hình

# KNN
knn = KNeighborsClassifier(n_neighbors=7)
knn.fit(X_train_scaled, y_train)
evaluate_model(knn, 'KNN', X_train_scaled, X_test_scaled, y_train, y_test)

# SVM
parameters = {'C': np.logspace(-3, 2, 6).tolist(), 'gamma': np.logspace(-3, 2, 6).tolist()}
svm = GridSearchCV(SVC(kernel='linear'), param_grid=parameters, cv=4, n_jobs=-1)
svm.fit(X_train_scaled, y_train)
evaluate_model(svm, 'SVM', X_train_scaled, X_test_scaled, y_train, y_test)
print(f"SVM Best Params: {svm.best_params_}, Best CV Score: {svm.best_score_:.4f}")

# Decision Tree
dt = DecisionTreeClassifier(random_state=42)
dt.fit(X_train, y_train)
evaluate_model(dt, 'Decision Tree', X_train, X_test, y_train, y_test)

# Random Forest
rf = RandomForestClassifier(max_depth=4, n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
evaluate_model(rf, 'Random Forest', X_train, X_test, y_train, y_test)

# 4. Hiển thị bảng kết quả
results_df = pd.DataFrame(results)
print("\nKết quả đánh giá các mô hình trên tập kiểm tra:")
print(results_df)

# 5. Trực quan hóa so sánh
# Biểu đồ Accuracy
# plt.figure(figsize=(10, 5))
# sns.barplot(x='Model', y='Accuracy', data=results_df)
# plt.title('So sánh Accuracy của các mô hình')
# plt.ylim(0, 1)
# for i, v in enumerate(results_df['Accuracy']):
#     plt.text(i, v + 0.01, f"{v:.4f}", ha='center')
# plt.show()

# # Biểu đồ F1-Score
# plt.figure(figsize=(10, 5))
# sns.barplot(x='Model', y='F1-Score', data=results_df)
# plt.title('So sánh F1-Score của các mô hình')
# plt.ylim(0, 1)
# for i, v in enumerate(results_df['F1-Score']):
#     plt.text(i, v + 0.01, f"{v:.4f}", ha='center')
# plt.show()

# # Confusion Matrix cho Random Forest (ví dụ)
# plt.figure(figsize=(10, 8))
# sns.heatmap(confusion_matrices['Random Forest'], annot=False, cmap='Blues')
# plt.title('Confusion Matrix - Random Forest')
# plt.xlabel('Predicted')
# plt.ylabel('Actual')
# plt.show()