'use strict';
var createSubClass = require('./utils/create_subclass')
	, actionService = require('./actions')
	, hudService = require('./hud')
	, collisionService = require('./collisions')
	, Container = createjs.Container;


module.exports = createSubClass(Container, 'Bubble', {
	initialize: Bubble_initialize,
	fire: Bubble_fire
});


function onCollision(e) {
	var other = e.data.other;

	if (other._collisionInfo.type == "food") {
		this.newMass += other.mass;
	}
	hudService.dispatchEvent({
		type: 'set',
		data: {
			property: 'mass',
			value: this.newMass
		}
	});
}
function Bubble_initialize(name, x, y) {
	Container.prototype.initialize.apply(this, arguments);
	this.name = name;
	this.x = x;
	this.y = y;

	setupProperties.call(this);
	setupDisplay.call(this);

	collisionService.addActor(this, 'bubble')

	this.on('tick', onTick);
	this.on('collision', onCollision);
}

function setupProperties() {
	this.name = 'bubble';
	this.thrust = 1;
	this.lookX = 0;
	this.lookY = 0;
	this.rotation = 0;
	this.mass = 50;
	this.speed = 0;
	this.newMass = 50;
	this.size = 0;
	this.distance = 0;
}

function processActions() {
	var actions = actionService.get();

	if (actions.mouse) {
		this.lookX = actions.mouse.stageX;
		this.lookY = actions.mouse.stageY;
	}

	mouseLook.call(this);

}
function grow() {
	if ((this.newMass - this.mass)<1) {
		this.mass = this.newMass;
	} else {
		this.mass += (this.newMass - this.mass) / 10;
	}
}
function move() {
	if (Math.abs(this.lookX - this.x)<=this.speed && Math.abs(this.lookY - this.y)<=this.speed) {
		return;
	}


	/*
	 * Speed calculation
	 */
	this.speed = 10 - Math.min(4, this.mass/500);

	hudService.dispatchEvent({
		type: 'set',
		data: {
			property: 'speed',
			value: this.speed
		}
	});

	if (this.distance>this.size * 3) {
		this.thrust = 1;
	} else {
		this.thrust = this.distance / (this.size *3);
	}

	var ratioX = Math.sin((this.rotation) * Math.PI / 180) * this.thrust;
	var ratioY = Math.cos((this.rotation) * Math.PI / 180) * this.thrust * -1;
	var diffX = ratioX * this.speed;
	var diffY = ratioY * this.speed;


	this.x += diffX;
	this.y += diffY;

}
function mouseLook() {
	var x1 = this.x,
		x2 = this.lookX,
		y1 = this.y,
		y2 = this.lookY;
	this.rotation = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI) + 90;
	this.distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));


}

function onTick(event) {
	processActions.call(this);
	move.call(this);
	grow.call(this);
	redraw.call(this);
}
function redraw() {
	this.size = Math.sqrt(this.mass / Math.PI) * 10;
	this.body.graphics.clear().beginFill('blue').drawCircle(0, 0, this.size);
}

function setupDisplay() {
	this.body = new createjs.Shape();
	redraw.call(this);
	this.addChild(this.body);
}

function Bubble_fire() {
	console.log('fire!');
}
