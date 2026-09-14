/* ============ ÂM THANH (tạo bằng Web Audio, không cần file ngoài) ============ */
var audioCtx = null;
function getCtx(){
  if(!audioCtx){
    var AC = window.AudioContext || window.webkitAudioContext;
    if(AC) audioCtx = new AC();
  }
  if(audioCtx && audioCtx.state === 'suspended'){ audioCtx.resume(); }
  return audioCtx;
}

function playTone(freq, startAt, dur, type, vol){
  var ctx = getCtx(); if(!ctx) return;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol || 0.25, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + dur);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + dur + 0.05);
}

function soundCorrect(){
  playTone(784, 0, 0.18, 'sine', 0.3);
  playTone(1047, 0.11, 0.28, 'sine', 0.3);
}
function soundWrong(){
  /* hai nốt đi xuống, êm tai, không chói */
  playTone(392, 0, 0.15, 'sine', 0.22);
  playTone(294, 0.13, 0.24, 'sine', 0.20);
}
function soundWin(delay){
  var t = delay || 0;
  /* kèn chiến thắng: ta-ta-ta-taaa */
  var fanfare = [[523,0,0.14],[659,0.15,0.14],[784,0.30,0.14],[1047,0.45,0.55]];
  for(var i=0;i<fanfare.length;i++){
    playTone(fanfare[i][0], t+fanfare[i][1], fanfare[i][2], 'triangle', 0.3);
  }
  /* hợp âm Đô trưởng ngân dài */
  var chord = [523, 659, 784];
  for(var j=0;j<chord.length;j++){ playTone(chord[j], t+0.45, 1.1, 'sine', 0.14); }
  /* tiếng lấp lánh */
  var sparkle = [1568, 1319, 1760, 2093, 1568, 2349];
  for(var k=0;k<sparkle.length;k++){ playTone(sparkle[k], t+0.75+k*0.09, 0.22, 'sine', 0.1); }
}

function soundTick(){
  playTone(1250, 0, 0.035, 'square', 0.07);
}
function soundPick(){
  playTone(880, 0, 0.13, 'sine', 0.28);
  playTone(1320, 0.11, 0.34, 'sine', 0.26);
}

/* ============ DỮ LIỆU ============ */
var ICON_DIR = 'images/items/';
function iconSrc(id){ return ICON_DIR + id + '.png'; }

/* why = câu giải thích ngắn hiện trong hộp thoại khi cất đúng */
var items = [
  {id:'suachua', label:'Sữa chua', cat:'fridge', why:'Sữa chua phải để lạnh. Để ngoài trời nóng sẽ bị hỏng, ăn vào dễ đau bụng.'},
  {id:'thitbo', label:'Thịt bò', cat:'fridge', zoom:1.10, why:'Thịt tươi để ngoài sẽ ôi thiu và có vi khuẩn. Cất tủ lạnh mới an toàn.'},
  {id:'bongcai', label:'Bông cải xanh', cat:'fridge', why:'Rau xanh để tủ lạnh giữ được màu tươi và chất bổ.'},

  {id:'nuocmam', label:'Nước mắm', cat:'spice', bigBadge:true, why:'Nước mắm để kệ gia vị, nhớ đậy nắp thật kín.'},
  {id:'tieu', label:'Hũ tiêu', cat:'spice', why:'Tiêu để kệ gia vị nơi khô thoáng thì không bị mốc.'},

  {id:'migoi', label:'Mì gói', cat:'cabinet', why:'Mì gói để trong tủ nơi khô ráo. Gặp ẩm mì sẽ mềm và mốc.'},
  {id:'caphe', label:'Hộp cà phê', cat:'cabinet', why:'Hộp cà phê cất trong tủ kín, nơi khô ráo cho khỏi bay mùi thơm.'},
  {id:'chen', label:'Chén', cat:'cabinet', why:'Chén rửa sạch rồi cất vào tủ cho khỏi bám bụi và ruồi đậu.'},

  {id:'racgiay', label:'Giấy bẩn', cat:'trash', why:'Giấy bẩn có nhiều vi khuẩn, phải bỏ ngay vào thùng rác.'},
  {id:'vochuoi', label:'Vỏ chuối', cat:'trash', why:'Vỏ chuối là rác. Để lâu sẽ thu hút ruồi và có mùi hôi.'}
];

