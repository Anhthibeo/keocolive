// Cầu nối TikTok Live -> game (WebSocket), dành cho tiktok-live-connector v2
// Chạy:  node server.js ten_tiktok_cua_ban   (không có dấu @)
// Tự kết nối lại khi mất mạng / live tạm dừng. Dùng chay-game.bat để tự bật lại nếu chương trình bị tắt.
const { TikTokLiveConnection, WebcastEvent, ControlEvent } = require('tiktok-live-connector');
const { WebSocketServer } = require('ws');

const username = (process.argv[2] || '').replace(/^@/, '');
if (!username) { console.log('Dùng: node server.js ten_tiktok'); process.exit(1); }

const wss = new WebSocketServer({ port: 8080 });
// Chuyển tiếp tin nhắn giữa trang điều khiển (control.html) và trang game
wss.on('connection', (sock) => {
  sock.on('message', (data) => {
    const msg = data.toString();
    wss.clients.forEach((c) => { if (c !== sock && c.readyState === 1) c.send(msg); });
  });
});
const send = (obj) => {
  const s = JSON.stringify(obj);
  wss.clients.forEach((c) => c.readyState === 1 && c.send(s));
};
const uid = (d) => (d.user && (d.user.uniqueId || d.user.nickname)) || d.uniqueId || 'khach';
const rawj = (d) => JSON.stringify(d, (k, v) => typeof v === 'bigint' ? v.toString() : v).slice(0, 700);
const urlOf = (x) => {
  if (!x) return '';
  if (typeof x === 'string') return x;
  if (Array.isArray(x)) return urlOf(x[0]);
  return urlOf(x.url) || urlOf(x.urls) || urlOf(x.urlList) || urlOf(x.url_list) || '';
};
const av = (d) => { const u = d.user || {}; return urlOf(u.avatarThumb) || urlOf(u.profilePicture) || urlOf(u.avatarMedium) || urlOf(u.avatarLarger) || urlOf(d.profilePictureUrl) || ''; };
const msg = (e) => (e && e.message ? e.message : e);

let conn = null, timer = null, dbgA = 0, likeDbg = 0, giftDbg = 0;

function schedule(ms) {
  if (timer) return;
  timer = setTimeout(() => { timer = null; start(); }, ms);
}

function start() {
  if (conn) { try { conn.disconnect(); } catch (e) {} conn = null; }
  const c = conn = new TikTokLiveConnection(username, {});

  c.on(WebcastEvent.CHAT, (d) => {
    const text = String(d.comment ?? d.content ?? d.text ?? d.message ?? '');
    if (!text) console.log('DU LIEU THO (chat):', rawj(d));
    console.log('chat:', uid(d), text);
    if (dbgA++ < 3) console.log('AVATAR:', av(d) || ('KHONG TIM THAY. user=' + rawj(d.user)));
    send({ type: 'chat', user: uid(d), comment: text, avatar: av(d) });
  });
  c.on(WebcastEvent.LIKE, (d) => {
    const count = Number(d.likeCount ?? d.count ?? 1) || 1;
    console.log('like:', uid(d), count);
    if (likeDbg++ < 2) console.log('DU LIEU THO (like):', rawj(d));
    send({ type: 'like', user: uid(d), count, avatar: av(d) });
  });
  c.on(WebcastEvent.GIFT, (d) => {
    if (giftDbg++ < 3) console.log('DU LIEU THO (gift):', rawj(d));
    const g = d.giftDetails || {};
    // Quà liên tiếp (streak): chỉ tính khi kết thúc chuỗi
    if ((g.giftType === 1 || d.giftType === 1) && d.repeatEnd === false) return;
    const name = g.giftName || d.giftName || 'quà';
    const dia = Number(g.diamondCount ?? d.diamondCount ?? 1) * Number(d.repeatCount || 1);
    console.log('gift:', uid(d), name, dia);
    send({ type: 'gift', user: uid(d), name, diamonds: dia, avatar: av(d) });
  });
  c.on(ControlEvent.DISCONNECTED || 'disconnected', () => {
    if (c !== conn) return;
    console.log('Mất kết nối, thử lại sau 5s…'); schedule(5000);
  });
  if (ControlEvent && ControlEvent.ERROR) c.on(ControlEvent.ERROR, (e) => console.log('Lỗi:', msg(e)));

  c.connect()
    .then((st) => console.log('Đã vào phòng live', st.roomId))
    .catch((e) => { console.log('Chưa kết nối được (live chưa bật?), thử lại sau 10s:', msg(e)); if (c === conn) schedule(10000); });
}

// Kiểm tra định kỳ: nếu kết nối đã chết mà chưa ai lên lịch kết nối lại thì tự kết nối lại
setInterval(() => { if (conn && conn.isConnected === false && !timer) { console.log('Phát hiện mất kết nối, kết nối lại…'); schedule(2000); } }, 60000);
process.on('uncaughtException', (e) => { console.log('Lỗi không mong muốn:', msg(e)); schedule(5000); });
process.on('unhandledRejection', (e) => { console.log('Lỗi không mong muốn:', msg(e)); schedule(5000); });

start();
console.log('WebSocket chạy ở ws://localhost:8080');
