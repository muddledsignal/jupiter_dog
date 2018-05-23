'use strict';
//    ===================   Objects as global Vars.
var assortedGameArrays = {
    enemies: [],
    enemyBullets: [],
    playerBullets: [],
    explosionLocations: [],
}

var globalVariables = {
    enemyBulletSpeed: 5,
    maxCanvasX: 1200,
    maxCanvasY: 600,
    explosionDurationCount: 60,
    timeTillNicholasSpawns: 1,
    timeTillKokoSpawns: 1,
    timeTillSamSpawns: 1,
    nicholasTimerResetValue: 300,
    kokoTimerResetValue: 500,
    samTimerResetVAlue: 2000,
    mainCanvas: document.getElementById("background"),
    ctx: document.getElementById("background").getContext('2d'),
    enemyRadius: 30,
}

//  =====================    Object Literal for Player    ======================
var player = {
    xPosition: 400,  // should be Canvas Width /2, to start in the center
    image: 'PlayerImageFileFilepath', //  If player's image changes dynamically.
    gunCooldownTimer: 0,
    gunCooldownTimerResetsTo: 20,
    score: 0,
    moveSpeed: 10,
    radius: 30,
    bulletSpeed: 200, // apparently not being used
    score: 0,
    dead: false,
    movementDirection: 0,
    shootsgun: false,
    velocity: 50,
};

player.yPosition = globalVariables.maxCanvasY - (5 + player.radius); //320

//    ========     Constructor Functions for Enemy, Enemy Bullets, and Player Bullets   =======
function Enemy(xPosInitial, xCenterpoint, yPosInital, yVelocityInitial, yCenterpoint, image, type) {
    this.xPosition = xPosInitial;
    this.yPosition = yPosInital;
    this.xVelocity = 0;
    this.yVelocity = yVelocityInitial;
    this.xCenterpoint = xCenterpoint;
    this.yCenterpoint = yCenterpoint;
    this.image = image;
    this.type = type;
    this.dead = false;
    this.gunCooldownTimer = 0
    if (type = 'Nicholas') {
        this.gunCooldownTimerResetsTo = 20;
    }
    else if (type = 'Koko') {
        this.gunCooldownTimerResetsTo = 30;
    }
    else if (type = 'Sam') {
        this.gunCooldownTimerResetsTo = 10;
    }

    assortedGameArrays.enemies.push(this);
};

