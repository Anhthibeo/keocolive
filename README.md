# 🎮 Kéo co Live

Trò chơi kéo co tương tác dành cho **TikTok Live**. Người xem comment để vào đội, rồi dùng comment, thả tim và tặng quà để kéo dây. Mỗi người xem là một nhân vật có ảnh đại diện và tên trên sân.

## Tính năng

- Hai đội Đỏ và Xanh, comment `1` / `đỏ` để vào đội Đỏ, `2` / `xanh` để vào đội Xanh.
- Mỗi người xem là một nhân vật kéo co, đầu là ảnh đại diện TikTok, tên hiện trên đầu.
- 5 mức quà với hiệu ứng và điểm tăng dần theo giá trị quà.
- Combo cho comment liên tục, sự kiện ngẫu nhiên (Giờ Vàng, Mưa Tim, Khiên), cấp bậc người chơi.
- Màn hình chiến thắng với top 3 người xuất sắc nhất, tự bắt đầu ván mới sau 15 giây.
- Bảng "Vua live" theo tổng điểm cả buổi.
- Trang điều khiển riêng (`control.html`) để quản lý ván khi đang live, người xem không thấy.
- Âm thanh tạo bằng WebAudio, không cần file ngoài.

## Cách tính điểm

| Hành động | Điểm |
|---|---|
| Comment | 1 điểm (mỗi người tối đa 1 lần mỗi 0.4 giây) |
| Thả tim | 0.06 điểm mỗi tim (chỉnh `LIKE_PTS` trong `keo-co-live.html`) |
| Quà 1 đến 9 💎 | 1 💎 = 1 điểm, tối đa 8 |
| Quà 10 đến 49 💎 | 1 💎 = 1.2 điểm, tối đa 18 |
| Quà 50 đến 199 💎 | 1 💎 = 1.5 điểm, tối đa 35 |
| Quà 200 đến 999 💎 | 1 💎 = 2 điểm, tối đa 50 |
| Quà từ 1000 💎 | 1 💎 = 3 điểm, tối đa 70 |

Điểm có thể được nhân thêm bởi combo (tối đa ×2.5) và sự kiện đang diễn ra. Đội nào kéo dây lệch 100 lực về phía mình trước thì thắng. Bảng `TIERS` trong `keo-co-live.html` cho phép chỉnh các mức quà.

## Yêu cầu

- [Node.js](https://nodejs.org) bản LTS
- Chrome hoặc Edge
- Một tài khoản TikTok đang LIVE

## Cài đặt

```bash
npm install
```

## Chạy

**Cách nhanh trên Windows:** bấm đúp `mo-game.bat`, nhập tên TikTok (không có `@`). File này mở server, cửa sổ game (đưa lên live) và trang điều khiển.

**Cách thủ công:**

```bash
node server.js ten_tiktok_cua_ban
```

Sau đó mở `keo-co-live.html?clean` (cửa sổ game, tự kết nối) và `control.html` (điều khiển). Mở `keo-co-live.html` không có `?clean` để xem bảng chạy thử.

## Các file

| File | Vai trò |
|---|---|
| `keo-co-live.html` | Toàn bộ giao diện và luật game |
| `server.js` | Lấy comment, tim, quà từ TikTok Live và gửi qua WebSocket (`ws://localhost:8080`) |
| `control.html` | Trang điều khiển cho người phát live |
| `mo-game.bat` | Mở nhanh server, cửa sổ game và trang điều khiển trên Windows |

## Lưu ý

- Dự án dùng thư viện không chính thức [`tiktok-live-connector`](https://github.com/zerodytrash/TikTok-Live-Connector). TikTok có thể đổi bất cứ lúc nào khiến thư viện lỗi tạm thời, khi đó hãy cập nhật thư viện.
- Dự án không liên kết với TikTok. Hãy tuân thủ điều khoản và nguyên tắc cộng đồng của TikTok khi phát live.
- Khi thu cửa sổ game bằng phần mềm phát live, không thu nhỏ cửa sổ xuống thanh tác vụ, và cần thêm nguồn thu âm thanh hệ thống nếu muốn người xem nghe tiếng game.

## Giấy phép

Chưa chọn giấy phép. Thêm file `LICENSE` nếu bạn muốn cho phép người khác sử dụng lại mã.
