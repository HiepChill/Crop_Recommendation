def translate_crops(crop_list):
    translation_dict = {
        'rice': 'Lúa',
        'maize': 'Ngô',
        'chickpea': 'Đậu hồi (đậu gà)',
        'kidneybeans': 'Đậu đỏ tây (đậu thận)',
        'pigeonpeas': 'Đậu triều (đậu bồ câu)',
        'mothbeans': 'Đậu bướm (Matki)',
        'mungbean': 'Đậu xanh',
        'blackgram': 'Đậu đen',
        'lentil': 'Đậu lăng',
        'pomegranate': 'Lựu',
        'banana': 'Chuối',
        'mango': 'Xoài',
        'grapes': 'Nho',
        'watermelon': 'Dưa hấu',
        'muskmelon': 'Dưa lưới',
        'apple': 'Táo',
        'orange': 'Cam',
        'papaya': 'Đu đủ',
        'coconut': 'Dừa',
        'cotton': 'Bông',
        'jute': 'Đay',
        'coffee': 'Cà phê',
        'potato': 'Khoai tây'
    }
    
    return [translation_dict[crop] for crop in crop_list if crop in translation_dict]

# Từ điển ngược để tìm key gốc từ tên đã dịch
reverse_translation = {v: k for k, v in {
    'rice': 'Lúa',
    'maize': 'Ngô',
    'chickpea': 'Đậu hồi (đậu gà)',
    'kidneybeans': 'Đậu đỏ tây (đậu thận)',
    'pigeonpeas': 'Đậu triều (đậu bồ câu)',
    'mothbeans': 'Đậu bướm (Matki)',
    'mungbean': 'Đậu xanh',
    'blackgram': 'Đậu đen',
    'lentil': 'Đậu lăng',
    'pomegranate': 'Lựu',
    'banana': 'Chuối',
    'mango': 'Xoài',
    'grapes': 'Nho',
    'watermelon': 'Dưa hấu',
    'muskmelon': 'Dưa lưới',
    'apple': 'Táo',
    'orange': 'Cam',
    'papaya': 'Đu đủ',
    'coconut': 'Dừa',
    'cotton': 'Bông',
    'jute': 'Đay',
    'coffee': 'Cà phê',
    'potato': 'Khoai tây'
}.items()}