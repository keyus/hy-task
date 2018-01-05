import Vue from 'vue';

const documentElement = document.documentElement;
const removeAllTitle = ()=>{
  let arr = document.querySelectorAll('.tooltip');
  arr.length && Array.prototype.forEach.call(arr,(it)=>{
    document.body.removeChild(it);
  })
}
const toolTitle = function (el) {
  if (el === false) {
    removeAllTitle();
    return;
  }
  let style = "border: 1px solid #DEDEDE;" +
    "font-size:13px;" +
    "padding: 3px 5px;" +
    "color:#000;" +
    "border-radius: 2px;" +
    "box-shadow: 2px 3px 7px #bbb;" +
    "background-color: #F2F2F2;" +
    "position: absolute;" +
    "max-width:" + (el.width || "none") + ";" +
    "word-break:break-all;" +
    "z-index: 999999;";

  el.addEventListener('mouseover',(e)=>{
    removeAllTitle();
    let target       = e.target;
        if(!target.title) return ;

    let screenWidth  = documentElement.clientWidth,
        screenHeight = documentElement.clientHeight,
        length 		   = target.title.length,
        clientx      = e.clientX - 20,
        x,
        y;

    if(screenWidth - clientx < 200 && length > 50)  x = `right:${screenWidth - clientx - 10}px;` ;
    else x = `left:${clientx}px;`;

    if(screenHeight - e.clientY < 200)  y  = `bottom:${screenHeight - e.clientY + 20 }px;`;
    else y = `top:${(e.clientY + 20)}px;`;

    let div     = document.createElement('div');
    div.className = 'tooltip';
    div.style     = `${style}${x}${y}`;
    div.innerHTML = `${(target.title)}`;
    document.body.appendChild(div);

  });

  el.addEventListener('mouseout',()=>{
    removeAllTitle();
  })

};

Vue.directive('title', {
  bind: function (el) {
    toolTitle(el)
  },
  unbind: function () {
    toolTitle(false)
  }
})
