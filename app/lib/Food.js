'use strict';

var createSubClass = require('./utils/create_subclass')
	, Container = createjs.Container;

module.exports = createSubClass(Container, 'Food', {
	initialize: Food_initialize,
	remove: Food_remove
});


function Food_remove(e) {
	this.parent.removeChild(this);
}
function Food_initialize(data) {
	Container.prototype.initialize.apply(this, arguments);

	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			this[key] = data[key];
		}
	}


	this.body = new createjs.Shape();
	this.size = Math.sqrt(this.mass / Math.PI) * 10;
	this.body.graphics.beginFill('green').drawCircle(0, 0, this.size);

	this.addChild(this.body);

}
