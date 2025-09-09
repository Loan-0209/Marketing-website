# 🔍 CLAUDE CODE PROMPT - KIỂM TRA KẾT QUẢ DI CHUYỂN DATA CENTERS

## Prompt chính để copy vào Claude Code:

```
Hãy giúp tôi kiểm tra và validate kết quả di chuyển Data Centers trong 3D Smart City. Thực hiện kiểm tra toàn diện và tạo báo cáo chi tiết.

🎯 NHIỆM VỤ KIỂM TRA:
Kiểm tra xem Data Centers đã được di chuyển đúng vị trí an toàn trên đất liền chưa, và tất cả components hoạt động bình thường.

📋 CÁC BƯỚC KIỂM TRA:

### Bước 1: Phân tích file 3D Smart City hiện tại
- Đọc file `3d-smart-city.html` 
- Kiểm tra code JavaScript liên quan đến Data Centers
- Xác định vị trí hiện tại của Data Centers trong code
- Tìm các hàm tạo và quản lý Data Centers

### Bước 2: Kiểm tra vị trí Data Centers trong code
- Tìm các dòng code định nghĩa vị trí Data Centers
- Kiểm tra coordinates: DC1(600,0), DC2(550,80), DC3(650,60)
- Xác nhận chúng có nằm trên đất liền không (tránh xa sông)
- Kiểm tra kích thước và properties của Data Centers

### Bước 3: Validation vị trí an toàn
- Kiểm tra vùng sông: x(200-400), z(-100 đến 300)
- Confirm Data Centers KHÔNG nằm trong vùng này
- Tính khoảng cách từ Data Centers đến sông
- Đảm bảo không có collision với water features

### Bước 4: Kiểm tra Cooling Towers
- Xác nhận mỗi Data Center có 4 cooling towers
- Kiểm tra vị trí towers xung quanh Data Centers
- Validate khoảng cách và layout của towers
- Đảm bảo towers cũng nằm trên đất liền

### Bước 5: Test chức năng
- Kiểm tra các controls vẫn hoạt động
- Test camera views và interactions
- Verify 3D scene render đúng
- Kiểm tra performance và stability

### Bước 6: Tạo script validation
- Tạo JavaScript validation script
- Script kiểm tra vị trí real-time trong browser
- Báo cáo chi tiết về status của từng component
- Warning nếu có vấn đề

### Bước 7: Báo cáo kết quả
- Tóm tắt kết quả kiểm tra
- Liệt kê các vấn đề (nếu có)
- Đề xuất fixes (nếu cần)
- Confirmation về việc di chuyển thành công

🎨 THÔNG TIN REFERENCE:
- Vị trí mục tiêu: DC1(600,0), DC2(550,80), DC3(650,60)
- Vùng sông cần tránh: x(200-400), z(-100 đến 300)
- Mỗi DC cần có 4 cooling towers
- Layout phải giống hình mẫu người dùng cung cấp

🔧 TOOLS CẦN SỬ DỤNG:
- Đọc và phân tích file HTML/JavaScript
- Tạo validation scripts
- Kiểm tra syntax và logic
- Tạo test cases

✅ OUTPUT MONG MUỐN:
- Báo cáo chi tiết về vị trí Data Centers
- Confirmation về tính an toàn của vị trí
- Validation script để test trong browser
- Recommendations nếu cần điều chỉnh

Hãy thực hiện từng bước một cách chi tiết và cung cấp báo cáo đầy đủ về trạng thái hiện tại.
```

## 🚀 CÁCH SỬ DỤNG:

### Bước 1: Khởi động Claude Code
```bash
claude-code
```

### Bước 2: Copy paste prompt trên vào Claude Code

### Bước 3: Hoặc sử dụng file prompt
```bash
claude-code --prompt-file=validation-prompt.txt
```

## 🎯 PROMPT NGẮN GỌN:

```
Kiểm tra file 3d-smart-city.html - xác nhận Data Centers đã được di chuyển đúng vị trí DC1(600,0), DC2(550,80), DC3(650,60), tránh xa sông (x:200-400, z:-100-300). Tạo validation script và báo cáo chi tiết về kết quả di chuyển.
```

## 🔧 LỆNH CLAUDE CODE TRỰC TIẾP:

```bash
claude-code "Phân tích file 3d-smart-city.html, kiểm tra Data Centers đã di chuyển đúng vị trí an toàn chưa, tạo validation script và báo cáo kết quả"
```
