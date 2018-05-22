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
    nicholasTimerResetValue: 299,
    kokoTimerResetValue: 499,
    samTimerResetVAlue: 1999,
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
    dead: false,
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
    this.yPosition = player.yPosition + player.radius;
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
        currentBullet.yPosition--;
    }
}

//  =========  End movement functions Section   =============================================

//   ===========   Collision detection functions   ========================================

function detectCollisionsPlayerHitByEnemy(index) {
    // looks to see if enemy space-ships are colliding with the player  Treats player as square.
    var currentEnemy = assortedGameArrays.enemies[index]
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
            player.dead = true;
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
    if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(radius, 2)) {
        assortedGameArrays.enemies[indexEnemy].dead = true;
    }
}

//   ============   End section of Collision detection functions  =========================

//   ===========   Remove objects that are no longer on the page.   ======================
function removeStrayBullets() {
    // For loop to remove all the player's bullets that have gone off the top
    for (var i = assortedGameArrays.playerBullets.length; i > -1; i--) {
        if (assortedGameArrays.playerBullets[i].yPosition < 1) {
            assortedGameArrays.playerBullets.splice(i, 1);
        }
    }

    //  For loop to remove all the enemy bullets that have gone off the bottom
    for (var i = assortedGameArrays.enemyBullets.length; i > -1; i--) {
        if (assortedGameArrays.enemyBullets[i].yPosition > globalVariables.maxCanvasY) {
            assortedGameArrays.enemyBullets.splice(i, 1);
        }
    }
}

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
function deadEnemies() {
    for (var i = assortedGameArrays.enemies.length; i > -1; i--) {
        if (assortedGameArrays.enemies[i].dead) {
            new Explosion(assortedGameArrays.enemies[i].xPosition, assortedGameArrays.enemies[i].yPosition);
            assortedGameArrays.enemies.splice(i, 1);
        }
    }
}

//  ==========   Function to determine if enemies should spawn
function enemySpawn() {
    globalVariables.timeTillNicholasSpawns--;
    globalVariables.timeTillKokoSpawns--;
    globalVariables.timeTillSamSpawns--;

    //  Check to see if any enemies should spawn:
    if (globalVariables.timeTillNicholasSpawns = 0) {

        //create a Nicholas.   Need to work out some Math

        globalVariables.timeTillNicholasSpawns = globalVariables.nicholasTimerResetValue;
        globalVariables.nicholasTimerResetValue--;
    }

    if (globalVariables.timeTillKokoSpawns = 0) {

        //create a Koko.   Need to work out some Math

        globalVariables.timeTillKokoSpawns = globalVariables.kokoTimerResetValue;
        globalVariables.kokoTimerResetValue--;
    }

    if (globalVariables.timeTillSamSpawns = 0) {

        //create a Sam.   Need to work out some Math

        globalVariables.timeTillSamSpawns = globalVariables.samTimerResetValue;
        globalVariables.samTimerResetValue--;
    }

}

function moveAllTheBullets() {
    //Move player bullets X times, where X = bullet speed.  Check for collisions each time.
    for (var i = 1; i < player.bulletSpeed + 1; i += 2) {
        movePlayerBullets();
        movePlayerBullets();
        for (var j in assortedGameArrays.enemies) {
            for (var k in assortedGameArrays.playerBullets) {
                detectCollisionsEnemyHitByBullet(j, k)
            }
        }
    }

    for (var i = 1; i < player.bulletSpeed + 1; i += 2) {
        moveEnemyBullets();
        moveEnemyBullets();
        detectCollisionsPlayerHitByBullet();  //  For loop to check all enemy bullets needs to go in here
    }
}

function newExplosions() {
    for (var i in assortedGameArrays.enemies) {
        var currentEnemy = assortedGameArrays.enemies[i];
        if (currentEnemy.dead) {
            new Explosion(currentEnemy.xPosition, currentEnemy.yPosition)
        }
    }
}  ////   do I need this?   Double check.

function enemyFire() {
    for (var i in assortedGameArrays.enemies) {
        var currentEnemy = assortedGameArrays.enemies[i];
        if (currentEnemy.gunCooldownTimer < 1) {
            new EnemyBullet(currentEnemy.xPosition, currentEnemy.yPosition);
            currentEnemy.gunCooldownTimer = currentEnemy.gunCooldownTimerResetsTo;
        }
    }
}

//  ===    First draft of infinite while loop.  Put inside a function instead of while loop to keep it from actually running.

function while2equals2() {

    enemySpawn();
    moveAllTheBullets();
    removeStrayBullets();

    movePlayer(DIRECTION_SHIT_FROM_EVENT_LISTENER_GOES_HERE);

    moveEnemies();

    //Explosions:
    checkNRemoveExplosions();

    newExplosions();

    detectCollisionsPlayerHitByEnemy();

    if (player.dead) {
        //  CALL THE ENDGAME FUNCTION HERE
    }

    //  Check to see if any enemies should fire their weapons

    enemyFire();

    //  STILL NEED STUFF TO RE-RENDER THE PAGE

}




// Entire function should be deleted before production.  Exists just to test motion in console.
function createstuff() {

    new Enemy(50, 0, 50, 20, 0, 20, 10, 'no image', 'no type')

}
