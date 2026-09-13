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

/* ============ DỮ LIỆU ============ */
var ICON_DIR = 'images/items/';
function iconSrc(id){ return ICON_DIR + id + '.png'; }

var items = [
  {id:'suachua', label:'Sữa chua', cat:'fridge'},
  {id:'sua', label:'Sữa tươi', cat:'fridge'},
  {id:'thitbo', label:'Thịt bò', cat:'fridge'},
  {id:'ca', label:'Cá tươi', cat:'fridge'},
  {id:'trung', label:'Trứng', cat:'fridge'},
  {id:'phomai', label:'Phô mai', cat:'fridge'},
  {id:'bo', label:'Bơ', cat:'fridge'},
  {id:'kem', label:'Kem', cat:'fridge'},
  {id:'carot', label:'Cà rốt', cat:'fridge'},
  {id:'bongcai', label:'Bông cải xanh', cat:'fridge'},
  {id:'traicay', label:'Trái cây', cat:'fridge'},

  {id:'dauan', label:'Dầu ăn', cat:'spice'},
  {id:'nuocmam', label:'Nước mắm', cat:'spice'},
  {id:'muoi', label:'Muối', cat:'spice'},
  {id:'tieu', label:'Tiêu', cat:'spice'},

  {id:'duong', label:'Đường', cat:'cabinet'},
  {id:'botmi', label:'Bột mì', cat:'cabinet'},

  {id:'hopnuocep', label:'Hộp nước ép', cat:'trash'},
  {id:'racgiay', label:'Giấy gói bẩn', cat:'trash'},
  {id:'vochuoi', label:'Vỏ chuối', cat:'trash'}
];

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
window.addEventListener('resize', layoutScene);

var tray = document.getElementById('tray');
var sceneWrap = document.getElementById('scene-wrap');
var zones = document.querySelectorAll('.dropzone');
var selectedCard = null;
var correctCount = 0;
var total = items.length;

function findItem(id){
  for(var i=0;i<items.length;i++){ if(items[i].id===id) return items[i]; }
  return null;
}

function makeCard(item){
  var c = document.createElement('div');
  c.className = 'card';
  c.draggable = true;
  c.dataset.id = item.id;
  c.id = 'card-' + item.id;
  c.innerHTML = '<div class="icon-wrap"><img src="' + iconSrc(item.id) + '" alt=""></div><p>' + item.label + '</p>';
  c.addEventListener('dragstart', function(e){ getCtx(); e.dataTransfer.setData('text/plain', item.id); });
  c.addEventListener('click', function(){
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
layoutScene();
window.addEventListener('load', layoutScene);

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
  if(correctCount === total){
    document.getElementById('win-banner').classList.add('show');
    soundWin(0.4);   // chờ tiếng "đúng" của món cuối kết thúc rồi mới phát
  }
}

function tryPlace(id, zoneEl){
  var item = findItem(id);
  if(!item) return;
  var cardEl = document.getElementById('card-' + id);
  var cat = zoneEl.dataset.cat;

  if(item.cat === cat){
    soundCorrect();
    zoneEl.classList.add('correct-flash');
    setTimeout(function(){ zoneEl.classList.remove('correct-flash'); }, 500);
    popFeedback(zoneEl, '✅');
    var badge = document.createElement('div');
    badge.className = 'placed-badge';
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
}

for(var zi=0; zi<zones.length; zi++){
  (function(zoneEl){
    zoneEl.addEventListener('dragover', function(e){
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
  document.getElementById('win-banner').classList.remove('show');
  var badgeWraps = document.querySelectorAll('.placed-badges');
  for(var i=0;i<badgeWraps.length;i++){ badgeWraps[i].innerHTML = ''; }
  shuffleItems();
  renderTray();
}
