'use strict';

var Player = {
    xPosition: 'Canvas /2 ',
    gunCooldownTimer: 0,
    image: 'PlayerImageFileFilepath', //  If player's image changes dynamically.
};

function Enemy (xPosInitial, xVelocityInitial, xCenterpoint, yPosInital, yVelocityInitial, yCenterpoint, image, type){
    this.xPosition = xPosInitial;
    this.yPoxition = yPosInital;
    this.xVelocity = xVelocityInitial;
    this.yVelocity = yVelocityInitial;
    this.xCenterpoint = xCenterpoint;
    this.yCenterpoint = yCenterpoint;
    this.image = image;
    this.type = type;
};

function EnemyBullet (xPosInitial, yPosInital, totalVelocity){
    this.xPosition = xPosInitial;
    this.yPoxition = yPosInital;
    this.xVelocity = Math.sqrt(Math.pow(totalVelocity,2) + math.pow(player.xPosition-xPosInitial,2));
    this.yVelocity = Math.sqrt(Math.pow(totalVelocity,2) + math.pow(player.yPosition-yPosInitial,2));
};

function PlayerBullet (xPosInitial, xDirectionFacing, yDirectionFacing){
    this.xPosition = xPosInitial;
    this.yPosition = 0;  // Should actually be Canvas max - 1/2 player image height to put the bottom of the image on the bottom of the page.
    this.yVelocity = 'TBD';  // Need to work out a good bullet velocity
    this.xVelocity = 0; //  Will be something else if we reach stretch goal of aiming with mouse.  
};

