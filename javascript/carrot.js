'use strict';

const pause = document.querySelector('.component__pause');
const area = document.querySelector('.component__area');
const playBtn = document.querySelector('.playBtn');
const popUp = document.querySelector('.pop-up');
const popUpMsg = document.querySelector('.pop-up__message');
const refresh = document.querySelector('.pop-up__refresh');
let timer = document.querySelector('.component__timer-time');
let count = document.querySelector('.component__count-no');

const carrotSound = new Audio('/sound/carrot_pull.mp3');
const alertSound = new Audio('/sound/alert.wav');
const bgSound = new Audio('/sound/bg.mp3');
const bugSound = new Audio('/sound/bug_pull.mp3');
const winSound = new Audio('/sound/game_win.mp3');

const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const TIMER_COUNT = 5;
let score = 0;
let start = false;
let timerCnt = undefined;

//게임 init
function initGame() {
   pause.setAttribute('style', 'visibility:visible');
   claerItem();
   makeItem('carrot', CARROT_COUNT, '/img/carrot.png');
   makeItem('bug', BUG_COUNT, '/img/bug.png');
   setTimer();
   score = 0;
   setScore(score);
   playSound(bgSound);
}

//Game 승리!
function GameWin() {
   stopTimer();
   openPopup('Win!');
   playSound(winSound);
   stopSound(bgSound);
}
//Game 패배!
function GameLose() {
   stopTimer();
   openPopup('Retry?');
   playSound(alertSound);
   stopSound(bgSound);
}

// area의 위치 값 랜덤으로 생성
function makeRandomValue(area) {
   const x1 = 0;
   const y1 = 0;
   const x2 = area.getBoundingClientRect().width - 60;
   const y2 = area.getBoundingClientRect().height - 60;
   const randomValue = {
      x: Math.random() * (x2 - x1) + x1 - area.getBoundingClientRect().left,
      y: Math.random() * (y2 - y1) + y1,
   };
   return randomValue;
}

// item  만들기 함수
function makeItem(className, count, path) {
   for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', path);
      const randomValue = makeRandomValue(area);
      item.setAttribute(
         'style',
         `transform: translate(${randomValue.x}px, ${randomValue.y}px);`
      );
      area.appendChild(item);
   }
}

// timer 설정
function setTimer() {
   let remainingTimeSec = TIMER_COUNT;
   updateTimerText(remainingTimeSec);
   timerCnt = setInterval(() => {
      if (remainingTimeSec <= 0) {
         clearInterval(timerCnt);
         GameLose();
         return;
      }
      updateTimerText(--remainingTimeSec);
   }, 1000);
}

function updateTimerText(time) {
   const seconds = time % 60;
   timer.innerText = `0:${seconds}`;
}
function stopTimer() {
   clearInterval(timerCnt);
}

// count 설정
function setScore(score) {
   count.textContent = score;
   if (score == CARROT_COUNT) {
      GameWin();
   }
}

// 팝업 열기
function openPopup(msg) {
   popUpMsg.textContent = msg;
   pause.setAttribute('style', 'visibility:hidden');
   popUp.classList.remove('pop-up--hide');
   start = true;
}
//팝업 지우기
function closePopup() {
   popUp.classList.add('pop-up--hide');
}

//화면에 보이는 모든 item 지우기
function claerItem() {
   area.innerHTML = '';
}

//pasue 버튼 클릭 이벤트
pause.addEventListener('click', () => {
   if (start) {
      start = false;
      GameLose();
      pause.setAttribute('style', 'visibility:hidden');
   } else {
      start = true;
      initGame();
      count.textContent = 0;
      playBtn.setAttribute('class', 'playBtn fas fa-pause');
   }
});

// 아이템 클릭 이벤트
area.addEventListener('click', function itemClick(event) {
   const target = event.target;
   if (target.matches('.carrot')) {
      playSound(carrotSound);
      score++;
      setScore(score);
      target.remove();
   } else if (target.matches('.bug')) {
      playSound(bugSound);
      GameLose();
   }
});

//retry 클릭 이벤트
refresh.addEventListener('click', () => {
   closePopup();
   initGame();
});

//사운드 재생
function playSound(sound) {
   sound.currentTime = 0;
   sound.play();
}
//사운드 정지
function stopSound(sound) {
   sound.pause();
}