var CAT_NAME = {fridge:'Tủ lạnh', spice:'Kệ gia vị', cabinet:'Kệ tủ', trash:'Sọt rác'};

var sceneCol = document.querySelector('.scene-col');
var BG_W = 1136, BG_H = 939;
function layoutScene(){
  var stage = document.querySelector('.stage');
  var inner = stage.clientWidth - 36 - 18;   // padding hai bên + khoảng cách giữa 2 cột
  var h = stage.clientHeight;
  if(inner <= 0 || h <= 0) return;
  var minSide = Math.max(330, inner * 0.30);
  var sceneW = Math.min(h * (BG_W / BG_H), inner - minSide);
  var sceneH = sceneW * (BG_H / BG_W);
  var el = document.getElementById('scene-wrap');
  el.style.width  = Math.floor(sceneW) + 'px';
  el.style.height = Math.floor(sceneH) + 'px';
  sceneCol.style.width = Math.floor(sceneW) + 'px';
}
/* Đo chiều cao khay khi còn đủ món rồi khoá lại, để khay không co dần
   lúc học sinh cất bớt đồ. Đo bằng một bản sao ẩn nên không ảnh hưởng bàn chơi. */
function lockTrayHeight(){
  var box = document.querySelector('.box.items');
  if(!box) return;
  var ghost = box.cloneNode(true);
  var gTray = ghost.querySelector('.tray');
  if(!gTray) return;
  gTray.innerHTML = '';
  for(var i=0;i<items.length;i++){ gTray.appendChild(makeCard(items[i])); }
  ghost.style.position = 'absolute';
  ghost.style.left = '-10000px';
  ghost.style.top = '0';
  ghost.style.height = 'auto';
  ghost.style.width = box.clientWidth + 'px';
  ghost.style.visibility = 'hidden';
  document.body.appendChild(ghost);
  var h = ghost.offsetHeight;
  document.body.removeChild(ghost);
  if(h > 0) box.style.height = h + 'px';
}

window.addEventListener('resize', function(){
  layoutScene();
  lockTrayHeight();
});

var sideCol = document.querySelector('.side-col');
var tray = document.getElementById('tray');
var sceneWrap = document.getElementById('scene-wrap');
var zones = document.querySelectorAll('.dropzone');
var selectedCard = null;
var correctCount = 0;
var total = items.length;

/* ============ QUAY SỐ MỜI HỌC SINH ============ */
var STUDENT_DIR = 'images/students/';
var spinOverlay = document.getElementById('spin-overlay');
var spinImg     = document.getElementById('spin-img');
var spinName    = document.getElementById('spin-name');
var spinHead    = document.getElementById('spin-head');
var spinBox     = document.getElementById('spin-box');
var turnImg     = document.getElementById('turn-img');
var turnName    = document.getElementById('turn-name');
var startBtn    = document.getElementById('start-btn');

var SPIN_HOLD_MS = 3500;      /* giữ khuôn mặt to bao lâu trước khi thu nhỏ */
var hasStudents = (typeof students !== 'undefined') && students.length > 0;
var gameStarted = false;    /* đã bấm "Bắt đầu" chưa - trước đó cô chơi thử tự do */
var spinning = false;       /* đang quay thì khoá khay đồ */
var currentStudent = null;
var pool = [];              /* các bạn chưa được mời trong vòng này */
var lastPicked = -1;
var stats = {};             /* file ảnh -> {name, ok, no} */

if(hasStudents){
  for(var si=0; si<students.length; si++){
    var pre = new Image(); pre.src = STUDENT_DIR + students[si].file;   /* tải sẵn cho mượt */
  }
} else if(spinBox){
  spinBox.style.display = 'none';
}

function inputLocked(){
  return spinning || dialogOpen;
}

function pickStudent(){
  if(pool.length === 0){
    for(var i=0;i<students.length;i++){ pool.push(i); }
    for(var j=pool.length-1;j>0;j--){
      var k = Math.floor(Math.random()*(j+1));
      var t = pool[j]; pool[j] = pool[k]; pool[k] = t;
    }
    /* không mời lại đúng bạn vừa chơi ở lượt đầu của vòng mới */
    if(pool.length > 1 && pool[pool.length-1] === lastPicked){
      var tmp = pool[0]; pool[0] = pool[pool.length-1]; pool[pool.length-1] = tmp;
    }
  }
  lastPicked = pool.pop();
  return students[lastPicked];
}

