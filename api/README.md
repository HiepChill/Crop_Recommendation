# CropHelper API

API FastAPI cho ứng dụng CropHelper, cung cấp các endpoint để dự đoán cây trồng phù hợp và đề xuất cải thiện đất.

## Cài đặt

### Sử dụng Docker

```bash
# Build Docker image
docker build -t crophelper-api .

# Chạy container
docker run -p 8000:8000 crophelper-api

