'use strict';
var createSubClass = require('./utils/create_subclass')
	, actionService = require('./actions')
	, socketService = require('./socket')
	, Container = createjs.Container;


module.exports = createSubClass(Container, 'Bubble', {
	initialize: Bubble_initialize,
	update: Bubble_update
});


function Bubble_update(data) {
	this.mass = data.mass;
	this.size = data.size;
	this.dead = data.dead;
}
function Bubble_initialize(bubble) {
	Container.prototype.initialize.apply(this, arguments);
	for(var key in bubble){
		if(bubble.hasOwnProperty(key)){
			this[key] = bubble[key];
		}
	}

	this.lookX = this.x;
	this.lookY = this.y;

	setupProperties.call(this);
	setupDisplay.call(this);


	this.on('tick', onTick);
}

function setupProperties() {
	this.thrust = 1;
	this.speed = 0;
	this.distance = 0;
}

function processActions() {
	var actions = actionService.get();

	if (actions.mouse) {
		this.lookX = actions.mouse.stageX;
		this.lookY = actions.mouse.stageY;

		mouseLook.call(this);
	}

}
function move() {
	if (Math.abs(this.lookX - this.x)<=this.speed && Math.abs(this.lookY - this.y)<=this.speed) {
		return;
	}


	if (this.distance>this.size * 3) {
		this.thrust = 1;
	} else {
		this.thrust = this.distance / (this.size * 3);
	}

	/*
	 * Speed calculation
	 */
	var decreasement = 3*(Math.log(this.mass + 200)/Math.LN10) - 6.90309;
	this.speed = Math.round(((5 - decreasement) * this.thrust)*1000)/1000;
	this.speed *= this.speedModifier;

	var ratioX = Math.sin((this.rotation) * Math.PI / 180);
	var ratioY = Math.cos((this.rotation) * Math.PI / 180) * -1;
	var diffX = ratioX * this.speed;
	var diffY = ratioY * this.speed;

	this.x += diffX;
	this.y += diffY;

	if (Math.abs(diffX)>1 / 1000 || Math.abs(diffY)>1 / 1000) {
		socketService.get().emit('bubble_move', {
			x: this.x,
			y: this.y,
			rotation: this.rotation
		});
	}


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
	if(!this.dead){
		processActions.call(this);
		move.call(this);
	}
	redraw.call(this);
}
function redraw() {
	this.body.graphics.clear()
	if(!this.dead){
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
