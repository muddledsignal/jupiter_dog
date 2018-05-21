'use strict';

var imgBank = new function() {

	this.background = new Image();
	this.background.src = "img/galaxybackground.jpg";
}

function CanvasArea() {
	this.demi = function(x, y) {
		this.x = x;
		this.y = y;
	}
	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.draw = function() {
	};
}

function Background() {
	this.speed = 1;
	this.draw = function() {
		this.y += this.speed;
		this.context.drawImage(imgBank.background, this.x, this.y);
		this.context.drawImage(imgBank.background, this.x, this.y - this.canvasHeight);
		if (this.y >= this.canvasHeight)
			this.y = 0;
	};
}

function animate() {
	requestAnimFrame(animate);
	game.background.draw();
}
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback, element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

Background.prototype = new CanvasArea();

function Game() {

	this.demi = function() {

		this.bgCanvas = document.getElementById('background');
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			this.background = new Background();
			this.background.demi(0,0);
			return true;
		} else {
			return false;
		}
	};
	this.start = function() {
		animate();
	};
}

var game = new Game();
function demi() {
	if(game.demi())
		game.start();
}