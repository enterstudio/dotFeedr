'use strict';

var EventDispatcher = createjs.EventDispatcher
	, EaselEvent = createjs.Event;

var socket;


var socketService = module.exports = {
	init: socket_init,
	get: socket_get
};

function socket_init() {
	EventDispatcher.initialize(socketService);
	socket = io.connect('ws://' + window.location.hostname + ':9002');
	console.log('Initialized socket: ', socket);
}
function socket_get() {
	return socket;
}
