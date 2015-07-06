'use strict';
var createSubClass = require('./utils/create_subclass')
	, Container = createjs.Container;


module.exports = createSubClass(Container, 'Enemy', {
	initialize: Enemy_initialize,
	update: update,
	remove: remove
});

function remove() {
	this.parent.removeChild(this);
}

function update(data) {
	this.x = data.x;
	this.y = data.y;
	this.rotation = data.rotation;
	this.mass = data.mass;
	this.size = data.size;
	redraw.call(this);
}

function Enemy_initialize(bubble) {
	Container.prototype.initialize.apply(this, arguments);
	for (var key in bubble) {
		if (bubble.hasOwnProperty(key)) {
			this[key] = bubble[key];
		}
	}
	setupDisplay.call(this);
	redraw.call(this);
}

function redraw() {
	this.body.graphics.clear().beginStroke('#333333').beginFill(this.color).drawCircle(0, 0, this.size);
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
