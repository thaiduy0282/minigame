#!/usr/bin/env python3
"""
Đọc file danh-sach-hoc-sinh.xlsx (sau khi cô đã điền tên) rồi ghi lại js/students.js.

Cách dùng: mở Terminal tại thư mục trò chơi rồi gõ
    python3 tools/cap-nhat-ten-hoc-sinh.py

Không cần cài thêm thư viện nào. File .xlsx thực chất là một file nén chứa XML,
script này đọc thẳng phần XML đó.
"""

import os
import re
import sys
import zipfile
from xml.etree import ElementTree as ET
from xml.sax.saxutils import unescape

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
EXCEL = "danh-sach-hoc-sinh.xlsx"
DICH = "js/students.js"
THU_MUC_ANH = "images/students"


def doc_chuoi_dung_chung(z):
    """Excel gom chữ vào một bảng dùng chung, đọc bảng đó ra danh sách."""
    if "xl/sharedStrings.xml" not in z.namelist():
        return []
    goc = ET.fromstring(z.read("xl/sharedStrings.xml"))
    ket_qua = []
    for si in goc.findall(f"{NS}si"):
        ket_qua.append("".join(t.text or "" for t in si.iter(f"{NS}t")))
    return ket_qua


def gia_tri_o(c, chuoi_chung):
    kieu = c.get("t")
    if kieu == "inlineStr":
        return "".join(t.text or "" for t in c.iter(f"{NS}t")).strip()
    v = c.find(f"{NS}v")
    if v is None or v.text is None:
        return ""
    if kieu == "s":
        return chuoi_chung[int(v.text)].strip()
    return unescape(v.text).strip()


def doc_excel(duong_dan):
    with zipfile.ZipFile(duong_dan) as z:
        chuoi_chung = doc_chuoi_dung_chung(z)
        ten_sheet = "xl/worksheets/sheet1.xml"
        if ten_sheet not in z.namelist():
            ten_sheet = next(n for n in z.namelist() if n.startswith("xl/worksheets/sheet"))
        goc = ET.fromstring(z.read(ten_sheet))

    danh_sach = []
    for row in goc.iter(f"{NS}row"):
        so_dong = int(row.get("r", "0"))
        if so_dong < 2:                      # dòng 1 là tiêu đề
            continue
        o = {}
        for c in row.findall(f"{NS}c"):
            cot = re.sub(r"\d+", "", c.get("r", ""))
            o[cot] = gia_tri_o(c, chuoi_chung)
        ten_file, ten = o.get("C", ""), o.get("D", "")
        if ten_file:
            danh_sach.append((ten_file, ten))
    return danh_sach


def main():
    if not os.path.exists(EXCEL):
        sys.exit(f"Không thấy file {EXCEL} trong thư mục này.")

    danh_sach = doc_excel(EXCEL)
    if not danh_sach:
        sys.exit("File Excel không có dòng nào. Kiểm tra lại cột C (tên file ảnh).")

    thieu_anh, thieu_ten = [], []
    for ten_file, ten in danh_sach:
        if not os.path.exists(os.path.join(THU_MUC_ANH, ten_file)):
            thieu_anh.append(ten_file)
        if not ten:
            thieu_ten.append(ten_file)

    if thieu_anh:
        sys.exit("Không tìm thấy ảnh cho: " + ", ".join(thieu_anh))

    dong = []
    for ten_file, ten in danh_sach:
        ten = ten.replace("\\", "").replace("'", "’")      # tránh làm hỏng dấu nháy trong code
        dong.append(f"  {{file:'{ten_file}', name:'{ten}'}},")

    noi_dung = (
        "/* ============================================================\n"
        "   DANH SÁCH HỌC SINH\n"
        "   File này do tools/cap-nhat-ten-hoc-sinh.py tạo ra từ\n"
        "   danh-sach-hoc-sinh.xlsx. Sửa tên trong file Excel rồi chạy lại\n"
        "   script đó, hoặc sửa thẳng tên trong dấu nháy bên dưới.\n"
        "   Ảnh nằm trong thư mục images/students/ (tên file phải trùng).\n"
        "   ============================================================ */\n"
        "var students = [\n" + "\n".join(dong) + "\n];\n"
    )
    open(DICH, "w", encoding="utf8").write(noi_dung)

    print(f"Đã cập nhật {DICH}: {len(danh_sach)} bạn.")
    if thieu_ten:
        print(f"Lưu ý: {len(thieu_ten)} bạn chưa điền tên, đang để trống: "
              + ", ".join(thieu_ten))
    print("Mở lại index.html để xem kết quả.")


if __name__ == "__main__":
    main()
