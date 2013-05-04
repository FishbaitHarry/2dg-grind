var MyObject = require('myobject');
var BasicAbilities = require('abilities/basic');

var Action = MyObject.extend({
	/* Action is an instance of ability usage in context. */
	/* Action is heavily mutable and serves as context and log. */
	/* Action lives only for a single round of battle. */
	defaults: {
		speed: 0,
		resolved: false,
		ability: BasicAbilities.defend
	},
	required: [
		'battle',
		'actor'
	],
	resolve: function(){
		var context = this;
		this.ability.resolve(context);
		this.resolved = true;
		this.fillIn();
		this.battle.log.push(result);
	},
	getComputedSpeed: function() {
		return this.speed + this.ability.speed + this.actor.get('speed');
	}
	/* private */
	fillIn: function(entry) {
		entry.actor = this.actor;
	}
});