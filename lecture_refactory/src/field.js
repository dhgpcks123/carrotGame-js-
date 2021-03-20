'use strict';

import * as sound from './sound.js';

const CARROT_SIZE = 80;

export const ItemType = Object.freeze({
   carrot: 'carrot',
   bug: 'bug'
})


export class Field {
   constructor(carrotCount, bugCount){
      this.carrotCount = carrotCount;
      this.bugCount = bugCount;
      this.field = document.querySelector('.game__field');
      this.fieldRect = this.field.getBoundingClientRect();
      this.field.addEventListener('click', (event)=>this.onClick(event));
      // this.field.addEventListener('click', this.onClick);
      // this.onClick은 에러남. 클래스의 함수 메서드 전달할 때 this 내용이 전달되지 않음.
      // 여기서 바인딩 개념
      // this.onClick = this.onClick.bind(this);
      // arrowFunction은 이 binding작업을 안해줘도 됨.
      // arrowFunction 쓰는 걸 추천
   }
   init(){
      this.field.innerHTML = '';
      // 벌레와 당근을 생성한 뒤 field에 추가해줌
      this._addItem('carrot', this.carrotCount, 'img/carrot.png');
      this._addItem('bug', this.bugCount, 'img/bug.png');
   }

   setClickListener(onItemClick){
      this.onItemClick = onItemClick;
   }

   //(_)외부에서 부르지 마세요! 의미.
   _addItem(className, count, imgPath){
      const x1 = 0;
      const y1 = 0;
      const x2 = this.fieldRect.width-CARROT_SIZE;
      const y2 = this.fieldRect.height-CARROT_SIZE;
      for( let i = 0; i< count; i++){
         const item = document.createElement('img');
         item.setAttribute('class', className);
         item.setAttribute('src', imgPath);
         item.style.position = 'absolute';
         //item.style.position = 'absoulute';
         const x = randomNumber(x1, x2);
         const y = randomNumber(y1, y2);
         item.style.left = `${x}px`;
         item.style.top = `${y}px`;
         this.field.appendChild(item);
      }
   }

   //onClick = event =>{ //이렇게해도 binding이 자동으로 됨
   onClick(event){
      const target = event.target;
      if(target.matches('.carrot')){
         target.remove();
         sound.playCarrot();
         this.onItemClick && this.onItemClick(ItemType.carrot);
      }else if(target.matches('.bug')){
         this.onItemClick && this.onItemClick(ItemType.bug);
      }
   }

}

function randomNumber(min, max) {
   return Math.random() * (max-min) + min;
}