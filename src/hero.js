var Character = require('./character').Character;
var Action = require('./battle').Action;
var BasicAbilities = require('./ability').BasicAbilities;

var Hero = exports.Hero = function(params){this.init(params)}
Hero.prototype = _.extend({}, Character.prototype, {
	init: function(params) {
		Character.prototype.init.call(this, {
			level: 1,
			xp: 0,
			attributes: {attack:30, defense:50, stamina:50},
			abilities: BasicAbilities
		});
	},
	getActions: function(battle) {
		var action = this.commandQueue.shift();
		if (!action)
			action = new Action({
				actor: this,
				ability: BasicAbilities.Defend,
				target: this
			});
		return [action];
	}
}