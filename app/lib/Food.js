'use strict';

var createSubClass = require('./utils/create_subclass')
	, collisionService = require('./collisions')
	, Container = createjs.Container;

module.exports = createSubClass(Container, 'Food', {
	initialize: Food_initialize
});

function onCollision(e) {
	collisionService.removeActor(this);
	this.parent.removeChild(this);
}
function Food_initialize(x, y, mass) {
	Container.prototype.initialize.apply(this, arguments);

	this.name = 'food';
	this.x = x;
	this.y = y;
	this.mass = mass;

	this.body = new createjs.Shape();
	this.body.graphics.beginFill('yellow').drawCircle(0, 0, this.mass)
	this.addChild(this.body);

	collisionService.addActor(this, 'food', {radius: this.mass});

	this.on('collision', onCollision);
}
