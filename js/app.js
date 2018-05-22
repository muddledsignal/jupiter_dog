'use strict';
//    ===================   Objects as global Vars.
var assortedGameArrays = {
    enemies: [],
    enemyBullets: [],
    playerBullets: [],
    explosionLocations: [],
}

var globalVariables = {
    enemyBulletSpeed: 1,
    maxCanvasX: 300,
    maxCanvasY: 500,
    explosionDurationCount: 60,
    timeTillNicholasSpawns: 300,
    timeTillKokoSpawns: 500,
    timeTillSamSpawns: 2000,
}

//  =====================    Object Literal for Player    ======================
var player = {
    xPosition: 400,  // should be Canvas Width /2, to start in the center
    image: 'PlayerImageFileFilepath', //  If player's image changes dynamically.
    gunCooldownTimer: 0,  
    gunCooldownTimerResetsTo: 20,
    score: 0,
    moveSpeed: 10,
    radius: 8,
    bulletSpeed: 6,
    score: 0,
};

player.yPosition = 3,  // globalVariables.maxCanvasY - (5 + this.radius)

//    ========     Constructor Functions for Enemy, Enemy Bullets, and Player Bullets   =======
function Enemy(xPosInitial, xVelocityInitial, xCenterpoint, yPosInital, yVelocityInitial, yCenterpoint, radius, image, type) {
    this.xPosition = xPosInitial;
    this.yPosition = yPosInital;
    this.xVelocity = xVelocityInitial;
    this.yVelocity = yVelocityInitial;
    this.radius = radius;
    this.xCenterpoint = xCenterpoint;  //  Using a f=-kx model to change velocity.
    this.yCenterpoint = yCenterpoint;
    this.image = image;
    this.type = type;
    assortedGameArrays.enemies.push(this);
};

function EnemyBullet(xPosInitial, yPosInital) {
    this.xPosition = xPosInitial;
    this.yPosition = yPosInital;
    this.yVelocity = globalVariables.enemyBulletSpeed; // Math.sqrt(Math.pow(totalVelocity,2) + math.pow(player.yPosition-yPosInitial,2));
    assortedGameArrays.enemyBullets.push(this);
};

function PlayerBullet() {
    this.xPosition = player.xPosition;
    this.yPosition = player.yPosition + player.radius;  
    this.yVelocity = player.bulletSpeed;
    assortedGameArrays.playerBullets.push(this);
};

function Explosion(xPosition, yPosition){
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.count = globalVariables.explosionDurationCount;
    assortedGameArrays.explosionLocations.push(this);
}

//  ========    End Constructor Functions Section      ========================================


//  ===========     Functions to Move all the Objects.    =====================================
function moveEnemies() {
    for (var i in assortedGameArrays.enemies) {
        var currentEnemy = assortedGameArrays.enemies[i];
        //move object
        currentEnemy.xPosition += currentEnemy.xVelocity;
        currentEnemy.yPosition += currentEnemy.yVelocity;

        //calculate velocity at current position  (used next iteration to move objects)
        currentEnemy.xVelocity += (currentEnemy.xCenterpoint - currentEnemy.xPosition);
        currentEnemy.yVelocity += (currentEnemy.yCenterpoint - currentEnemy.yPosition);
    }
}

function moveEnemyBullets() {
    for (var i in assortedGameArrays.enemyBullets) {
        var currentBullet = assortedGameArrays.enemyBullets[i];
        currentBullet.yPosition += currentBullet.yVelocity;
    }
}

function movePlayer(xDirection) {
    player.xPosition += xDirection * player.moveSpeed;
}

function movePlayerBullets() {
    for (var i in assortedGameArrays.playerBullets) {
        var currentBullet = assortedGameArrays.playerBullets[i];
        currentBullet.yPosition -= currentBullet.yVelocity;
    }
}

//  =========  End movement functions Section   =============================================

//   ===========   Collision detection functions   ========================================

function detectCollisionsPlayerHitByEnemy(index) {
    // looks to see if enemy space-ships are colliding with the player

    var currentEnemy = assortedGameArrays.enemies[index]
    //  Is the Y value between Player +/- Radius   (Also, may want to consider including object radius)
    if ((currentEnemy.yPosition > (player.yPosition - player.radius))
        &
        (currentEnemy.yPosition < (player.yPosition + player.radius))) {

        //  Is the x value between Player +/- Radius
        if ((currentEnemy.xPosition > (player.xPosition - player.radius))
            &
            (currentEnemy.xPosition < (player.xPosition + player.radius))) {
            playerDead = true;
            //Run function for when player gets hit by ball of death.
        }
    }
}  //   End looking to see if enemy space ships are colliding with player


function detectCollisionsPlayerHitByBullet(index) {
    var currentBullet = assortedGameArrays.enemyBullets[index];
    if ((currentBullet.yPosition > (player.yPosition - player.radius))
        &
        (currentBullet.yPosition < (player.yPosition + player.radius))) {

        //  Is the x value between Player +/- Radius
        if ((currentBullet.xPosition > (player.xPosition - player.radius))
            &
            (currentBullet.xPosition < (player.xPosition + player.radius))) {
            playerDead = true;
            //Run function for when player gets hit by ball of death.
        }
    }
}

function detectCollisionsEnemyHitByBullet(indexEnemy, indexBullet) {
    
    //  Determine X and Y distance between bullet and center of alien object
    var deltaX = assortedGameArrays.enemies[indexEnemy].xPosition - assortedGameArrays.playerBullets[indexBullet].xPosition;
    var deltaY = assortedGameArrays.enemies[indexEnemy].yPosition - assortedGameArrays.playerBullets[indexBullet].yPosition;
    var radius = assortedGameArrays.enemies[indexEnemy].radius;

    //See if total distance is < radius
    if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(radius,2)) {
        new Explosion (assortedGameArrays.enemies[indexEnemy].xPosition, assortedGameArrays.enemies[indexEnemy].yPosition)
    }
}

//   ============   End section of Collision detection functions  =========================

//   ===========   Remove objects that are no longer on the page.   ======================
function removeStrayBullets(){
    // For loop to remove all the player's bullets that have gone off the top
    for (var i = assortedGameArrays.playerBullets.length; i>-1; i--){
        if (assortedGameArrays.playerBullets[i].yPosition < 1){
            assortedGameArrays.playerBullets.splice(i,1);
        }
    }

    //  For loop to remove all the enemy bullets that have gone off the bottom
    for (var i = assortedGameArrays.enemyBullets.length; i > -1; i--){
        if (assortedGameArrays.enemyBullets[i].yPosition > globalVariables.maxCanvasY){
            assortedGameArrays.enemyBullets.splice(i,1);
        }
    }
}

function checkNRemoveExplosions(){
    for (var i = assortedGameArrays.explosionLocations.length; i > -1; i--){
        if (assortedGameArrays.explosionLocations.count < 1){
            assortedGameArrays.explosionLocations.splice(i,1);
        }
        assortedGameArrays.explosionLocations.count --;
    }
}


// Entire function should be deleted before production.  Exists just to test motion in console.
function createstuff() {

new Enemy (50,0,50,20,0,20, 10, 'no image', 'no type')

}
