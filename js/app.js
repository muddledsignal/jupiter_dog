'use strict';
//    ===================         Arrays of Stuff   ===========================
var assortedGameArrays = {
    enemies: [],
    bullets: [],
    playerBullets: [],
}

//  =====================    Object Literal for Player    ======================
var Player = {
    xPosition: 'Canvas /2 ',
    gunCooldownTimer: 0,  //   Gets bumped up to a value whenever gun fires.   At 0 can shoot again.
    image: 'PlayerImageFileFilepath', //  If player's image changes dynamically.
    score: 0,
};



//    ========     Constructor Functions for Enemy, Enemy Bullets, and Player Bullets   =======
function Enemy (xPosInitial, xVelocityInitial, xCenterpoint, yPosInital, yVelocityInitial, yCenterpoint, image, type){
    this.xPosition = xPosInitial;
    this.yPoxition = yPosInital;
    this.xVelocity = xVelocityInitial;
    this.yVelocity = yVelocityInitial;
    this.xCenterpoint = xCenterpoint;  //  Using a f=-kx model to change velocity.  Possibly with random numbers, because bad-guys are trying to dodge bullets too.
    this.yCenterpoint = yCenterpoint;
    this.image = image;
    this.type = type;
    assortedGameArrays.enemies.push(this);
};

function EnemyBullet (xPosInitial, yPosInital, totalVelocity){
    this.xPosition = xPosInitial;
    this.yPoxition = yPosInital;
    this.xVelocity = 0;  //  Math.sqrt(Math.pow(totalVelocity,2) + math.pow(player.xPosition-xPosInitial,2));  // Pretty sure this works, but should test with numbers to make sure before implementing.   Alternately, can just have them shoot straight down the Y axis like every other bullet.
    this.yVelocity = totalVelocity; // Math.sqrt(Math.pow(totalVelocity,2) + math.pow(player.yPosition-yPosInitial,2));
    assortedGameArrays.bullets.push(this);
};

function PlayerBullet (xPosInitial, xDirectionFacing, yDirectionFacing){
    this.xPosition = xPosInitial;
    this.yPosition = 0;  // Should actually be gamax - 1/2 player image height to put the bottom of the image on the bottom of the page.
    this.yVelocity = 'TBD';  // Need to work out a good bullet velocity
    this.xVelocity = 0; //  Will be something else if we reach stretch goal of aiming with mouse.  
    assortedGameArrays.playerBullets.push(this);
};

//   Function to Move all the Objects.