function showSpinFace(s){
  spinImg.src = STUDENT_DIR + s.file;
  spinName.textContent = s.name || '';
}

function spinForNextStudent(){
  if(!hasStudents || spinning) return;
  var target = pickStudent();
  spinning = true;
  spinOverlay.classList.remove('landed');
  spinOverlay.classList.add('show');
  spinHead.textContent = 'Quay số chọn bạn…';

  var delay = 28, elapsed = 0;
  function step(){
    if(elapsed >= 1900){                       /* tổng vòng quay khoảng 2,4 giây */
      currentStudent = target;
      showSpinFace(target);
      spinHead.textContent = 'Xin mời bạn';
      spinOverlay.classList.add('landed');
      soundPick();
      playStudentName(target);                 /* gọi tên bạn vừa trúng */
      setTimeout(function(){                   /* giữ mặt to cho cả lớp nhìn rõ */
        spinOverlay.classList.remove('show');
        spinning = false;
        spinBox.classList.add('playing');
        turnImg.src = STUDENT_DIR + target.file;
        turnName.textContent = target.name || '';
      }, SPIN_HOLD_MS);
      return;
    }
    showSpinFace(students[Math.floor(Math.random()*students.length)]);
    soundTick();
    elapsed += delay;
    delay = delay * 1.17 + 3;                  /* lúc đầu chạy rất nhanh, càng về sau càng chậm */
    setTimeout(step, delay);
  }
  step();
}

function startStudentGame(){
  if(!hasStudents || spinning || gameStarted) return;
  getCtx();
  gameStarted = true;
  spinForNextStudent();
}
if(startBtn) startBtn.addEventListener('click', startStudentGame);

function recordResult(ok){
  if(!gameStarted || !currentStudent) return;
  var st = stats[currentStudent.file];
  if(!st){
    st = stats[currentStudent.file] = {name: currentStudent.name, file: currentStudent.file, ok:0, no:0};
  }
  if(ok){ st.ok++; } else { st.no++; }
}

/* ============ GIỌNG ĐỌC KHEN / NHẮC NHỞ ============ */
/* Thêm hoặc bớt câu: chép file mp3 vào voice/correct hoặc voice/incorrect
   rồi thêm tên file vào đúng danh sách bên dưới. */
var VOICE_OK_FILES = ['voice/correct/dung1.mp3', 'voice/correct/dung2.mp3',
                      'voice/correct/dung3.mp3', 'voice/correct/dung4.mp3'];
var VOICE_NO_FILES = ['voice/incorrect/sai1.mp3', 'voice/incorrect/sai2.mp3',
                      'voice/incorrect/sai3.mp3', 'voice/incorrect/sai4.mp3'];
var VOICE_DELAY = 300;                /* chờ tiếng chuông ngắn dứt rồi mới đọc */

/* Giọng gọi tên bạn: đặt file theo đúng tên ảnh, ví dụ ảnh IMG_5320.jpg thì
   file là voice/student/IMG_5320.mp3. Bạn nào chưa có file riêng sẽ dùng tạm
   file mặc định bên dưới. */
var VOICE_STUDENT_DIR = 'voice/student/';
var VOICE_STUDENT_DEFAULT = 'IMG_5318.mp3';

function loadClips(list){
  var out = [];
  for(var i=0;i<list.length;i++){
    var a = new Audio(list[i]);
    a.preload = 'auto';
    out.push(a);
  }
  return out;
}
var voiceOk = loadClips(VOICE_OK_FILES);
var voiceNo = loadClips(VOICE_NO_FILES);

/* chuẩn bị sẵn giọng gọi tên cho từng bạn */
var studentClips = {};
var studentDefaultClip = new Audio(VOICE_STUDENT_DIR + VOICE_STUDENT_DEFAULT);
studentDefaultClip.preload = 'auto';
if(typeof students !== 'undefined'){
  for(var vi=0; vi<students.length; vi++){
    (function(base){
      var a = new Audio(VOICE_STUDENT_DIR + base + '.mp3');
      a.preload = 'auto';
      a.addEventListener('error', function(){ studentClips[base] = null; });  /* chưa có file riêng */
      studentClips[base] = a;
    })(students[vi].file.replace(/\.[^.]+$/, ''));
  }
}
function studentClipFor(s){
  var base = s.file.replace(/\.[^.]+$/, '');
  return studentClips[base] || studentDefaultClip;
}
var lastVoiceOk = -1, lastVoiceNo = -1;
var playingVoice = null;
var voiceTimer = null;
var voiceEndHandler = null;   /* dự phòng khi trình duyệt chưa biết độ dài file */

