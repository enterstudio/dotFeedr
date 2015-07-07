'use strict';
var createSubClass = require('./utils/create_subclass')
	, actionService = require('./actions')
	, socketService = require('./socket')
	, Container = createjs.Container;


module.exports = createSubClass(Container, 'Bubble', {
	initialize: Bubble_initialize,
	update: Bubble_update,
	remove: Bubble_remove
});

var bubble
	, world;

function Bubble_remove() {
	this.parent.removeChild(this);
}

function Bubble_update(data) {
	this.mass = data.mass;
	this.size = data.size;
	this.dead = data.dead;
}
function Bubble_initialize(data, worldData) {
	Container.prototype.initialize.apply(this, arguments);
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			this[key] = data[key];
		}
	}
	bubble = this;
	world = worldData;

	setupProperties.call(this);
	setupDisplay.call(this);
	actionService.on('mouse', onMouse);
	actionService.on('spacebar', onSpacebar);


	this.on('tick', onTick);
}

function onSpacebar(e) {
	alert('.');
}

function setupProperties() {
	this.thrust = 1;
	this.speed = 0;
}

function onMouse(e) {
	if (!e) {
		return;
	}
	bubble.rotation = Math.atan2(e.data.stageY - bubble.y, e.data.stageX - bubble.x) * (180 / Math.PI) + 90;
	var distance = Math.sqrt(Math.pow(bubble.x - e.data.stageX, 2) + Math.pow(bubble.y - e.data.stageY, 2));
	if (distance>bubble.size) {
		bubble.thrust = 1;
	} else {
		bubble.thrust = distance / bubble.size;
	}

}
function move() {

	/*
	 * Speed calculation
	 */
	var decreasement = 3 * (Math.log(this.mass + 200) / Math.LN10) - 6.90309;
	this.speed = Math.round(((5 - decreasement) * this.thrust) * 1000) / 1000;
	this.speed *= this.speedModifier;

	var ratioX = Math.sin((this.rotation) * Math.PI / 180);
	var ratioY = Math.cos((this.rotation) * Math.PI / 180) * -1;
	var diffX = ratioX * this.speed;
	var diffY = ratioY * this.speed;

	var moved = false;
	if (diffX<0 && this.x + diffX>this.size / 3) {
		this.x += diffX;
		moved = true;
	}

	if (diffX>0 && this.x + diffX<world.width - this.size / 3) {
		this.x += diffX;
		moved = true;
	}

	if (diffY<0 && this.y + diffY>this.size / 3) {
		this.y += diffY;
		moved = true;
	}

	if (diffY>0 && this.y + diffY<world.height - this.size / 3) {
		this.y += diffY;
		moved = true;
	}


	if ((Math.abs(diffX)>1 / 1000 || Math.abs(diffY)>1 / 1000) && moved) {
		socketService.get().emit('bubble_move', {
			x: this.x,
			y: this.y,
			rotation: this.rotation
		});
	}


}

function onTick(event) {
	if (!this.dead) {
		onMouse.call(this);
		move.call(this);
	}
	redraw.call(this);
}
function redraw() {
	this.body.graphics.clear()
	if (!this.dead) {
		this.body.graphics.beginStroke('#333333').beginFill(this.color).drawCircle(0, 0, this.size);
	} else {
		this.removeChild(this.text);
		this.removeChild(this.massText);
	}
	this.massText.text = this.mass;
}

function setupDisplay() {

	this.body = new createjs.Shape();
	this.addChild(this.body);


	this.text = new createjs.Text(this.name, '14px Verdana', '#ffffff');
	this.text.textAlign = 'center';
	this.addChild(this.text);


	this.massText = new createjs.Text(this.mass, 'bold 16px Verdana', '#ffffff');
	this.massText.textAlign = 'center';
	this.massText.y -= 20;
	this.addChild(this.massText);

	redraw.call(this);
}
