var GameEntity = require('./gameentity');
var BasicAbilities = require('./ability').BasicAbilities;
var Action = require('./battle').Action;

var Character = GameEntity.extend({
	init: function(params) {
		GameEntity.prototype.init.call(this, params);
		if (!this.attributes) this.attributes = {};
		if (!this.abilities)  this.abilities = [];
		if (!this.equipment)  this.equipment = [];
		if (!this.status)     this.status = [];
	},
	get: function(attr) {
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
	serialize: function(){}
	/* private */
	
});

var GenericMonster = Character.extend({
	defaults: {
		attributes: {attack:30, defense:50, stamina:50},
		abilities: BasicAbilities
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

exports.Character = Character;
exports.GenericMonster = GenericMonster;