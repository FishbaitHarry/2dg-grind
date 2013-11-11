var BasicAbilities = require('./ability').BasicAbilities;
var Battle = require('./battle').Battle;
var assert = require('assert');
var _ = require('underscore');
var Observable = require('./objectproto').Observable;

/*
 * Triggers a 'change' event when current scene changes.
 */
var Adventure = exports.Adventure = function Adventure(params){this.init(params)}
Adventure.prototype = _.extend({}, Observable.prototype, {
	init: function(params) {
		var defaults = {
			currentPlotPoint: 0
		}
		_.extend(this, defaults, params);
	},
	/* public interface
	 * returns either current battle or current dialogue
	 */
	getScene: function() {
		if (!this.plotPointInstance) {
			var plotPoint = this.currentPlotPoint;
			this.plotPointInstance = this.instantiatePlotPoint(plotPoint);
		}
		return this.plotPointInstance;
	},
	save: function(){},
	load: function(json){},
	
	/* private */
	changePlotPoint: function(plotPoint) {
		this.currentPlotPoint = plotPoint;
		this.plotPointInstance = null;
		this.emit('change');
	},
	instantiatePlotPoint: function(plotPoint) {
		var plotData = this.plotData[plotPoint];
		plotData.adventure = this; //warn
		if (plotData.type == 'dialogue')
			return new Dialogue(plotData);
		if (plotData.type == 'battle')
			return new Battle(plotData);
	},
});

var Dialogue = exports.Dialogue = function Dialogue(params){this.init(params)}
Dialogue.prototype = _.extend({}, {
	init: function(params) {
		assert(params.adventure != undefined);
		var nextPlotNumber = params.adventure.currentPlotPoint + 1;
		var defaults = {
			actors: [],
			text: 'Silence...',
			choices: [{
				text: 'Next',
				next: nextPlotNumber
			}]
		}
		_.extend(this, defaults, params);
	},
	choose: function(choiceNumber) {
		if (!choiceNumber) {
			choiceNumber = 0;
		}
		if (!this.choices) {
			var next = this.adventure.currentPlotPoint + 1;
			this.adventure.changePlotPoint(next);
		} else {
			var choice = this.choices[choiceNumber];
			assert(choice != undefined);
			assert(choice.next != undefined);
			this.adventure.changePlotPoint(choice.next);
		}
	}
	/* private */
});

exports.serializedAdventure1 = {
	name: 'Example Adventure',
	description: 'Its so generic it hurts.',
	plotData: [
		{type:'dialogue', text:'welcome to the game', actors:[{name:'Jack',icon:'jack.jpg',description:'a man',active:true}]},
		{type:'dialogue', text:'want tutorial?', choices: [{text:'yes',next:2},{text:'no',next:3}]},
		{type:'dialogue', text:'no tutorial for you'},
		{type:'dialogue', text:'welcome to the game'},
		{type:'battle', participants:['goblin','goblin','main character'], win: 5, lose: 6}
	]
};