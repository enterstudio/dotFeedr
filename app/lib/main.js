'use strict';

var utils = require('./utils')
	, Bubble = require('./Bubble')
	, Food = require('./Food')
	, Enemy = require('./Enemy')
	, actionService = require('./actions')
	, socketService = require('./socket')
	, domReady = utils.domReady;

var c = createjs
	, bubble
	, stage
	, _W
	, _H
	, xCenter
	, yCenter
	, wWidth
	, wHeight
	, world
	, canvas
	, feed = []
	, localEnemies = {}
	;

console.log('Start, EaselJS v.:' + c.EaselJS.version);

function prepareWorld(width, height, localFeed, enemies) {
	wWidth = width;
	wHeight = height;

	stage = new c.Stage('main');

	stage.enableMouseOver();
	c.Touch.enable(stage);

	world = new c.Container();
	world.x = 0;
	world.y = 0;
	stage.addChild(world);

	for (var foodKey in localFeed) {
		if (localFeed.hasOwnProperty(foodKey)) {
			var food = localFeed[foodKey];
			createFood(food);
		}
	}

	redrawEnemies(enemies);

}

function redrawEnemies(enemies) {
	for (var key in enemies) {
		if (enemies.hasOwnProperty(key)) {
			var enemy = enemies[key];
			createEnemy(enemy);
		}
	}

}



function updateBackground() {
	var x = world.x,
		y = world.y;

	if (!c.Touch.isSupported()) {
		canvas.style.backgroundPositionX = x + 'px';
		canvas.style.backgroundPositionY = y + 'px';
	}
}



function prepareCanvas() {
	var mainElement = document.getElementById('main');
	mainElement.height = _H = window.innerHeight - 5;
	mainElement.width = _W = window.innerWidth;
	xCenter = _W / 2;
	yCenter = _H / 2;
}


domReady(function () {
	socketService.init();

	socketService.get().on('init', function (data) {

		bubble = new Bubble(data.bubble);
		prepareCanvas();
		prepareWorld(data.world.width, data.world.height, data.feed, data.bubbles);

		world.addChild(bubble);

		actionService.init(window, stage, world);



		canvas = stage.canvas;
		c.Ticker.timingMode = c.Ticker.RAF;
		c.Ticker.setFPS(30);
		if (!c.Touch.isSupported()) {
			c.Ticker.setFPS(60);
		}

		c.Ticker.addEventListener('tick', function (event) {
			if (bubble) {
				actionService.handleMouse();
				cameraMove();
			}
			updateBackground();
			stage.update();
		})
	});
	socketService.get().on('bubble_update', updateEnemy);
	socketService.get().on('bubble_remove', removeEnemy);
	socketService.get().on('bubble_create', createEnemy);
	socketService.get().on('food_eat', eatFood);
	socketService.get().on('food_create', createFood);
	socketService.get().on('bubble_eat', eatBubble);
});
function eatBubble(data){
	if(eater.id == bubble.id){

	} else if(eaten.id == bubble.id){
		bubble.remove();
	} else {

	}
}

function eatFood(data) {
	var food = feed[data.food.id];
	if (food) {
		food.body.remove();
		delete feed[food.id];
	}
}

function createFood(food){
	var newFood = new Food(food);
	food.body = newFood;
	feed[food.id] = food;
	world.addChild(newFood);
}

function createEnemy(enemy) {
	if (enemy.id == bubble.id) {
		return;
	}

	var newEnemy = new Enemy(enemy);
	enemy.body = newEnemy;
	localEnemies[enemy.id] = enemy;
	world.addChild(newEnemy);
}

function removeEnemy(enemy) {
	if (enemy.id == bubble.id) {
		return;
	}

	if (localEnemies.hasOwnProperty(enemy.id)) {
		localEnemies[enemy.id].body.remove();
		delete localEnemies[enemy.id];
	}
}

function updateEnemy(enemy) {
	if (enemy.id == bubble.id) {
		bubble.update(enemy);
		return;
	}

	var localEnemy = localEnemies[enemy.id];
	localEnemy.body.update(enemy);
	localEnemy.x = enemy.x;
	localEnemy.y = enemy.y;
	localEnemies[enemy.id] = localEnemy;
}

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
