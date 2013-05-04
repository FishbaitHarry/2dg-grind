/* Harry's Awesome Object Oriented Framework */
var util = require("util");
var events = require("events");

//constructor
var GameEntity = function(params) {
	this.init(params);
	events.EventEmitter.call(this);
};

//inheritance
util.inherits(GameEntity, events.EventEmitter);

//class methods
GameEntity.extend = function(definition) {
	var parent = this;
	var classConstructor = function(params) {
		parent.call(this, params);
	};
	util.inherits(classConstructor, parent);
	classConstructor.extend = GameEntity.extend;
	classConstructor.include = GameEntity.include;
	extend(classConstructor.prototype, definition);
	return classConstructor;
}
GameEntity.include = function(definition) {
	extend(this.prototype, definition);
}

//instance methods
extend(GameEntity.prototype, {
	/* initialization and validation aspect */
	defaults: {},
	required: [],
	init: function(params) {
		extend(this, params);
		for (var param in this.defaults) {
			if (this[param] == undefined)
				this[param] = this.defaults[param];
		};
		for (var param in this.required) {
			assert(this[param] != undefined, "Required object value undefined.");
		};
	}
});

// private
function extend(obj, params) {
	for (var param in params) {
		obj[param] = params[param];
	};
}

module.exports = GameEntity;