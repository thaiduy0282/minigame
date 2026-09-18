TRÒ CHƠI: SIÊU ĐẦU BẾP NHÍ
Tự nhiên và Xã hội lớp 3 - Bài: Phòng tránh ngộ độc

VỀ DỰ ÁN NÀY
  Đây là dự án phi lợi nhuận, làm ra chỉ để phục vụ việc giảng dạy trên lớp.
  Trò chơi được đưa lên mạng công khai trong một khoảng thời gian nhất định
  để tiện trình chiếu khi dạy học và dự giờ. Sau đợt đó, kho mã nguồn sẽ được
  chuyển về chế độ riêng tư.
  Ảnh và tên học sinh trong trò chơi chỉ dùng cho tiết học của lớp, không dùng
  cho bất kỳ mục đích nào khác.

CÁCH DÙNG
  Giải nén toàn bộ thư mục, mở file index.html bằng Chrome hoặc Edge,
  rồi nhấn F11 để vào toàn màn hình khi trình chiếu lên TV.
  Chạy hoàn toàn offline, không cần mạng.

CẤU TRÚC
  index.html            Nội dung trang (khung bếp, các vùng thả, bảng bên phải)
  css/style.css         Toàn bộ định dạng, màu sắc, bố cục
  js/game.js            Danh sách vật phẩm, logic kéo-thả, quay số, âm thanh
  js/students.js        Danh sách học sinh (tên file ảnh + tên học sinh)
  fonts/Quicksand.ttf   Phông chữ Quicksand (kèm giấy phép OFL.txt), dùng offline
  images/kitchen.jpg    Ảnh nền nhà bếp
  images/items/         10 ảnh vật phẩm (tên file trùng với id trong game.js)
  images/girl-ok.png    Bạn nhỏ vui, hiện khi cất đúng và ở màn chiến thắng
  images/girl-no.png    Bạn nhỏ buồn, hiện khi cất sai
  images/students/      24 ảnh học sinh đã cắt vuông vào mặt, cỡ 400x400
  images/students-goc/  Ảnh gốc chưa cắt (chỉ nằm trong máy, không đưa lên mạng)
  voice/correct/        Các câu khen khi cất đúng (mp3)
  voice/incorrect/      Các câu nhắc nhở khi cất sai (mp3)
  voice/student/        Giọng gọi tên từng bạn (mp3, tên trùng tên file ảnh)
  voice/win.mp3         Câu cảm ơn cả lớp, phát ở màn chiến thắng
  voice/win-music.mp3   Nhạc mừng, phát trước câu cảm ơn (không bắt buộc)
  voice/sfx-correct.mp3 Hiệu ứng khi kéo đúng (không bắt buộc)
  voice/sfx-wrong.wav   Hiệu ứng khi kéo sai (không bắt buộc)

CÁCH CHƠI CÓ QUAY SỐ
  - Vừa mở game: cô kéo thử vài món cho cả lớp xem. Lúc này chưa quay số.
  - Bấm nút "Bắt đầu quay số": ảnh các bạn chạy nhanh rồi chậm dần giữa màn hình,
    dừng lại ở một bạn kèm dòng "Xin mời bạn ..." và đọc tên bạn đó.
    Khuôn mặt giữ to 3,5 giây cho cả lớp nhìn rõ rồi mới thu nhỏ về ô bên phải.
  - Bạn được mời tự chọn món bất kỳ trong khay và kéo vào nơi cất giữ.
  - Kéo xong hiện ngay hộp thoại: đúng thì có câu giải thích vì sao cất ở đó,
    sai thì nhắc nhẹ để bạn khác nghĩ tiếp (không lộ đáp án).
    Kèm giọng đọc: mỗi lần bốc ngẫu nhiên một câu, không lặp lại câu vừa đọc.
    Hộp thoại mở ít nhất 3 giây, nếu câu đọc dài hơn thì chờ đọc xong hẳn.
    Hộp thoại chỉ tự tắt theo thời gian, bấm vào đâu cũng không tắt được,
    tránh học sinh lỡ tay bấm nhầm làm mất câu giải thích.
    Tắt hộp thoại xong là game quay mời bạn tiếp theo ngay.
    Trong lúc quay số và lúc hộp thoại đang mở, khay đồ bị khoá.
  - Ưu tiên các bạn chưa được mời. Khi cả lớp đã được mời một lượt thì quay vòng lại,
    nhưng không mời trùng một bạn hai lượt liền nhau.
  - Cất đúng đủ 10 món: khay đồ và ô quay số được thay bằng lời chúc mừng kèm
    hình bạn nhỏ và bảng tổng kết các bạn đã tham gia (số lần đúng, số lần sai).
    Khung bếp bên trái vẫn hiện nguyên để cả lớp xem lại đã cất món nào ở đâu.
    Lượt cô chơi thử trước khi bấm "Bắt đầu" không bị tính vào bảng này.
  - Muốn chơi lại từ đầu: nhấn F5 (hoặc Ctrl+R) để tải lại trang.

MUỐN SỬA TÊN HỌC SINH
  Mở js/students.js, sửa phần name của từng dòng thành tên thật, ví dụ:
    {file:'IMG_5318.jpg', name:'Nguyễn Minh Anh'},
  Muốn bỏ một bạn thì xoá cả dòng của bạn đó.
  Thêm bạn mới: chép ảnh vuông vào images/students/ rồi thêm một dòng tương ứng.
  Nếu file js/students.js trống, phần quay số sẽ tự ẩn đi và game chơi như cũ.

MUỐN SỬA NỘI DUNG
  - Thêm/bớt/đổi vật phẩm: sửa mảng "items" trong js/game.js.
    Mỗi món gồm: id (trùng tên file ảnh), label (chữ hiện ra), cat (nơi cất đúng),
    why (câu giải thích hiện trong hộp thoại khi cất đúng).
    cat nhận 1 trong 4 giá trị: fridge, spice, cabinet, trash.
  - Đổi thời gian hộp thoại: sửa số DIALOG_MS trong js/game.js (3000 = 3 giây).
  - Câu đọc khi cất đúng: mỗi món một file, đặt tên trùng id của món,
    ví dụ voice/correct/suachua.mp3. Câu khi cất sai dùng chung các file
    voice/incorrect/sai1.mp3, sai2.mp3... liệt kê trong VOICE_NO_CHUNG (js/game.js).
    Lưu ý: trình duyệt chỉ phát tiếng sau khi cô bấm chuột lần đầu trong trang.
  - Giọng gọi tên bạn: đặt file theo đúng tên ảnh, ví dụ ảnh IMG_5320.jpg thì
    file là voice/student/IMG_5320.mp3. Bạn nào chưa có file riêng thì game vẫn
    quay số và hiện tên bình thường, chỉ không đọc tên bạn đó.
  - Đổi thời gian giữ khuôn mặt to: sửa SPIN_HOLD_MS trong js/game.js (3500 = 3,5 giây).
  - Đổi vị trí/kích thước vùng thả: sửa thuộc tính style (left/top/width/height)
    của các thẻ .dropzone trong index.html.
  - Đổi tên trò chơi hoặc luật chơi: sửa trực tiếp trong index.html.

LƯU Ý
  Phải giữ nguyên cả thư mục (index.html cùng với css, js, images).
  Nếu tách rời, trang sẽ mất định dạng và không hiện ảnh.
