var BasicAbilities = require('./ability').BasicAbilities;
var assert = require('assert');

var Battle = function(params){this.init(params);};

Battle.prototype = {
	init: function(params) {
		this.round = 1;
		this.actions = [];
		this.log = [];
		this.participants = params.participants;
	},
	resolveCombatRound: function() {
		this.resetCombatRound();
		this.pushParticipantsActions();
		this.resolveActions();
		console.log(this.actions);
	},
	/* private */
	resetCombatRound: function() {
		this.round += 1;
		this.log = this.log.concat(this.actions);
		this.actions = [];
	},
	pushParticipantsActions: function() {
		this.participants.forEach(this.pushCharacterActions,this);
	},
	pushCharacterActions: function(character) {
		var actions = character.getActions(this);
		this.actions = this.actions.concat(actions);
	},
	resolveActions: function() {
		this.actions.sort(this.compareActionSpeed);
		this.actions.forEach(function(action){action.resolve()});
	},
	compareActionSpeed: function(actionA,actionB) {
		/* actions with greater speed first */
		return actionB.getComputedSpeed()-actionA.getComputedSpeed();
	}
};

var Action = function(params){this.init(params);}
	/* Action is an instance of ability usage in context. */
	/* Action is heavily mutable and serves as context and log. */
	/* Action lives only for a single round of battle. */
Action.prototype = {
	init: function(params) {
		assert(params.actor, "No action actor specified.");
		this.actor = params.actor;
		this.target = params.target || params.actor;
		this.speed = 0;
		this.resolved = false;
		this.ability = params.ability || BasicAbilities.defend
	},
	resolve: function(){
		var context = this;
		this.ability.resolve(context);
		this.resolved = true;
	},
	getComputedSpeed: function() {
		return this.speed + this.ability.speed + this.actor.get('speed');
	}
	/* private */
};

var BattleLogFormatter = {
	appender: console.log,
	consumeLog: function(battleLog) {
		var action;
		while (action = battleLog.shift) {
			appender(action.actor+" used "+action.ability.description+" on "+action.target);
		}
	}
}

exports.Battle = Battle;
exports.Action = Action;