'use strict';

var EventDispatcher = createjs.EventDispatcher
	, EaselEvent = createjs.Event;

var c = createjs;

var width, height, hud;

var isDirty = false;
var texts = {};

var values = {
	mass: 50,
	speed: 5
};

var hudService = module.exports = {
	init: hud_init,
	get: hud_get
};

function createHud() {
	var newHud = new c.Container(0, 0);

	var header = new c.Text('dotFeedr', '16px Arial', '#333');
	header.x = width / 2 - header.getMeasuredWidth() / 2;
	header.y = 8;
	newHud.addChild(header);

	var massLabel = new c.Text('Mass:', '16px Arial', '#333');
	massLabel.x = 20;
	massLabel.y = height - massLabel.getMeasuredHeight() - 20;
	newHud.addChild(massLabel);

	texts.mass = new c.Text(values.mass, '16px Arial', '#333');
	texts.mass.x = massLabel.getMeasuredWidth() + 22;
	texts.mass.y = height - massLabel.getMeasuredHeight() - 20;
	newHud.addChild(texts.mass);

	var speedLabel = new c.Text('Speed:', '16px Arial', '#333');
	speedLabel.x = 20;
	speedLabel.y = height - speedLabel.getMeasuredHeight() - 50;
	newHud.addChild(speedLabel);

	texts.speed = new c.Text(values.speed, '16px Arial', '#333');
	texts.speed.x = speedLabel.getMeasuredWidth() + 22;
	texts.speed.y = height - speedLabel.getMeasuredHeight() - 50;
	newHud.addChild(texts.speed);

	return newHud;
}
function onTick() {
	if (isDirty) {
		for(var key in values){
			if(values.hasOwnProperty(key)){
				var textObj = texts[key];
				if(textObj){
					textObj.text = values[key];
				}
			}
		}
		isDirty = false;
	}
}
function onUpdate(e) {

}
function onSet(e) {
	if (!e.data) return;
	var property = e.data.property;
	var value = e.data.value;

	if (property && value) {
		values[property] = value;
		isDirty = true;
	}
}
function hud_init(x, y) {
	EventDispatcher.initialize(hudService);

	width = x;
	height = y;
	hud = createHud();

	hud.on('tick', onTick);

	this.on('update', onUpdate);
	this.on('set', onSet);

}
function hud_get() {
	return hud;
}
