// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

(function(window){
  "use strict";

  var canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d'),
    playing = false,
    // Constants
    PI = Math.PI,
    WIDTH = document.body.clientWidth -4,
    HEIGHT = document.body.clientHeight -4;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;



  /**************************************************/
  /*
  /* Audio
  /*
  /**************************************************/
  var sheep = document.createElement('audio');
  sheep.preload = true;
  sheep.src = 'audio/sheep.mp3'; //http://soundbible.com/520-Sheep-Bleating.html



  var player = {
    name: 'Kermit',
    direction: 2,
    pos: {
      x: 10,
      y: 10
    },
    img: new Image(),
    history: [],
    stepSpeed: 4,
    step: function() {
      if(this.direction == 1){
        this.pos.y -= this.stepSpeed;
      }else if(this.direction == 2){
        this.pos.x += this.stepSpeed;
      }else if(this.direction == 3){
        this.pos.y += this.stepSpeed;
      }else if(this.direction == 4){
        this.pos.x -= this.stepSpeed;
      }

      if(this.pos.x > WIDTH){
        this.pos.x = 0;
      }else if(this.pos.x < -5){
        this.pos.x = WIDTH;
      }else if(this.pos.y > HEIGHT){
        this.pos.y = 0;
      }else if(this.pos.y < -5){
        this.pos.y = HEIGHT;
      }
      this.history.push({x: this.pos.x, y: this.pos.y});
    }
  };

  var sprite = {
    x: 32,
    y: 32,
    height: 32,
    width: 32,
    direction: function(key){
      if(key == 'top'){
        this.change(32, 0);
      }else if(key == 'bottom'){
        this.change(0, 0);
      }else if(key == 'left'){
        this.change(0, 32);
      }else if(key == 'right'){
        this.change(32, 32);
      }
    },
    change: function(x, y){
      this.x = x;
      this.y = y;
    }
  };

  // left 37, top 38, right 39, bottom 40, space 32
  var stepSpeed = 10;
  var tap = false;
  window.addEventListener("keydown", changeDirection, false);
  document.addEventListener('touchstart', function(){
    tap = true;
    playing = playing ? false : true;
    window.addEventListener('deviceorientation', changeDirection, false);
  }, false);

  function changeDirection(e) {

    if(tap === true && window.DeviceOrientationEvent) {
      if(e.beta < 0 && Math.abs(e.beta) > Math.abs(e.gamma)){
        e.keyCode = 38;
      }else if(e.beta > 0 && Math.abs(e.beta) > Math.abs(e.gamma)){
        e.keyCode = 40;
      }else if(e.gamma > 0 && Math.abs(e.gamma) > Math.abs(e.beta)){
        e.keyCode = 39;
      }else if(e.gamma < 0 && Math.abs(e.gamma) > Math.abs(e.beta)){
        e.keyCode = 37;
      }
    }
    // pause
    if(e.keyCode == 32){
      playing = playing ? false : true;
    }
    if(e.keyCode == 37){
      player.direction = 4;
      sprite.direction('left');
    }else if(e.keyCode == 39){
      player.direction = 2;
      sprite.direction('right');
    }else if(e.keyCode == 38){
      player.direction = 1;
      sprite.direction('top');
    }else if(e.keyCode == 40){
      player.direction = 3;
      sprite.direction('bottom');
    }
  }
  


  // Render the view
  function render(){
    canvas.width = canvas.width;
    //ctx.clearRect(0,0,WIDTH,HEIGHT);
    ctx.moveTo(10,10);
    var i, hi = player.history.length;
    for( i = 0; i < (hi-1); i++){
      ctx.lineTo(player.history[i].x + 16, player.history[i].y + 16);
      if(player.pos.x == player.history[i].x && player.pos.y == player.history[i].y){
        window.console.log(player.pos.x +'-'+ player.pos.y);
        sheep.play();
        playing = false;
      }
    }
    ctx.stroke();

    player.step();

    //canvas.height = canvas.height;
    //ctx.arc(player.pos.x, player.pos.y, 5, 0, 2*PI);
    ctx.drawImage(player.img, sprite.x, sprite.y, sprite.width, sprite.height, player.pos.x, player.pos.y, sprite.width, sprite.height);
    //ctx.fill();
  }

  // start the loop
  function animloop(){
    window.requestAnimFrame(animloop);
    if(playing){
      render();
    }
  }



  player.img.onload = function() {
    animloop();
  };
  player.img.src = 'images/tiles.png'; // http://opengameart.org/content/livestock-0



}(window));






