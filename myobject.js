/* Harry's Awesome Object Oriented Framework */
var util = require("util");

var MyObject = function(params) {this.init(params);};
MyObject.prototype = {
	/* initialization and validation aspect */
	defaults: {},
	required: [],
	init: function(params) {
		for (var param in params) {
			this[param] = params[param];
		};
		for (var param in this.defaults) {
			if (this[param] == undefined)
				this[param] = this.defaults[param];
		};
		for (var param in this.required) {
			assert(this[param] != undefined, "Required object value undefined.")
		};
	},
	/* object oriented inheritance aspect */
	extend: function(attrs) {
		var protoClass = function(){};
		protoClass.prototype = this.prototype;
		var proto = new protoClass();
		for (var attr in attrs) {proto[attr]=attrs[attr];}
		var newClass = function(params) {this.init(params);};
		newClass.prototype = proto;
		return newClass;
	},
	/* event handling aspect, instance-level only */
	trigger: function(event) {
		assert(event.type != undefined, "Undefined event type.");
		if (this.eventHandlers) {
			this.eventHandlers.forEach(function(handler){
				if (handler.type == event.type) handler.callback(event)
			});
		}
	},
	subscribe: function(handler) {
		if (!this.eventHandlers) this.eventHandlers = [];
		this.eventHandlers.push(handler);
	}
};

/* private */
var helper = {
}

exports = MyObject;