var BasicAbilities = require('./ability').BasicAbilities;
var Battle = require('./battle').Battle;
var assert = require('assert');

/*
 * Triggers a 'change' event when currentContent changes.
 */
var Adventure = exports.Adventure = function(params){this.init(params)}
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
	currentContent: function() {
		return this.plotPointInstance;
	},
	serialize: function(){}
	
	/* private */
	changePlotPoint: function(plotPoint) {
		this.currentPlotPoint = plotPoint;
		this.plotPointInstance = this.instantiatePlotPoint(plotPoint);
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

var Dialogue = exports.Dialogue = function(params){this.init(params)}
Dialogue.prototype = _.extend({}, {
	init: function(params) {
		var defaults = {
			talkingCharacter: null,
			otherCharacters: [],
			text: 'text here',
			choices: []
		}
		_.extend(this, defaults, params);
		assert(this.adventure != undefined);
	},
	choose: function(choiceNumber) {
		if (!choiceNumber) {
			choiceNumber = 0;
		}
		if (!this.choices) {
			this.adventure.currentPlotPoint += 1;
		} else {
			var choice = this.choices[choiceNumber];
			assert(choice != undefined);
			assert(choice.next != undefined);
			this.adventure.changePlotPoint(choice.next);
		}
	}
}

var serializedAdventure1 = [
	{type:'dialogue', text:'welcome to the game'},
	{type:'dialogue', text:'want tutorial?', choices: [{text:'yes',next:2},{text:'no',next:3}]},
	{type:'dialogue', text:'no tutorial for you'},
	{type:'dialogue', text:'welcome to the game'},
	{type:'battle', participants:['goblin','goblin','main character'], win: 5, lose: 6}
];