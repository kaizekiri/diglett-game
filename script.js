'use strict'
const GRID_SIZE = 60;
var stage, preloadText, queue, currentLevel=0, points=0;
function preload(){
  stage = new createjs.Stage('canvas');
  preloadText = new createjs.Text("Loading: ", "20px", "#000");
  stage.addChild(preloadText);

  queue = new createjs.LoadQueue(true);
  queue.installPlugin(createjs.Sound);
  queue.on('progress', progress);
  queue.on('complete', complete);
  queue.loadManifest([
    {id:'spriteSheet', src:'img/spritesheet.png'},
    {id:'blockJson', src:'json/diglett.json'},
    {id:'levelData', src:'json/levels.json'}
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
    var myScore = new createjs.Text("Score : 0","22px Helvetica","#000");
    myScore.x = 400;
    stage.addChild(myScore);
  var levelData = queue.getResult("levelData");
  var sheet = new createjs.SpriteSheet(queue.getResult('blockJson'));
  var hole = new createjs.Sprite(sheet, 'hole');
  var diglett = new createjs.Sprite(sheet, 'diglett');
  var instance = new createjs.Sprite(sheet);
  var holeLocation = levelData.levels[currentLevel].hole;
  var diglettLocation = levelData.levels[currentLevel].diglett;

  hole.x = holeLocation.x * GRID_SIZE;
  hole.y = holeLocation.y * GRID_SIZE;

  diglett.x = diglettLocation.x * GRID_SIZE;
  diglett.y = diglettLocation.y * GRID_SIZE;

    stage.addChild(hole);


    var num = 0;
    window.setInterval(function () {
        // increase by num 1, reset to 0 at 4
        num = (num + 1) % 4;

        if(num<3){
        /*instance.gotoAndStop("hole");
        stage.addChild(instance);*/
        stage.removeChild(diglett);

        } else {
            /*instance.gotoAndStop("diglett");
            stage.addChild(instance);*/
            stage.addChild(diglett);

        }
    }, 500);

  diglett.addEventListener("click", getPoints);

  function getPoints() {

      console.log("Please dont kill me");
      points++;
      myScore.text = "Score : " + points;


  }






/*
var i = 10;

while (i > 0) {

switch (0.3<Math.random()) {
  case true:
    setTimeout(function() {
      stage.removeChild(diglett);
      stage.addChild(hole);
      instance.gotoAndStop("hole");
      console.log("show hole");
      stage.addChild(instance);
    }, 500);
    i--;
     break;

  case false:
  setTimeout(function() {
    stage.removeChild(hole);
    stage.addChild(diglett);
    instance.gotoAndStop("diglett");
    console.log("show diglett");
    stage.addChild(instance);
  }, 500);
  i--;
  break;
}
}
*/


}

window.addEventListener('load', preload);
