'use strict'
//Global variabales
const GRID_SIZE = 60;
var stage, preloadText, queue, levelData, diglettImg, holeImg, allDigletts = [];
var currentLevel = 0,
    points = 0;
var clockTimer, appearTimer, myScore, myTimer;

function preload() {
    stage = new createjs.Stage('canvas');
    preloadText = new createjs.Text("Loading: ", "20px", "#000");
    stage.addChild(preloadText);

    queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    queue.on('progress', progress);
    queue.on('complete', complete);
    queue.loadManifest([{
        id: 'spriteSheet',
        src: 'img/spritesheet.png'
    },
    {
        id: 'startImage',
        src: 'img/start.png'
    },{
        id: 'newLevel',
        src: 'img/newlevel.mp3'
    },{
        id: 'smash',
        src: 'img/smash.mp3'
    },
     {
        id: 'blockJson',
        src: 'json/diglett.json'
    }, {
        id: 'levelData',
        src: 'json/levels.json'
    }]);
}

function progress(e) {
    preloadText.text = Math.round(e.progress * 100) + '%';
    stage.update();
}

function complete() {
    stage.removeChild(preloadText);
    var logo = new createjs.Bitmap("img/logo.png");
    logo.scaleX=0.9;
    logo.scaleY=0.9;
    logo.y = 30;
    stage.addChild(logo);

    var playButton = new createjs.Bitmap("img/start.png");
    playButton.addEventListener("click",setupLevel);
    playButton.x=220;
    playButton.y=240;
    playButton.scaleX=0.07;
    playButton.scaleY=0.07;
    stage.addChild(playButton);




    var instructions = new createjs.Text("Smash 3 digletts before the time runs out!","22px Helvetica", "#000");
    instructions.x = 70;
    instructions.y = 330;
    stage.addChild(instructions);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.on('tick', tock);

}

function tock(e) {
    stage.update(e);
}

function setupLevel() {
    //Cleans the canvas for the next level
    stage.removeAllChildren();
    clearInterval(clockTimer);
    clearInterval(appearTimer);
    allDigletts = [];

    var newLevel = queue.getResult("newLevel");
    createjs.Sound.play("newLevel");


    //Adds score text
    myScore = new createjs.Text("Score : 0", "22px Helvetica", "#000");
    myScore.x = 435;
    myScore.y = 10;
    stage.addChild(myScore);
    //Adds timer text
    myTimer = new createjs.Text("00 : 20", "22px Helvetica", "#000");
    myTimer.x = 10;
    myTimer.y = 10;
    stage.addChild(myTimer);

    if(currentLevel === 3) {
      var congrats = new createjs.Text("Digletts have feelings too.Did you think about that?","22px Helvetica", "#000");
      var congrats2 = new createjs.Text("No. You only think about yourself.","22px Helvetica", "#000");
      congrats.y = 170;
      congrats.x = 10;
      congrats2.y = 210;
      congrats2.x = 10;
      stage.addChild(congrats);
      stage.addChild(congrats2);

      stage.removeChild(myScore);
      stage.removeChild(myTimer);
    }

    //Pulls images from json file
    var sheet = new createjs.SpriteSheet(queue.getResult('blockJson'));

    //Pulls json data for populating the levels
    levelData = queue.getResult("levelData");
    var currentLevelData = levelData.levels[currentLevel].objects;


    for (var i = 0; i < currentLevelData.length; i++) {
        //console.log(currentLevelData[i]);
        var holeLocation = [],
            diglettLocation = [];
        diglettLocation.push(currentLevelData[i].diglett);
        holeLocation.push(currentLevelData[i].hole);

        for (var u = 0; u < holeLocation.length; u++) {
            holeImg = new createjs.Sprite(sheet, 'hole');
            holeImg.x = holeLocation[u].x * GRID_SIZE;
            holeImg.y = holeLocation[u].y * GRID_SIZE;
            stage.addChild(holeImg);
        }


        function diglettAppear() {
            var num = 0;
            appearTimer = window.setInterval(function() {
                // increase by num 1, reset to 0 at 4
                num = (num + 1) % 4;

                if (num < 3) {
                    for (var x = 0; x < allDigletts.length; x++) {
                        stage.removeChild(allDigletts[x]);
                    }
                } else {
                    for (var n = 0; n < allDigletts.length; n++) {
                        stage.addChild(allDigletts[n]);
                    }
                }
            }, 600);
        }


        for (var v = 0; v < diglettLocation.length; v++) {
            diglettImg = new createjs.Sprite(sheet, 'diglett');
            diglettImg.x = diglettLocation[v].x * GRID_SIZE;
            diglettImg.y = diglettLocation[v].y * GRID_SIZE;
            allDigletts.push(diglettImg);

            for (var m = 0; m < allDigletts.length; m++) {
                console.log(allDigletts[m]);
                stage.addChild(allDigletts[m]);
                diglettAppear();
            }

        }

    }

    for (var l = 0; l < allDigletts.length; l++) {
        allDigletts[l].addEventListener("click", getPoints);
    }


    function getPoints() {
        var smash = queue.getResult("smash");
        createjs.Sound.play("smash");
        points++;
        myScore.text = "Score : " + points;

        if (points === 3) {
            points = 0;
            currentLevel++;
            setupLevel();
        }

    }

    function startTimer(duration) {
        var timer = duration,
            minutes, seconds;
        clockTimer = setInterval(function() {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);


            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            myTimer.text = minutes + " : " + seconds;

            if (--timer < 0) {
                timer = 0;
                console.log("time is out");
                currentLevel = 0;
                points = 0;
                setupLevel();
            }
        }, 1000);
    }

    startTimer(20);



}

window.addEventListener('load', preload);
