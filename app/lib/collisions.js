'use strict';

var EaselEvent = createjs.Event;

var actors = [];

module.exports = {
	addActor: addActor,
	removeActor: removeActor,
	broadastCollisions: broadastCollisions
};
function addActor(obj, type, options) {
	var index = actors.indexOf(obj);

	if (index !== -1) {
		return console.warn('collisions: object already registered', obj);
	}

	obj._collisionInfo = {
		type: type,
		options: options
	};

	return actors.push(obj);
}
function removeActor(obj) {
	var index = actors.indexOf(obj);

	if (index === -1) {
		return console.warn('collisions: object not registered');
	}

	delete obj._collisionInfo;
	return actors.splice(index, 1);

}

function distanceBewteen(o1, o2) {
	return Math.sqrt(Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y,2))
}
function broadastCollisions() {
	var collisions = [];
	actors.forEach(function (self) {
		actors.forEach(function (other) {
			var selfInfo = self._collisionInfo;
			var otherInfo = other._collisionInfo;

			if (self != other) {
				if (selfInfo.type == 'bubble' && otherInfo.type == 'food') {
					var dist = self.size + other.size;
					if (dist>distanceBewteen(self, other)) {
						var collisionEvent = new EaselEvent('collision');
						collisionEvent.data = {
							self: self,
							other: other,
							dist: dist
						};

						collisions.push({
							target1: self,
							target2: other,
							event: collisionEvent
						})
					}
				}
			}
		});
	});

	collisions.forEach(function (info) {
		info.target1.dispatchEvent(info.event);
		info.target2.dispatchEvent(info.event);
	});
}
