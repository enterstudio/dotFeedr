'use strict';

var utils = require('./utils')
	, Bubble = require('./Bubble')
	, Food = require('./Food')
	, collisionService = require('./collisions')
	, hud = require('./hud')
	, actionService = require('./actions')
	, domReady = utils.domReady;

var c = createjs
	, bubble
	, stage
	, _W
	, _H
	, xCenter
	, yCenter
	, wWidth = 5000
	, wHeight = 5000
	, world
	, canvas
	;

console.log('Start, EaselJS v.:' + c.EaselJS.version);

function prepareWorld() {
	stage = new c.Stage('main');
	world = new c.Container();
	world.x = 0;
	world.y = 0;
	stage.addChild(world);

	bubble = new Bubble('wodCZ', 250, 250);
	world.addChild(bubble);
	for (var i = 0; i<10; i++) {
		var food = new Food(Math.random() * 5000, Math.random() * 5000, Math.min(5,Math.round(Math.random() * 20)));
		world.addChild(food);
	}


}
function updateBackground() {
	var x = world.x,
		y = world.y;

	canvas.style.backgroundPositionX = x + 'px';
	canvas.style.backgroundPositionY = y + 'px';
}
function prepareCanvas() {
	var mainElement = document.getElementById('main');
	mainElement.height = _H = window.innerHeight - 5;
	mainElement.width = _W = window.innerWidth;
	xCenter = _W / 2;
	yCenter = _H / 2;
	hud.init(_W, _H);
}
domReady(function () {

	prepareCanvas();
	prepareWorld();

	stage.addChild(hud.get());

	actionService.init(window, stage, world);
	canvas = stage.canvas;
	c.Ticker.timingMode = c.Ticker.RAF;
	c.Ticker.setFPS(60);

	c.Ticker.addEventListener('tick', function (event) {
		actionService.handleMouse();
		cameraMove();
		updateBackground();
		collisionService.broadastCollisions();
		stage.update();
	})
});

function cameraMove() {
	if (wWidth>_W) {
		if (bubble.x<wWidth - xCenter && bubble.x>xCenter) {
			world.x = -bubble.x + xCenter;
		} else if (bubble.x>=wWidth - xCenter) {
			world.x = -(wWidth - _W)
		} else {
			world.x = 0;
		}
	}
	if (wHeight>_H) {
		if (bubble.y<wHeight - yCenter && bubble.y>yCenter) {
			world.y = -bubble.y + yCenter;
		} else if (bubble.y>=wHeight - yCenter) {
			world.y = -(wHeight - _H);
		} else {
			world.y = 0;
		}
	}
}
