'use strict';

var EventDispatcher = createjs.EventDispatcher
	, EaselEvent = createjs.Event;

var controls = {
	32: 'spacebar'
};
var currentActions = {};

var actionService = module.exports = {
	init: actions_init,
	get: actions_get,
	handleMouse: handleEaselMouse
};
var stage, world, lastMouseEvent;

function actions_init(win, currentStage, currentWorld) {
	win = win || window;
	stage = currentStage;
	world = currentWorld;
	EventDispatcher.initialize(actionService);
	win.addEventListener('keydown', onKeyDown);
	win.addEventListener('keyup', onKeyUp);
	//win.addEventListener('mousemove', handleMouse);
	stage.on('stagemousemove', handleEaselMouse);
}

function handleEaselMouse(e){
	if (!e) {
		return;
	}
	if ($(e.nativeEvent.target).closest('#overlay').length > 0) {
		return;
	}

	var eventData = {
		winX: e.rawX,
		winY: e.rawY,
		stageX: e.stageX - world.x,
		stageY: e.stageY - world.y,
		target: e.target
	};

	var MouseEvent = new EaselEvent('mouse');
	MouseEvent.data = eventData;
	MouseEvent.nativeEvent = e;

	actionService.dispatchEvent(MouseEvent);
}

function onKeyDown(e) {
	var keyEvent = processEvent(e, 'down');
	if (keyEvent) {
		currentActions[keyEvent.type] = keyEvent.data;
	}
}
function onKeyUp(e) {
	var keyEvent = processEvent(e, 'up');
	if (keyEvent) {
		delete currentActions[keyEvent.type]
	}
}
function processEvent(event, phase) {


	var generalEvent = prepareEvent(event, phase, 'key');
	if (!generalEvent) return;
	var specificEvent = prepareEvent(event, phase);

	actionService.dispatchEvent(generalEvent);
	actionService.dispatchEvent(specificEvent);

	return specificEvent;
}
function prepareEvent(event, phase, type) {
	var actionName = controls[event.keyCode];
	if (!actionName) return;

	type = type || actionName;

	var eventData = {
		name: actionName,
		shiftKey: event.shiftKey,
		metaKey: event.metaKey,
		altKey: event.altKey,
		ctrlKey: event.ctrlKey,
		phase: phase
	};

	var KeyEvent = new EaselEvent(type);
	KeyEvent.data = eventData;
	KeyEvent.nativeEvent = event;

	return KeyEvent;
}
function actions_get() {
	return currentActions;
}
