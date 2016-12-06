'use strict'
//Global variabales
const GRID_SIZE = 60;
var stage, preloadText, queue, levelData, diglettImg, holeImg, allDigletts = [];
var currentLevel = 0, points = 0;
var clockTimer, appearTimer, myScore, myTimer;

function preload() {
    //Create a stage based on the canvas properties in index.html for displaying all the elements.
    stage = new createjs.Stage('canvas');
    //Loading screen. Not really useful since program is loading fast.
    preloadText = new createjs.Text("Loading: ", "20px", "#000");
    stage.addChild(preloadText);
    //Loads assets to the variable queue.
    queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    queue.on('progress', progress);
    queue.on('complete', complete);
    queue.loadManifest([{
        id: 'spriteSheet',
        src: 'img/spritesheet.png'
    }, {
        id: 'startImage',
        src: 'img/start.png'
    }, {
        id: 'newLevel',
        src: 'img/newlevel.mp3'
    }, {
        id: 'smash',
        src: 'img/smash.mp3'
    }, {
        id: 'blockJson',
        src: 'json/diglett.json'
    }, {
        id: 'levelJson',
        src: 'json/levels.json'
    }]);
}
//Updates progress text with percentage.
function progress(e) {
    preloadText.text = Math.round(e.progress * 100) + '%';
    stage.update();
}
//When progress is done, then the function complete loads the start screen.
function complete() {
    stage.removeChild(preloadText);
    //Add logo
    var logo = new createjs.Bitmap("img/logo.png");
    logo.scaleX = 0.9;
    logo.scaleY = 0.9;
    logo.y = 30;
    stage.addChild(logo);
    //Add playButton with a click listener that runs setupLevel.
    var playButton = new createjs.Bitmap("img/start.png");
    playButton.addEventListener("click", setupLevel);
    playButton.x = 220;
    playButton.y = 240;
    playButton.scaleX = 0.07;
    playButton.scaleY = 0.07;
    stage.addChild(playButton);
    //Adds game description.
    var instructions = new createjs.Text("Smash 3 digletts before the time runs out!", "22px Helvetica", "#000");
    instructions.x = 70;
    instructions.y = 330;
    stage.addChild(instructions);
    //Sets the frames per second to 60.
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on('tick', tock);
}
//Updates the program according to FPS.
function tock(e) {
    stage.update(e);
}

function setupLevel() {
    //Cleans the canvas for the next level
    stage.removeAllChildren();
    clearInterval(clockTimer);
    clearInterval(appearTimer);
    allDigletts = [];
    //Get newLevel sound and plays it when setupLevel loads.
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
    //If the game completes the last level we want it to load a final message to the player.
    if (currentLevel === 3) {
        var congrats = new createjs.Text("Digletts have feelings too.Did you think about that?", "22px Helvetica", "#000");
        var congrats2 = new createjs.Text("No. You only think about yourself.", "22px Helvetica", "#000");
        congrats.y = 10; //and more
        congrats.x = 10;
        congrats2.y = 210;
        congrats2.x = 10;
        stage.addChild(congrats);
        stage.addChild(congrats2);

        stage.removeChild(myScore);
        stage.removeChild(myTimer);
    }

    //Pulls images from json file!
    var sheet = new createjs.SpriteSheet(queue.getResult('blockJson'));

    //Pulls json data for populating the levels
    levelData = queue.getResult("levelJson");
    var currentLevelData = levelData.levels[currentLevel].objects;

    //Loops through the objects of each level in the Json file.
    for (var i = 0; i < currentLevelData.length; i++) {
        //Creates two arrays to store the location for all holes and digletts.
        var holeLocation = [],
            diglettLocation = [];
        diglettLocation.push(currentLevelData[i].diglett);
        holeLocation.push(currentLevelData[i].hole);
        //Loops through the holeLocation[] and adds the holeImg for each element.
        for (var u = 0; u < holeLocation.length; u++) {
            holeImg = new createjs.Sprite(sheet, 'hole');
            holeImg.x = holeLocation[u].x * GRID_SIZE;
            holeImg.y = holeLocation[u].y * GRID_SIZE;
            stage.addChild(holeImg);
        }
        //This function makes diglett appear randomized-ish.
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
        //Loops through the diglettLocation[] and adds the diglettImg for each element.
        //Note: We pushed the location of some digletts outside of the canvas to hide them.
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
    //This makes all digletts clickable and calls getPoints.
    for (var l = 0; l < allDigletts.length; l++) {
        allDigletts[l].addEventListener("click", getPoints);
    }
    //Plays a sound and update the score.
    function getPoints() {
        var smash = queue.getResult("smash");
        createjs.Sound.play("smash");
        points++;
        myScore.text = "Score : " + points;
        //setupLevel will be called if player reaches 3 points.
        if (points === 3) {
            points = 0;
            currentLevel++;
            setupLevel();
        }
    }
    //Makes the clock count down.
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
