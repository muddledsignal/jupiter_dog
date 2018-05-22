'use strict';
//    ===================   Objects as global Vars.
var assortedGameArrays = {
    enemies: [],
    enemyBullets: [],
    playerBullets: [],
}

var globalVariables = {
    enemyBulletSpeed = 1
}

//  =====================    Object Literal for Player    ======================
var player = {
    xPosition: 400,  // should be Canvas Width /2, to start in the center
    yPosition: 8,
    gunCooldownTimer: 0,  //   Gets bumped up to a value whenever gun fires.   At 0 can shoot again.
    image: 'PlayerImageFileFilepath', //  If player's image changes dynamically.
    score: 0,
    moveSpeed: 10,
    radius: 8,
};



//    ========     Constructor Functions for Enemy, Enemy Bullets, and Player Bullets   =======
function Enemy(xPosInitial, xVelocityInitial, xCenterpoint, yPosInital, yVelocityInitial, yCenterpoint, image, type) {
    this.xPosition = xPosInitial;
    this.yPosition = yPosInital;
    this.xVelocity = xVelocityInitial;
    this.yVelocity = yVelocityInitial;
    this.xCenterpoint = xCenterpoint;  //  Using a f=-kx model to change velocity.
    this.yCenterpoint = yCenterpoint;
    this.image = image;
    this.type = type;
    assortedGameArrays.enemies.push(this);
};

function EnemyBullet(xPosInitial, yPosInital, totalVelocity) {
    this.xPosition = xPosInitial;
    this.yPosition = yPosInital;
    this.xVelocity = 0;  //  Math.sqrt(Math.pow(totalVelocity,2) + math.pow(player.xPosition-xPosInitial,2));  // Pretty sure this works, but should test with numbers to make sure before implementing.   Alternately, can just have them shoot straight down the Y axis like every other bullet.
    this.yVelocity = totalVelocity; // Math.sqrt(Math.pow(totalVelocity,2) + math.pow(player.yPosition-yPosInitial,2));
    assortedGameArrays.enemyBullets.push(this);
};

function PlayerBullet(xPosInitial, xDirectionFacing, yDirectionFacing) {
    this.xPosition = xPosInitial;
    this.yPosition = 0;  // Should actually be gamax - 1/2 player image height to put the bottom of the image on the bottom of the page.
    this.yVelocity = 'TBD';  // Need to work out a good bullet velocity
    this.xVelocity = 0; //  Will be something else if we reach stretch goal of aiming with mouse.  
    assortedGameArrays.playerBullets.push(this);
};

//   Function to Move all the Objects.
function moveAll() {
    moveEnemies();
    moveEnemyBullets();
    movePlayer();
}

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
        currentBullet.yPosition -= currentBullet.yVelocity;
    }
}

function movePlayer(xDirection) {
    player.xPosition += xDirection * player.moveSpeed;
}

function detectCollisions() {
    var playerDead = false;

    // look to see if enemy space-ships are colliding with the player
    for (var i in assortedGameArrays.enemies) {
        currentEnemy = assortedGameArrays.enemies[i]

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


    //  Look to see if the player has been hit by an enemy bullet.
    for (var i in assortedGameArrays.enemyBullets){
        currentBullet = assortedGameArrays.enemyBullets[i];
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
}

    // Entire function should be deleted before production.  Exists just to test motion in console.
    function createstuff() {
        new Enemy(500, -5, 400, 300, -30, 400, 'no image', 'Samwise');
        new Enemy(200, 30, 180, 800, 0, 600, 'no image', 'Nicholas');

        new EnemyBullet(500, 300, 100);
        new EnemyBullet(200, 800, 100);
    }