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
		{type:'dialogue', text:'Guard: Stop there citizens! I must speak with you.', actors:[
			{name:'Jack',icon:'img/guard.png',description:'a man',active:true},
			{name:'Mary',icon:'img/girl.png',description:'woman',active:false},
			{name:'Som1',icon:'img/thief.png',description:'human',active:false}
		]},
		{type:'dialogue', text:'Thief: Give it a rest, scout boy. We are just passing through.', choices: [
			{text:'Listen to him.',next:3},
			{text:'Ignore the guard.',next:2}
		], actors:[
			{name:'Jack',icon:'img/guard.png',description:'a man',active:false},
			{name:'Mary',icon:'img/girl.png',description:'woman',active:false},
			{name:'Som1',icon:'img/thief.png',description:'human',active:true}
		]},
		{type:'dialogue', text:'You: We don\'t want to cause trouble, but if you stop us, we will.', actors:[
			{name:'Jack',icon:'img/guard.png',description:'a man',active:false},
			{name:'Mary',icon:'img/girl.png',description:'woman',active:true},
			{name:'Som1',icon:'img/thief.png',description:'human',active:false}
		]},
		{type:'dialogue', text:'You: Alright. What is it you want to tell us? Is there something happening in the town?', actors:[
			{name:'Jack',icon:'img/guard.png',description:'a man',active:false},
			{name:'Mary',icon:'img/girl.png',description:'woman',active:true},
			{name:'Som1',icon:'img/thief.png',description:'human',active:false}
		]},
		{type:'battle', participants:['goblin','goblin','main character'], win: 5, lose: 6}
	]
};