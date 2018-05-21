'use strict';

var imgBank = new function () {


    this.background = new Image();
    this.spaceshoot = new Image();
    this.laser = new Image();
    var numImages = 3;
    var numLoaded = 0;
    function imageLoaded() {
        numLoaded++;
        if (numLoaded === numImages) {
            window.demi();
        }
    }
    this.background.onload = function () {
        imageLoaded();
    }
    this.spaceshoot.onload = function () {
        imageLoaded();
    }
    this.laser.onload = function () {
        imageLoaded();
    }

    this.background.src = "img/galaxybackground.jpg";
    this.spaceshoot.src = "img/ship.png";
    this.laser.src = "img/laser.png";

}

function CanvasArea() {
    this.demi = function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.draw = function () {
    };
}

function Background() {
    this.speed = 1;
    this.draw = function () {
        this.y += this.speed;
        this.context.drawImage(imgBank.background, this.x, this.y);
        this.context.drawImage(imgBank.background, this.x, this.y - this.canvasHeight);
        if (this.y >= this.canvasHeight)
            this.y = 0;
    };
}



Background.prototype = new CanvasArea();

function Game() {

    this.demi = function () {

        this.bgCanvas = document.getElementById('background');
        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;
            this.background = new Background();
            this.background.demi(0, 0);
            return true;
        } else {
            return false;
        }
    };
    this.start = function () {
        animate();
    };
}


function animate() {
    requestAnimFrame(animate);
    game.background.draw();
}
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


var game = new Game();
function demi() {
    if (game.demi())
        game.start();
}

function Pool(maxSize) {
	var size = maxSize;
	var pool = [];

	this.demi = function() {
		for (var i = 0; i < size; i++) {
			var laser = new Laser();
			laser.demi(0,0, imgBank.laser.width,
			            imgBank.laser.height);
			pool[i] = laser;
		}
	};

	this.get = function(x, y, speed) {
		if(!pool[size - 1].alive) {
			pool[size - 1].spawn(x, y, speed);
			pool.unshift(pool.pop());
		}
    };
    
	this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
		if(!pool[size - 1].alive &&
		   !pool[size - 2].alive) {
				this.get(x1, y1, speed1);
				this.get(x2, y2, speed2);
			 }
	};

	this.animate = function() {
		for (var i = 0; i < size; i++) {
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
	};
}


function Laser() {
	this.alive = false; 
	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.y -= this.speed;
		if (this.y <= 0 - this.height) {
			return true;
		}
		else {
			this.context.drawImage(imgBank.laser, this.x, this.y);
		}
	};

	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
	};
}
Laser.prototype = new CanvasArea();

function Shoot() {
	this.speed = 3;
	this.laserPool = new Pool(30);
	this.laserPool.demi();
	var fireRate = 15;
	var counter = 0;
	this.draw = function() {
		this.context.drawImage(imgBank.spaceshoot, this.x, this.y);
	};
	this.move = function() {
		counter++;
		if (KEY_STATUS.left || KEY_STATUS.right ||
			KEY_STATUS.down || KEY_STATUS.up) {
			this.context.clearRect(this.x, this.y, this.width, this.height);
			if (KEY_STATUS.left) {
				this.x -= this.speed
				if (this.x <= 0)
					this.x = 0;
			} else if (KEY_STATUS.right) {
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			} else if (KEY_STATUS.up) {
				this.y -= this.speed
				if (this.y <= this.canvasHeight/4*3)
					this.y = this.canvasHeight/4*3;
			} else if (KEY_STATUS.down) {
				this.y += this.speed
				if (this.y >= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			}
			this.draw();
		}
		if (KEY_STATUS.space && counter >= fireRate) {
			this.fire();
			counter = 0;
		}
	};
	this.fire = function() {
		this.laserPool.getTwo(this.x+6, this.y, 3,
		                       this.x+33, this.y, 3);
	};
}
Shoot.prototype = new CanvasArea();

var KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}

var KEY_STATUS = {};
for (var code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
}

document.onkeydown = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}

document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}

function Game() {

	this.demi = function() {

		this.bgCanvas = document.getElementById('background');
		this.shootCanvas = document.getElementById('shoot');
		this.mainCanvas = document.getElementById('main');

		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.shootContext = this.shootCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');

			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			Shoot.prototype.context = this.shootContext;
			Shoot.prototype.canvasWidth = this.shootCanvas.width;
			Shoot.prototype.canvasHeight = this.shootCanvas.height;
			Laser.prototype.context = this.mainContext;
			Laser.prototype.canvasWidth = this.mainCanvas.width;
			Laser.prototype.canvasHeight = this.mainCanvas.height;

			this.background = new Background();
			this.background.demi(0,0);

			this.shoot = new Shoot();

			var shootStartX = this.shootCanvas.width/2 - imgBank.spaceshoot.width;
			var shootStartY = this.shootCanvas.height/4*3 + imgBank.spaceshoot.height*2;
			this.shoot.demi(shootStartX, shootStartY, imgBank.spaceshoot.width,
			               imgBank.spaceshoot.height);
			return true;
		} else {
			return false;
		}
	};
	this.start = function() {
		this.shoot.draw();
		animate();
	};
}

function animate() {
	requestAnimFrame( animate );
	game.background.draw();
	game.shoot.move();
	game.shoot.laserPool.animate();
}