function EnemyBullet(xPosInitial, yPosInital) {
    this.xPosition = xPosInitial;
    this.yPosition = yPosInital;
    this.yVelocity = globalVariables.enemyBulletSpeed;
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

//  ========    End Constructor Functions Section      ========================================


//  ===========     Functions to Move all the Objects.    =====================================
function moveAllEnemies() {
    for (var i in assortedGameArrays.enemies) {
        var currentEnemy = assortedGameArrays.enemies[i];
        //move object
        currentEnemy.xPosition += 0.2*currentEnemy.xVelocity;
        currentEnemy.yPosition += 0.2*currentEnemy.yVelocity;

        //calculate velocity at current position  (used next iteration to move objects)
        currentEnemy.xVelocity += 0.1*(currentEnemy.xCenterpoint - currentEnemy.xPosition);
        currentEnemy.yVelocity += 0.1*(currentEnemy.yCenterpoint - currentEnemy.yPosition);
    }
}

function moveAllEnemyBullets() {
    for (var i in assortedGameArrays.enemyBullets) {
        var currentBullet = assortedGameArrays.enemyBullets[i];
        currentBullet.yPosition += currentBullet.yVelocity;
    }
}

function movePlayer() {
    player.xPosition += player.velocity * player.movementDirection;
}

function moveAllPlayerBullets() {
    for (var i in assortedGameArrays.playerBullets) {
        var currentBullet = assortedGameArrays.playerBullets[i];
        currentBullet.yPosition--;
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

    //  For loop to remove all the enemy bullets that have gone off the bottom
    for (var i = assortedGameArrays.enemyBullets.length - 1; i > -1; i--) {
        if (assortedGameArrays.enemyBullets[i].yPosition > globalVariables.maxCanvasY) {
            assortedGameArrays.enemyBullets.splice(i, 1);
        }
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

//  ===========    Function to handle Enemies Dying  ========================
function handleAllDeadEnemies() {
    for (var i = assortedGameArrays.enemies.length - 1; i > -1; i--) {
        var currentEnemy = assortedGameArrays.enemies[i];
        if (currentEnemy.dead) {
            // new Explosion(currentEnemy.xPosition, currentEnemy.yPosition);
            assortedGameArrays.enemies.splice(i, 1);
        }
    }
}

//   Spawn enemy function determines if the countdown timer for enemy spawns is at 0.
//  If so, it spawns an enemy, resets the timer, and decrements the reset value.
function newEnemyParameters(){

    var newEnemyObject = {
    xPosInitial: Math.random()*(globalVariables.maxCanvasX-300)+150,
    xCenterpoint: Math.random()*(globalVariables.maxCanvasX-800)+400,
    yPosInitial: Math.random()*(globalVariables.maxCanvasY-300)+150,
    yCenterpoint: Math.random()*(globalVariables.maxCanvasY-400)+200,
    yVelocityInitial: Math.random()*15,};

    return newEnemyObject;
}

function spawnEnemies() {
    globalVariables.timeTillNicholasSpawns--;
    globalVariables.timeTillKokoSpawns--;
    globalVariables.timeTillSamSpawns--;
    var no = newEnemyParameters();


    //  Check to see if any enemies should spawn:
    if (globalVariables.timeTillNicholasSpawns = 0) {

        new Enemy(no.xPosInitial, no.xCenterpoint, no.yPosInitial, no.yVelocityInitial, no.yCenterpoint, 'Nicholas Filepath', 'Nicholas', )
        globalVariables.timeTillNicholasSpawns = globalVariables.nicholasTimerResetValue;
        globalVariables.nicholasTimerResetValue--;
    // }

    if (globalVariables.timeTillKokoSpawns = 0) {

        new Enemy(no.xPosInitial, no.xCenterpoint, no.yPosInitial, no.yVelocityInitial, no.yCenterpoint, 'Koko Filepath', 'Koko', )
        globalVariables.timeTillKokoSpawns = globalVariables.kokoTimerResetValue;
        globalVariables.kokoTimerResetValue--;
    }

    if (globalVariables.timeTillSamSpawns = 0) {

        new Enemy(no.xPosInitial, no.xCenterpoint, no.yPosInitial, no.yVelocityInitial, no.yCenterpoint, 'Sam Filepath', 'Sam', )
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
document.getElementById('body-listener').addEventListener('keydown', keyPressedEvent);  //  Should be inside the not-yet-existant initialize Game function

document.getElementById('body-listener').addEventListener('keyup', keyDepressedEvent);  //  This too should be inside the initialize Game function.   

function keyPressedEvent(event) {

    if (event.key === 'a') {
        player.movementDirection = -1
    }
    else if (event.key === 'd') {
        player.movementDirection = 1
    }
    else if (event.key === ' ') {
        player.shootsgun = true
    }

}

function keyDepressedEvent(event) {
    if (event.key === 'a' || event.key === 'd') {
        player.movementDirection = 0
    }
}

//  Player Shoots gun function is called when player.shootsgun is true.   It checks to see if the player can
//  Shoot his gun.  If he can, he shoots.  Otherwise he doesn't
function playershootsgun() {
    player.shootsgun = false

    if (player.gunCooldownTimer < 1) {
        new PlayerBullet();
        player.gunCooldownTimer = player.gunCooldownTimerResetsTo;
    }
}

//   ========   Functions that deal with rendering stuff to the page  ===========

//  Resets to a blank canvas.
function createCanvas() {
    globalVariables.ctx.fillStyle = 'white';
    globalVariables.ctx.fillRect(0, 0, 1200, 600);
}

function drawPlayer() {
    globalVariables.ctx.fillStyle = 'green';
    globalVariables.ctx.fillRect(player.xPosition - player.radius, player.yPosition - player.radius, 2 * player.radius, 2 * player.radius);

}

function drawEnemy(xPosition, yPosition) {
    globalVariables.ctx.fillStyle = 'red';
    globalVariables.ctx.fillRect(xPosition - player.radius, yPosition - player.radius, 2 * player.radius, 2 * player.radius);

    /*     globalVariables.ctx.fillStyle = 'red';
    var enemyRadius = globalVariables.enemyRadius;
    globalVariables.ctx.arc(xPosition, yPosition, enemyRadius, 0, 2 * Math.PI);
    globalVariables.ctx.fill(); */
    //  Changed to drawing squares because the fill was god-awful. when objects move
}

function drawBullet(xPosition, yPosition) {
    globalVariables.ctx.fillStyle = "purple";
    globalVariables.ctx.fillRect(xPosition, yPosition, 3, 5);
}

//  ==========  End section on rendering to page

//  ==========   This section is nothing but functions that run other functions.   


function moveEverything() {

    movePlayer();

    moveAllPlayerBullets();

    moveAllEnemyBullets();

    moveAllEnemies();

    removeStrayBullets();
}

function detectEverything() {
    detectAllEnemieHitByBullets();

    detectCollisionsBetweenPlayerAndAllEnemies();

    detectCollisionsBetweenPlayerAndAnyBullet();
}

function drawEverything() {
    createCanvas();
    drawPlayer();
    // this for loop draws all of our enemies
    for (var i in assortedGameArrays.enemies) {
        var currentEnemy = assortedGameArrays.enemies[i];
        drawEnemy(currentEnemy.xPosition, currentEnemy.yPosition);
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
}

function everythingShoots(){
    if (player.shootsgun) {
        playershootsgun();
    }

    allEnemiesFireAtWill();
}

//  =========   End of functions that run other functions section.


new Enemy(100, 500, 300, -100, 280, 20, 'no-image', 'nicholas');


//  ===   draft of infinite while loop.  Put inside a function instead of while loop to keep it from actually running.

function inGame() {

    drawEverything();
    moveEverything();
    detectEverything();

    handleAllDeadEnemies();

    everythingShoots();
    
    //  Is the Player dead?
    if (player.dead) {
        console.log('damn');
    }
   
}
