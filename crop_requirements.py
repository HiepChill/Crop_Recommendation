import pandas as pd

def calculate_crop_requirements():
    # Đọc dữ liệu
    file_path = "crop_recommendation.csv"
    data = pd.read_csv(file_path)

    # Nhóm theo cây trồng và tính min, max
    crop_stats = data.groupby('label').agg({
        'N': ['min', 'max'],
        'P': ['min', 'max'],
        'K': ['min', 'max'],
        'temperature': ['min', 'max'],
        'humidity': ['min', 'max'],
        'ph': ['min', 'max'],
        'rainfall': ['min', 'max']
    })

    # Tạo crop_requirements
    crop_requirements = {}
    for crop in crop_stats.index:  # Sử dụng index thay vì row['label']
        crop_requirements[crop] = {
            'N': (int(crop_stats.loc[crop, ('N', 'min')]), int(crop_stats.loc[crop, ('N', 'max')])),
            'P': (int(crop_stats.loc[crop, ('P', 'min')]), int(crop_stats.loc[crop, ('P', 'max')])),
            'K': (int(crop_stats.loc[crop, ('K', 'min')]), int(crop_stats.loc[crop, ('K', 'max')])),
            'temp': (round(crop_stats.loc[crop, ('temperature', 'min')], 1), round(crop_stats.loc[crop, ('temperature', 'max')], 1)),
            'humid': (round(crop_stats.loc[crop, ('humidity', 'min')], 1), round(crop_stats.loc[crop, ('humidity', 'max')], 1)),
            'ph': (round(crop_stats.loc[crop, ('ph', 'min')], 1), round(crop_stats.loc[crop, ('ph', 'max')], 1)),
            'rain': (round(crop_stats.loc[crop, ('rainfall', 'min')], 1), round(crop_stats.loc[crop, ('rainfall', 'max')], 1))
        }
    
    return crop_requirements

# # Chạy và in kết quả
# if __name__ == "__main__":
#     crop_req = calculate_crop_requirements()
#     print("crop_requirements:", crop_req)