function stopVoice(){
  if(voiceTimer){ clearTimeout(voiceTimer); voiceTimer = null; }
  if(playingVoice){
    try{ playingVoice.pause(); playingVoice.currentTime = 0; }catch(err){}
    playingVoice.onended = null;
    playingVoice = null;
  }
  voiceEndHandler = null;
}

/* phát ngẫu nhiên một câu, không lặp lại câu vừa đọc. Trả về thời lượng (ms). */
function playVoice(ok){
  var list = ok ? voiceOk : voiceNo;
  if(!list.length) return 0;
  var last = ok ? lastVoiceOk : lastVoiceNo;
  var i = Math.floor(Math.random() * list.length);
  if(list.length > 1 && i === last) i = (i + 1) % list.length;
  if(ok){ lastVoiceOk = i; } else { lastVoiceNo = i; }

  return startClip(list[i], VOICE_DELAY);
}

/* đọc tên bạn vừa quay trúng, lúc khuôn mặt đang hiện to */
function playStudentName(s){
  return startClip(studentClipFor(s), 250);
}

/* phát một file mp3 sau khoảng chờ, trả về thời lượng (ms) nếu biết */
function startClip(clip, delay){
  if(!clip) return 0;
  stopVoice();
  playingVoice = clip;
  clip.onended = function(){ if(voiceEndHandler) voiceEndHandler(); };
  voiceTimer = setTimeout(function(){
    voiceTimer = null;
    if(playingVoice !== clip) return;
    try{ clip.currentTime = 0; }catch(err){}
    var p = clip.play();
    if(p && p.catch) p.catch(function(){});   /* trình duyệt chặn thì bỏ qua, game vẫn chạy */
  }, delay);
  var d = (clip.duration && isFinite(clip.duration)) ? clip.duration * 1000 : 0;
  return d ? d + delay : 0;
}

/* ============ HỘP THOẠI ĐÚNG / SAI ============ */
var DIALOG_MS = 3000;                 /* tối thiểu 3 giây, dài hơn nếu câu đọc dài hơn */
var dialogEl   = document.getElementById('result-dialog');
var dialogHead = document.getElementById('result-head');
var dialogImg  = document.getElementById('result-img');
var dialogText = document.getElementById('result-text');
var dialogBar  = document.getElementById('result-bar-fill');
var dialogGirl = document.getElementById('result-girl');
var GIRL_OK = 'images/girl-ok.png', GIRL_NO = 'images/girl-no.png';
(function(){ var a = new Image(); a.src = GIRL_OK; var b = new Image(); b.src = GIRL_NO; })();
var dialogOpen = false;
var dialogTimer = null;
var dialogAfter = null;               /* việc làm tiếp sau khi hộp thoại tắt */

function closeDialog(){
  if(!dialogOpen) return;
  dialogOpen = false;
  if(dialogTimer) clearTimeout(dialogTimer);
  stopVoice();                                 /* tắt sớm thì ngắt luôn giọng đọc */
  dialogEl.classList.remove('show');
  var next = dialogAfter;
  dialogAfter = null;
  if(next) next();
}
/* hộp thoại chỉ tự tắt theo thời gian, bấm vào đâu cũng không tắt,
   để học sinh không lỡ tay làm mất câu giải thích */

