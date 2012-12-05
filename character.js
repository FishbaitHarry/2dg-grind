var GameEntity = require('gameentity');
var BasicAbilities = require('ability').BasicAbilities;

var Character = GameEntity.extend({
	init: function(params) {
		GameEntity.super_.init(params);
		if (!this.attributes) this.attributes = {};
		if (!this.abilities)  this.abilities = [];
		if (!this.equipment)  this.equipment = [];
		if (!this.status)     this.status = [];
	},
	get: function(attr) {
		var base = this.attributes[attr] || 0;
		var equip = equipment.reduce(function(a,b){return a+(b[attr]||0);},0);
		var buff = status.reduce(function(a,b){return a+(b[attr]||0);},0);
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
	serialize: function(){}
	/* private */
	
});

var GenericMonster = Character.extend({
	defaults: {
		attributes: {attack:10, defense:10, stamina:10},
		abilities: BasicAbilities
	},
	getActions: function() {
		var i = Math.floor(Math.random()*this.abilities.length);
		return [this.abilities[i]];
	}
});

exports.Character = Character;
exports.GenericMonster = GenericMonster;