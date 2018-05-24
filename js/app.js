'use strict';
//    ===================   Objects as global Vars.
var assortedGameArrays = {
    enemies: [],
    enemyBullets: [],
    playerBullets: [],
    explosionLocations: [],
    demis: [],
}

var globalVariables = {
    bulletSpeed: 4,
    maxCanvasX: 1200,
    maxCanvasY: 600,
    explosionDurationCount: 60,
    timeTillNicholasSpawns: 3,
    timeTillKokoSpawns: 3,
    timeTillSamSpawns: 3,
    nicholasTimerResetValue: 140,
    kokoTimerResetValue: 80,
    samTimerResetVAlue: 200,
    mainCanvas: document.getElementById("background"),
    ctx: document.getElementById("background").getContext('2d'),
    enemyRadius: 35,
    motionDelay: 50,
}

//  =====================    Object Literal for Player    ======================
var player = {
    xPosition: 400,  // should be Canvas Width /2, to start in the center
    image: 'PlayerImageFileFilepath',
    gunCooldownTimer: 0,
    gunCooldownTimerResetsTo: 10,
    score: 0,
    radius: 40,
    score: 0,
    dead: false,
    movementDirection: 0,
    tryingToShootGun: false,
    velocity: 20,
    immortal: false,
};

player.yPosition = globalVariables.maxCanvasY - (5 + player.radius); //320

//    ========     Constructor Functions for Enemy, Enemy Bullets, and Player Bullets   =======
function Enemy(xPosInitial, xCenterpoint, yPosInital, yVelocityInitial, yCenterpoint, type) {
    this.xPosition = xPosInitial;
    this.yPosition = yPosInital;
    this.xVelocity = 0;
    this.yVelocity = yVelocityInitial;
    this.xCenterpoint = xCenterpoint;
    this.yCenterpoint = yCenterpoint;
    this.type = type;
    this.dead = false;
    this.gunCooldownTimer = 0
    if (type = 'Nicholas') {
        this.gunCooldownTimerResetsTo = 25;
    }
    else if (type = 'Koko') {
        this.gunCooldownTimerResetsTo = 35;
    }
    else if (type = 'Sam') {
        this.gunCooldownTimerResetsTo = 10;
    }

    assortedGameArrays.enemies.push(this);
};

function EnemyBullet(xPosInitial, yPosInital) {
    this.xPosition = xPosInitial;
    this.yPosition = yPosInital;
    assortedGameArrays.enemyBullets.push(this);
};

function PlayerBullet() {
    this.xPosition = player.xPosition;
    this.yPosition = player.yPosition - player.radius;
    assortedGameArrays.playerBullets.push(this);
};

function Explosion(xPosition, yPosition) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.count = globalVariables.explosionDurationCount;
    assortedGameArrays.explosionLocations.push(this);
}

function Demi(xPosition, yPosition) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    assortedGameArrays.demis.push(this);

}

Demi.prototype.drawDemi = function () {
    var image = document.getElementById('demi')
    globalVariables.ctx.drawImage(image, this.xPosition, this.yPosition, 2 * player.radius, 2 * player.radius)
}


//  ========    End Constructor Functions Section      ========================================


//  ===========     Functions to Move all the Objects.    =====================================
function moveAllEnemies() {
    for (var i in assortedGameArrays.enemies) {
        var currentEnemy = assortedGameArrays.enemies[i];
        //move object
        currentEnemy.xPosition += 0.23 * currentEnemy.xVelocity;
        currentEnemy.yPosition += 0.13 * currentEnemy.yVelocity;

        //calculate velocity at current position  (used next iteration to move objects)
        currentEnemy.xVelocity += 0.1 * (currentEnemy.xCenterpoint - currentEnemy.xPosition);
        currentEnemy.yVelocity += 0.1 * (currentEnemy.yCenterpoint - currentEnemy.yPosition);
    }
}

function moveAllDemis() {
    for (var i in assortedGameArrays.demis) {
        assortedGameArrays.demis[i].yPosition += 3;
    }
}

function moveAllEnemyBullets() {
    for (var i in assortedGameArrays.enemyBullets) {
        var currentBullet = assortedGameArrays.enemyBullets[i];
        currentBullet.yPosition += globalVariables.bulletSpeed;
    }
}

function movePlayer() {
    player.xPosition += player.velocity * player.movementDirection;

    //If player is moving off the page, move him back
    if (player.xPosition < 5 || player.xPosition > globalVariables.maxCanvasX - 5) {
        player.xPosition -= player.velocity * player.movementDirection;
    }
}

function moveAllPlayerBullets() {
    for (var i in assortedGameArrays.playerBullets) {
        var currentBullet = assortedGameArrays.playerBullets[i];
        currentBullet.yPosition -= globalVariables.bulletSpeed;
    }
}

