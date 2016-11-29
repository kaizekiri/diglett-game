'use strict'
var stage, preloadText, queue;
function preload(){
  stage = new createjs.Stage('canvas');
  preloadText = new createjs.Text("Loading: ", "20px", "#000");
  stage.addChild(preloadText);

  queue = new createjs.LoadQueue(true);
  queue.installPlugin(createjs.Sound);
  queue.on('progress', progress);
  queue.on('complete', complete);
  queue.loadManifest([
    'img/spritesheet.png',
    {id:'blockJson', src:'json/diglett.json'}
  ]);
}

function progress(e) {
  preloadText.text=Math.round(e.progress*100)+'%';
  stage.update();
}

function complete() {
  stage.removeChild(preloadText);
  setupLevel();
  createjs.Ticker.setFPS(60);
  createjs.Ticker.on('tick', tock);
}

function tock(e) {
  stage.update(e);
}

function setupLevel() {
  console.log("start game");
  var sheet = new createjs.SpriteSheet(queue.getResult('blockJson'));
  console.log(sheet)
  var hole = new createjs.Sprite(sheet, 'hole');
  stage.addChild(hole);
}

window.addEventListener('load', preload);
