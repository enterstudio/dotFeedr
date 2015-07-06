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
	this.size = Math.sqrt(this.mass / Math.PI) * 5;
	this.body.graphics.beginFill('green').drawCircle(0, 0, this.size);
	this.addChild(this.body);

	collisionService.addActor(this, 'food');

	this.on('collision', onCollision);
}