//  =========  End movement functions Section   =============================================

//   ===========   Collision detection functions   ========================================

function detectCollisionsBetweenPlayerAndAllEnemies() {
    for (var i in assortedGameArrays.enemies) {
        // looks to see if enemy space-ships are colliding with the player  Treats player as square.
        var currentEnemy = assortedGameArrays.enemies[i]
        //  Is the Y value between Player +/- Radius   (Also, may want to consider including object radius)
        if ((currentEnemy.yPosition > (player.yPosition - player.radius))
            &
            (currentEnemy.yPosition < (player.yPosition + player.radius))) {

            //  Is the x value between Player +/- Radius
            if ((currentEnemy.xPosition > (player.xPosition - player.radius))
                &
                (currentEnemy.xPosition < (player.xPosition + player.radius))) {
                player.dead = true;
            }
        }
    }
}

function detectCollisionsBetweenPlayerAndAnyBullet() {
    for (var i in assortedGameArrays.enemyBullets) {


        var currentBullet = assortedGameArrays.enemyBullets[i];
        if ((currentBullet.yPosition > (player.yPosition - player.radius))
            &
            (currentBullet.yPosition < (player.yPosition + player.radius))) {

            //  Is the x value between Player +/- Radius
            if ((currentBullet.xPosition > (player.xPosition - player.radius))
                &
                (currentBullet.xPosition < (player.xPosition + player.radius))) {
                player.dead = true;
                //Run function for when player gets hit by ball of death.
            }
        }
    }
}

function detectCollisionsBetweenPlayerAndDemi() {
    for (var i = assortedGameArrays.demis.length -1; i > -1; i--) {

        var currentDemi = assortedGameArrays.demis[i];
        // debugger

        if ((currentDemi.yPosition > (player.yPosition - player.radius * 3))
            &
            (currentDemi.yPosition < (player.yPosition + player.radius * 3))) {

            //  Is the x value between Player +/- Radius
            if ((currentDemi.xPosition > (player.xPosition - player.radius * 3))
                &
                (currentDemi.xPosition < (player.xPosition + player.radius * 3))) {
                assortedGameArrays.demis.splice(i, 1);
            }
        }

    }
}

function detectAllEnemieHitByBullets() {
    for (var i in assortedGameArrays.enemies) {
        for (var j in assortedGameArrays.playerBullets) {



            //  Determine X and Y distance between bullet and center of alien object
            var deltaX = assortedGameArrays.enemies[i].xPosition - assortedGameArrays.playerBullets[j].xPosition;
            var deltaY = assortedGameArrays.enemies[i].yPosition - assortedGameArrays.playerBullets[j].yPosition;
            var radius = globalVariables.enemyRadius;

            //See if total distance is < radius
            if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(radius, 2)) {
                assortedGameArrays.enemies[i].dead = true;
                assortedGameArrays.playerBullets.splice(j, 1);
            }
        }
    }
}

//   ============   End section of Collision detection functions  =========================

//   ===========   Remove objects that are no longer on the page.   ======================

//  This function should run AFTER each time bullets are moved.  It removes bullets that have 
//  run off the edge of the canvas from the array of bullets.
function removeStrayBullets() {
    // For loop to remove all the player's bullets that have gone off the top
    for (var i = assortedGameArrays.playerBullets.length - 1; i > -1; i--) {
        if (assortedGameArrays.playerBullets[i].yPosition < 1) {
            assortedGameArrays.playerBullets.splice(i, 1);
        }
    }
}

function removeStrayDemis() {
    for (var i = assortedGameArrays.demis.length - 1; i > -1; i--) {
        if (assortedGameArrays.demis[i] > globalVariables.maxCanvasY) {
            assortedGameArrays.demis.splice(i, 1);
        }
    }
}

//  For loop to remove all the enemy bullets that have gone off the bottom
for (var i = assortedGameArrays.enemyBullets.length - 1; i > -1; i--) {
    if (assortedGameArrays.enemyBullets[i].yPosition > globalVariables.maxCanvasY) {
        assortedGameArrays.enemyBullets.splice(i, 1);
    }
}


//  This function is currently useless.   Eventually, it will remove explosions from the page
//  that have been displayed for too long.   The fact that it's already written is proof that
//  Trying to code at 1 am is a freaking terrible idea.
function checkNRemoveExplosions() {
    for (var i = assortedGameArrays.explosionLocations.length; i > -1; i--) {
        if (assortedGameArrays.explosionLocations.count < 1) {
            assortedGameArrays.explosionLocations.splice(i, 1);
        }
        assortedGameArrays.explosionLocations.count--;
    }
}