function showResultDialog(item, ok, wrongCat, after){
  if(!dialogEl){ if(after) after(); return; }
  if(dialogTimer) clearTimeout(dialogTimer);
  dialogAfter = after;
  dialogOpen = true;

  dialogEl.classList.remove('ok', 'no');
  dialogEl.classList.add(ok ? 'ok' : 'no');
  dialogHead.textContent = ok ? '✅ Đúng rồi!' : '❌ Chưa đúng!';
  dialogImg.src = iconSrc(item.id);
  if(dialogGirl) dialogGirl.src = ok ? GIRL_OK : GIRL_NO;
  dialogImg.style.transform = item.zoom ? 'scale(' + item.zoom + ')' : '';
  dialogText.textContent = ok
    ? item.why
    : item.label + ' không cất ở ' + (CAT_NAME[wrongCat] || 'chỗ này') + ' đâu. Em thử nghĩ lại xem nên cất ở đâu nhé!';

  dialogEl.classList.add('show');

  /* hộp thoại mở ít nhất 3 giây, nếu câu đọc dài hơn thì chờ đọc xong hẳn */
  var openedAt = Date.now();
  var voiceMs = playVoice(ok);
  var hold = Math.max(DIALOG_MS, voiceMs ? voiceMs + 400 : 0);

  /* nếu lúc phát chưa biết độ dài file thì căn theo lúc đọc xong */
  voiceEndHandler = function(){
    if(!dialogOpen) return;
    var left = Math.max(DIALOG_MS - (Date.now() - openedAt), 400);
    if(dialogTimer) clearTimeout(dialogTimer);
    dialogTimer = setTimeout(closeDialog, left);
  };

  dialogBar.style.animation = 'none';
  void dialogBar.offsetWidth;                  /* bắt trình duyệt chạy lại thanh đếm giờ */
  dialogBar.style.animation = 'countdown ' + hold + 'ms linear forwards';

  dialogTimer = setTimeout(closeDialog, hold);
}

function showWin(){
  renderSummary();
  sideCol.classList.add('won');       /* ẩn cột phải, hiện lời chúc mừng */
  soundWin(0.15);
}

function renderSummary(){
  var box = document.getElementById('summary');
  if(!box) return;
  var list = [];
  for(var k in stats){ if(stats.hasOwnProperty(k)) list.push(stats[k]); }
  if(list.length === 0){ box.classList.remove('show'); box.innerHTML = ''; return; }
  list.sort(function(a,b){ return (b.ok - a.ok) || (a.no - b.no); });
  var html = '<div class="summary-title">🏆 Các bạn đã tham gia</div><div class="summary-grid">';
  for(var i=0;i<list.length;i++){
    html += '<div class="sum-item">' +
              '<img src="' + STUDENT_DIR + list[i].file + '" alt="">' +
              '<div class="sum-name">' + list[i].name + '</div>' +
              '<div class="sum-score">✅ ' + list[i].ok + '　❌ ' + list[i].no + '</div>' +
            '</div>';
  }
  box.innerHTML = html + '</div>';
  box.classList.add('show');
  var winBox = document.getElementById('win-box');
  if(winBox){                                  /* nhiều bạn thì thu ảnh bé lại */
    if(list.length > 12){ winBox.classList.add('many'); }
    else { winBox.classList.remove('many'); }
  }
}

function findItem(id){
  for(var i=0;i<items.length;i++){ if(items[i].id===id) return items[i]; }
  return null;
}

/* vài món có hình dẹt hoặc hẹp nên trông nhỏ hơn, dùng zoom để phóng cho cân */
function zoomStyle(item){
  return item.zoom ? ' style="transform:scale(' + item.zoom + ')"' : '';
}

function makeCard(item){
  var c = document.createElement('div');
  c.className = 'card';
  c.draggable = true;
  c.dataset.id = item.id;
  c.id = 'card-' + item.id;
  c.innerHTML = '<div class="icon-wrap"><img src="' + iconSrc(item.id) + '" alt=""' + zoomStyle(item) + '></div>' +
                '<p>' + item.label + '</p>';
  c.addEventListener('dragstart', function(e){
    if(inputLocked()){ e.preventDefault(); return; }   /* đang quay số / hiện hộp thoại thì khoá khay */
    getCtx();
    e.dataTransfer.setData('text/plain', item.id);
  });
  c.addEventListener('click', function(){
    if(inputLocked()) return;
    getCtx();
    if(selectedCard) selectedCard.classList.remove('selected');
    if(selectedCard === c){ selectedCard = null; return; }
    selectedCard = c;
    c.classList.add('selected');
  });
  return c;
}

/* xáo trộn Fisher–Yates: mọi thứ tự đều có xác suất như nhau */
function shuffleItems(){
  for(var i=items.length-1;i>0;i--){
    var j = Math.floor(Math.random()*(i+1));
    var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
  }
}

function renderTray(){
  tray.innerHTML = '';
  for(var i=0;i<items.length;i++){
    tray.appendChild(makeCard(items[i]));
  }
}
shuffleItems();
renderTray();
lockTrayHeight();
layoutScene();
window.addEventListener('load', function(){ layoutScene(); lockTrayHeight(); });

