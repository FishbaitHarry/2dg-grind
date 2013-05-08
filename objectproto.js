/* Harry's Awesome Object Oriented Framework */
// we try to have no dependency on nodejs
// var util = require("util");

var ProtoExtendable = exports.ProtoExtendable = function(){
	throw "Can't instantiate an abstract class."
};
ProtoExtendable.prototype = {
	/* inheritance through prototyping */
	extend: function(constr, attrs) {
		var protoClass = function(){};
		protoClass.prototype = this.prototype;
		var proto = new protoClass();
		for (var attr in attrs) {proto[attr]=attrs[attr];}
		constr.prototype = proto;
		return constr;
	}
}

var Extendable = exports.Extendable = function(){
	throw "Can't instantiate an abstract class."
};
Extendable.prototype = {
	/* inheritance through attribute copy */
	extend: function(constr, attrs) {
		var proto = {};
		for (var attr in attrs) {proto[attr] = attrs[attr];}
		for (var attr in this)  {proto[attr] = this[attr];}
		constr.prototype = proto;
		return constr;
	}
}

var Observable = exports.Observable = function(){};
Observable.prototype = {
	on: function(type, callback) {
		if (!this._listeners) this._listeners = {};
		if (!this._listeners[type]) this._listeners[type] = [];
		this._listeners[type].push(callback);
	},
	once: function(type, callback) {
		var _this = this;
		var f = function(data){
			_this.off(type, f);
			callback.call(null, data);
		}
		this.on(type, f);
	},
	off: function(type, callback) {
		if ((!this._listeners) || (!this._listeners[type]))
			throw "[Observable] No such listener registered.";
		var i = this._listeners[type].indexOf(callback);
		this._listeners[type].splice(i, 1);
	},
	trigger: function(type, data) {
		if ((!this._listeners) || (!this._listeners[type]))
			return;
		this._listeners[type].forEach(function(callback) {
			callback.call(null, data);
		});
	},
	emit: function(type, data) {
		this.trigger(type, data);
	}
}

var Initialisable = exports.Initialisable = function(params) {
	this.init(params);
};
Initialisable.prototype = {
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
	}
};

exports.createClass = function(options){
	if (!options) options = {};
	if (!options.constructor)
		options.constructor = function(){
			if (this.init) this.init();
		}
	
}