//  =======  End of section dedicated to page cleanup   ==================================

function playerScorePlusPlus(deadEnemyType) {
    if (deadEnemyType === 'Nicholas') {
        player.score += 200;
    }

    if (deadEnemyType === 'Koko') {
        player.score += 50;
    }

    if (deadEnemyType === 'Sam') {
        player.score += 5000;

    }
}

//  ===========    Function to handle Enemies Dying  ========================
function handleAllDeadEnemies() {
    for (var i = assortedGameArrays.enemies.length - 1; i > -1; i--) {
        var currentEnemy = assortedGameArrays.enemies[i];
        if (currentEnemy.dead) {
            // new Explosion(currentEnemy.xPosition, currentEnemy.yPosition);
            var deadEnemy = assortedGameArrays.enemies.splice(i, 1);
            // debugger
            playerScorePlusPlus(deadEnemy[0].type);
            if (deadEnemy[0].type === 'Sam') {
                new Demi(deadEnemy[0].xPosition, deadEnemy[0].yPosition);
            }
        }
    }
}

//   Spawn enemy function determines if the countdown timer for enemy spawns is at 0.
//  If so, it spawns an enemy, resets the timer, and decrements the reset value.
function newEnemyParameters() {

    var newEnemyObject = {
        xPosInitial: Math.random() * (globalVariables.maxCanvasX - 350) + 175,
        xCenterpoint: Math.random() * (globalVariables.maxCanvasX - 800) + 400,
        yPosInitial: Math.random() * (globalVariables.maxCanvasY - 300) + 150,
        yCenterpoint: Math.random() * (globalVariables.maxCanvasY - 400) + 200,
        yVelocityInitial: Math.random() * 30 - 15,
    };

    return newEnemyObject;
}

function spawnEnemies() {
    globalVariables.timeTillNicholasSpawns--;
    globalVariables.timeTillKokoSpawns--;
    globalVariables.timeTillSamSpawns--;

    //  Check to see if any enemies should spawn:
    if (globalVariables.timeTillNicholasSpawns < 1) {
        var parameters = newEnemyParameters();
        new Enemy(parameters.xPosInitial, parameters.xCenterpoint, parameters.yPosInitial, parameters.yVelocityInitial, parameters.yCenterpoint, 'Nicholas', )
        globalVariables.timeTillNicholasSpawns = globalVariables.nicholasTimerResetValue;
        globalVariables.nicholasTimerResetValue--;
    }

    if (globalVariables.timeTillKokoSpawns < 1) {
        var no = newEnemyParameters();
        new Enemy(no.xPosInitial, no.xCenterpoint, no.yPosInitial, no.yVelocityInitial, no.yCenterpoint, 'Koko', )
        globalVariables.timeTillKokoSpawns = globalVariables.kokoTimerResetValue;
        globalVariables.kokoTimerResetValue--;
    }

    if (globalVariables.timeTillSamSpawns < 1) {
        var no = newEnemyParameters();
        new Enemy(no.xPosInitial, no.xCenterpoint, no.yPosInitial, no.yVelocityInitial, no.yCenterpoint, 'Sam', )
        globalVariables.timeTillSamSpawns = globalVariables.samTimerResetValue;
        globalVariables.samTimerResetValue--;
    }
}

//  Enemy Fire function decrements  the gun cooldown timer, then has each enemy
//  Shoot his gun if his timer is 0, and reset timer to max value.
function allEnemiesFireAtWill() {
    //sorry Will!

    for (var i in assortedGameArrays.enemies) {
        var currentEnemy = assortedGameArrays.enemies[i];
        currentEnemy.gunCooldownTimer--;
        if (currentEnemy.gunCooldownTimer < 1) {
            new EnemyBullet(currentEnemy.xPosition, currentEnemy.yPosition);
            currentEnemy.gunCooldownTimer = currentEnemy.gunCooldownTimerResetsTo;
        }
    }
}


//  ==========================   Event Listeners & Event Handlers  =========================
//  Should be inside the not-yet-existant initialize Game function

//  This too should be inside the initialize Game function.   

document.getElementById('table-div').addEventListener('click', mouseWasClicked);

function mouseWasClicked(event) {

    if (event.target.id === 'sara' || event.target.id === 'suzanne' || event.target.id === 'paul' || event.target.id === 'travis') {

        //Player Name is what was clicked on
        player.image = event.target.id;

        //Add event listeners for key presses.
        document.getElementById('body-listener').addEventListener('keyup', keyDepressedEvent); document.getElementById('body-listener').addEventListener('keydown', keyPressedEvent);

        //start the game
        worstSolutionEver();
    }
    else {
        alert('Click on a character you dummy!')
    }
}

