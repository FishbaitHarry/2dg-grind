var _ = require('underscore');
var BasicAbilities = require('./ability').BasicAbilities;
var AllAbilities = require('./ability').AllAbilities;
var Action = require('./battle').Action;
var Observable = require('./objectproto').Observable;

var Character = exports.Character = function(params){this.init(params)}
Character.prototype = _.extend({}, Observable.prototype, {
	init: function(params) {
		var defaults = {
			attributes: {},
			abilities: [],
			equipment: [],
			status: []
		}
		_.extend(this, defaults, params);
	},
	getAttr: function(attr) {
		var base = this.attributes[attr] || 0;
		var equip = this.equipment.reduce(function(a,b){return a+(b[attr]||0);},0);
		var buff = this.status.reduce(function(a,b){return a+(b[attr]||0);},0);
		// todo: can be buffered
		return base + equip + buff;
	},	
	expireStatus: function(time) {
		var newStatus = [];
		this.status.forEach(function(effect){
			if (effect.duration) {
				if (0 < (effect.duration -= time))
					newStatus.push(effect);
				else if (effect.onExpire)
					effect.onExpire();
			} else newStatus.push(effect);
		});
		this.status = newStatus;
	},
	toJSON: function(){
		var pojo = _.extend({}, this);
		if (pojo.abilities instanceof Array) {
			pojo.abilities = _.map(pojo.abilities, function(i, ability){
				return ability.name;
			});
		}
		return pojo;
	},
	getActions: function(){
		return []; // I have free will, but I choose to oscillate.
	},
	getVisibleAttributes: function(){
		var visibleTypes = ['attack', 'defense', 'speed', 'stamina'];
		var computed = {};
		var self = this;
		_.each(visibleTypes, function(type){ computed[type] = self.getAttr(type); });
		return computed;
	}
	/* private */
});
_.extend(Character, {
	/* static methods */
	fromJSON: function(pojo) {
		if (pojo.abilities) {
			pojo.abilities = _.map(pojo.abilities, function(name){
				return AllAbilities.getByName(name);
			});
		}
		return new Character(pojo);
	}
});

var GenericMonster = exports.GenericMonster = function(params){this.init(params)}
GenericMonster.prototype = _.extend({}, Character.prototype, {
	init: function(params) {
		Character.prototype.init.call(this, {
			name: "Goblin",
			icon: "goblin.png",
			description: "Ugly spiteful creature.",
			attributes: {attack:30, defense:50, stamina:50},
			abilities: BasicAbilities.asArray()
		});
	},
	getActions: function(battle) {
		var i = Math.floor(Math.random()*this.abilities.length);
		var ability = this.abilities[i];
		var j = Math.floor(Math.random()*battle.participants.length);
		var target = battle.participants[j];
		var action = new Action({actor: this, ability: ability, target: target});
		return [action];
	}
});