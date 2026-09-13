TRÒ CHƠI: CẤT GIỮ THỰC PHẨM ĐÚNG CÁCH
Tự nhiên và Xã hội lớp 3 - Bài: Phòng tránh ngộ độc

CÁCH DÙNG
  Giải nén toàn bộ thư mục, mở file index.html bằng Chrome hoặc Edge,
  rồi nhấn F11 để vào toàn màn hình khi trình chiếu lên TV.
  Chạy hoàn toàn offline, không cần mạng.

CẤU TRÚC
  index.html            Nội dung trang (khung bếp, các vùng thả, bảng bên phải)
  css/style.css         Toàn bộ định dạng, màu sắc, bố cục
  js/game.js            Danh sách vật phẩm, logic kéo-thả, âm thanh
  fonts/Quicksand.ttf   Phông chữ Quicksand (kèm giấy phép OFL.txt), dùng offline
  images/kitchen.jpg    Ảnh nền nhà bếp
  images/items/         20 ảnh vật phẩm (tên file trùng với id trong game.js)

MUỐN SỬA NỘI DUNG
  - Thêm/bớt/đổi vật phẩm: sửa mảng "items" trong js/game.js.
    Mỗi món gồm: id (trùng tên file ảnh), label (chữ hiện ra), cat (nơi cất đúng).
    cat nhận 1 trong 4 giá trị: fridge, spice, cabinet, trash.
  - Đổi vị trí/kích thước vùng thả: sửa thuộc tính style (left/top/width/height)
    của các thẻ .dropzone trong index.html.
  - Đổi tên trò chơi hoặc luật chơi: sửa trực tiếp trong index.html.

LƯU Ý
  Phải giữ nguyên cả thư mục (index.html cùng với css, js, images).
  Nếu tách rời, trang sẽ mất định dạng và không hiện ảnh.