function keyPressedEvent(event) {

    if (event.key === 'a') {
        player.movementDirection = -1
    }
    else if (event.key === 'd') {
        player.movementDirection = 1
    }
    else if (event.key === ' ') {
        event.preventDefault();
        player.tryingToShootGun = true;
    }
    else if (event.key === 'p'  && player.immortal === false){
        player.immortal = true;
    }
    else if (event.key === 'p'  && player.immortal === true){
        player.immortal = false;
    }

}

function keyDepressedEvent(event) {
    if (event.key === 'a' || event.key === 'd') {
        player.movementDirection = 0;
    }

    else if (event.key === ' ') {
        player.tryingToShootGun = false;
    }
}

//  Player Shoots gun function is called when player.tryingToShootGun is true.   It checks to see if the player can
//  Shoot his gun.  If he can, he shoots.  Otherwise he doesn't
function playershootsgun() {

    if (player.gunCooldownTimer < 1) {
        new PlayerBullet();
        player.gunCooldownTimer = player.gunCooldownTimerResetsTo;
    }
}

//   ========   Functions that deal with rendering stuff to the page  ===========

//  Resets to a blank canvas.
function createCanvas() {
    var image = document.getElementById('codefellows');
    globalVariables.ctx.drawImage(image, 0, 0, globalVariables.maxCanvasX, globalVariables.maxCanvasY);
}

function drawPlayer() {
    var image = document.getElementById(player.image)
    globalVariables.ctx.drawImage(image, player.xPosition - player.radius, player.yPosition - player.radius, 2 * player.radius + 4, 2 * player.radius + 4);

}
                     
function drawEnemy(currentEnemy) {

    var image = document.getElementById(currentEnemy.type);
    globalVariables.ctx.drawImage(image, currentEnemy.xPosition - globalVariables.enemyRadius, currentEnemy.yPosition - globalVariables.enemyRadius, 2 * globalVariables.enemyRadius + 4, 2 * globalVariables.enemyRadius + 4);

}

function drawBullet(xPosition, yPosition) {
    globalVariables.ctx.fillStyle = "purple";
    globalVariables.ctx.fillRect(xPosition, yPosition, 3, 5);
}

//  ==========  End section on rendering to page

//  =============  handle player death  ============
function playerDied() {

    var scoreObject = {
        score: player.score,
    }

    localStorage.setItem('score', JSON.stringify(player.score));

    //  Go to high scores page
    window.location.href = "score.html"
}

//  ==========   This section is nothing but functions that run other functions.   


function moveEverything() {

    movePlayer();

    moveAllPlayerBullets();

    moveAllEnemyBullets();

    moveAllEnemies();

    moveAllDemis();

    removeStrayBullets();

    removeStrayDemis();
}

function detectEverything() {
    detectAllEnemieHitByBullets();

    detectCollisionsBetweenPlayerAndAllEnemies();

    detectCollisionsBetweenPlayerAndAnyBullet();

    detectCollisionsBetweenPlayerAndDemi();
}

function drawEverything() {
    createCanvas();
    drawPlayer();
    // this for loop draws all of our enemies
    for (var i in assortedGameArrays.enemies) {
        var currentEnemy = assortedGameArrays.enemies[i];
        drawEnemy(currentEnemy);
    }
    // this for loop draws all of our bullets
    for (var i in assortedGameArrays.playerBullets) {

        var currentBullet = assortedGameArrays.playerBullets[i];
        drawBullet(currentBullet.xPosition, currentBullet.yPosition);
    }
    // this for loop draws all the enemy bullets
    for (var i in assortedGameArrays.enemyBullets) {
        var currentBullet = assortedGameArrays.enemyBullets[i];
        drawBullet(currentBullet.xPosition, currentBullet.yPosition);
    }

    for (var i in assortedGameArrays.demis) {
        assortedGameArrays.demis[i].drawDemi();
    }
}

function everythingShoots() {
    if (player.tryingToShootGun) {
        playershootsgun();
    }

    allEnemiesFireAtWill();
}

//  =========   End of functions that run other functions section.


//  ===   draft of infinite while loop.  Put inside a function instead of while loop to keep it from actually running.

function inGame() {

    drawEverything();
    moveEverything();
    detectEverything();

    handleAllDeadEnemies();

    everythingShoots();

    if (player.dead === true && player.immortal === false ) { playerDied() }

    spawnEnemies();
    player.gunCooldownTimer--
}

function worstSolutionEver() {
    inGame();
    setTimeout(worstSolutionEver2, globalVariables.motionDelay);
}

function worstSolutionEver2() {
    inGame();
    setTimeout(worstSolutionEver, globalVariables.motionDelay);
}