function popFeedback(zoneEl, symbol){
  var pop = document.createElement('div');
  pop.className = 'feedback-pop';
  pop.textContent = symbol;
  var rect = zoneEl.getBoundingClientRect();
  var wrapRect = sceneWrap.getBoundingClientRect();
  pop.style.left = (rect.left - wrapRect.left + rect.width/2 - 22) + 'px';
  pop.style.top = (rect.top - wrapRect.top + rect.height/2 - 22) + 'px';
  sceneWrap.appendChild(pop);
  setTimeout(function(){ pop.remove(); }, 750);
}

function updateProgress(){
  var pg = document.getElementById('progress');
  if(pg) pg.textContent = 'Đúng: ' + correctCount + ' / ' + total;
}

function tryPlace(id, zoneEl){
  if(inputLocked()) return;
  var item = findItem(id);
  if(!item) return;
  var cardEl = document.getElementById('card-' + id);
  var cat = zoneEl.dataset.cat;

  var ok = (item.cat === cat);
  /* ghi kết quả TRƯỚC khi cất món, để lượt cuối cùng kịp vào bảng tổng kết */
  recordResult(ok);

  if(ok){
    soundCorrect();
    zoneEl.classList.add('correct-flash');
    setTimeout(function(){ zoneEl.classList.remove('correct-flash'); }, 500);
    popFeedback(zoneEl, '✅');
    var badge = document.createElement('div');
    badge.className = item.bigBadge ? 'placed-badge big' : 'placed-badge';
    badge.innerHTML = '<img src="' + iconSrc(item.id) + '" alt="">';
    zoneEl.querySelector('.placed-badges').appendChild(badge);
    if(cardEl) cardEl.remove();
    correctCount++;
    updateProgress();
  } else {
    soundWrong();
    zoneEl.classList.add('wrong-flash');
    setTimeout(function(){ zoneEl.classList.remove('wrong-flash'); }, 500);
    popFeedback(zoneEl, '❌');
    if(cardEl){
      cardEl.classList.add('shake');
      setTimeout(function(){ cardEl.classList.remove('shake'); }, 400);
    }
  }
  if(selectedCard){ selectedCard.classList.remove('selected'); selectedCard = null; }

  /* hiện hộp thoại giải thích, tắt xong mới quay mời bạn tiếp theo */
  showResultDialog(item, ok, cat, function(){
    if(correctCount >= total){ showWin(); return; }
    if(gameStarted) spinForNextStudent();    /* tắt hộp thoại là quay ngay */
  });
}

for(var zi=0; zi<zones.length; zi++){
  (function(zoneEl){
    zoneEl.addEventListener('dragover', function(e){
      if(inputLocked()) return;
      e.preventDefault();
      zoneEl.classList.add('hover');
    });
    zoneEl.addEventListener('dragleave', function(){
      zoneEl.classList.remove('hover');
    });
    zoneEl.addEventListener('drop', function(e){
      e.preventDefault();
      zoneEl.classList.remove('hover');
      var id = e.dataTransfer.getData('text/plain');
      tryPlace(id, zoneEl);
    });
    zoneEl.addEventListener('click', function(){
      if(selectedCard){
        tryPlace(selectedCard.dataset.id, zoneEl);
      }
    });
  })(zones[zi]);
}

function resetGame(){
  correctCount = 0;
  selectedCard = null;
  updateProgress();
  sideCol.classList.remove('won');

  /* về lại trạng thái đầu: hiện nút "Bắt đầu", xoá thống kê */
  if(dialogTimer) clearTimeout(dialogTimer);
  stopVoice();
  dialogAfter = null;
  dialogOpen = false;
  if(dialogEl) dialogEl.classList.remove('show');
  gameStarted = false;
  spinning = false;
  currentStudent = null;
  pool = [];
  lastPicked = -1;
  stats = {};
  if(spinOverlay){ spinOverlay.classList.remove('show'); spinOverlay.classList.remove('landed'); }
  if(spinBox) spinBox.classList.remove('playing');
  var sum = document.getElementById('summary');
  if(sum){ sum.classList.remove('show'); sum.innerHTML = ''; }
  var badgeWraps = document.querySelectorAll('.placed-badges');
  for(var i=0;i<badgeWraps.length;i++){ badgeWraps[i].innerHTML = ''; }
  shuffleItems();
  renderTray();
}
