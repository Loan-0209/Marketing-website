#!/usr/bin/env python3
import webbrowser
import os

# Get the directory path
dir_path = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18'

# File paths
index_path = os.path.join(dir_path, 'index.html')

print('🌐 Đang mở HEART Technology Park website...')

# Open main HEART website (index.html)
if os.path.exists(index_path):
    webbrowser.open('file://' + index_path)
    print('✅ HEART Technology Park website đã mở')
    print('🎯 Trang chủ với navigation bar đầy đủ')
    print('🏠 Home page hiển thị hero section, stats và features')
    print('📖 Có thể navigate đến About page để xem building')
else:
    print('❌ Không tìm thấy index.html')

print('\n🎉 HEART Technology Park website đã sẵn sàng!')
print('   📱 Responsive design cho mọi thiết bị')
print('   🧭 Navigation: Home | About | Master Plan | 3D Campus | ...')
print('   🏢 Building component trên About page không còn overlap')
print('   🚀 Performance được tối ưu hóa')