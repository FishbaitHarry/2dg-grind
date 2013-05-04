var assert = require('assert');

var BasicAbilities = {
	defend: {
		description: "Increases defense for 1 round.",
		speed: 200,
		resolve: function(context) {
			assert(context.actor, "Illegal arguments");
			var actor = context.actor;
			var target = context.target || actor;
			var value = actor.get('defense') / 2;
			var buff = {duration: 1, defense: value};
			
			target.status.push(buff);
			
			actor.emit('defending', context);
		}
	},
	attack: {
		description: "Damages the target.",
		speed: 100,
		resolve: function(context) {
			assert(context.actor, context.target, "Illegal arguments");
			context.actor.emit('attack:actor', context);
			context.target.emit('attack:target', context);
						
			var attackValue = context.attackValue || context.actor.get('attack');
			var defenseValue = context.defenseValue || context.target.get('defense');
			
			context.hit = Math.rand() < (attackValue / (attackValue+defenseValue));
			if (context.hit) {
				var wound = {stamina: -5, defense: -5};
				context.target.status.push(wound);
			}
			
			context.actor.emit('attacked:actor', context);
			context.target.emit('attacked:target', context);
			
			assert(context.hit != undefined, "Attack resolution failure");
		}
	},
	counterattack: {
		description: "You get ready to strike an opponent as he attacks.",
		speed: 200,
		resolve: function(context) {
			assert(context.actor, "Illegal arguments");
			var counter = function(event) {
				var tmp = {actor: context.actor, target: event.actor};
				BasicAbilities.attack.resolve(tmp);
			};
			var expire = function() {
				context.actor.removeListener('attack:target', counter);
			};
			context.actor.once('attack:target', counter);
			context.actor.on('round:start', expire);
		}
	}
};

exports.BasicAbilities = BasicAbilities;