var bm = require('./battle');
var cm = require('./character');

function battleTest() {
	var m1 = new cm.GenericMonster();
	var m2 = new cm.GenericMonster();

	var exBattle = new bm.Battle({
		participants: [m1, m2]
	});

	exBattle.resolveCombatRound();
	exBattle.resolveCombatRound();
	exBattle.resolveCombatRound();
	exBattle.resolveCombatRound();

	bm.BattleLogFormatter.consumeLog(exBattle.log);
}
battleTest();

// that was just to test stuff
// here goes the ui
// note: I don't require jquery, it is currently an asset
// todo: move it to seperate files when it bloats
var Backbone = require('backbone');
var _ = require('underscore');
var Adventure = require('./adventure').Adventure;
var exampleAdv = require('./adventure').serializedAdventure1;

var SettingsModel = Backbone.Model.extend({
	defaults: {},
	initialize: function() {
		console.log('settings model created');
	}
});
var InteractiveView = Backbone.View.extend({
	events: {
		"click button": "callAction"
	},
	callAction: function(evt) {
		evt.preventDefault();
		var actionName = $(evt.target).data('action');
		this[actionName].call(this,evt);
	}
});
var ModelWatcherView = Backbone.View.extend({
	setModel: function(model) {
		this.model = model;
		model.on('change', this.render.bind(this));
	},
	render: function() {
		console.log("render not implemented!");
	}
});
var OptionsView = InteractiveView.extend({
	render: function(){
		// this.$el.text("OPTIONS ARE HERE")
	},
	newGame: function(){
		this.model.set('character', new cm.GenericMonster());
		this.model.set('adventure', new Adventure(exampleAdv));
		console.log('new game');
	},
	load: function(){console.log('load')},
	save: function(){console.log('save')},
});
var AdventureView = ModelWatcherView.extend({
	// expects this.model typeof Adventure
	initialize: function() {
		this.choiceBox = new ChoiceBoxView({el: this.$('footer')});
		this.situationView = new SituationView({el: this.$('section')});
		if (this.model) this.setModel(this.model);
	},
	render: function() {
		if (!this.model) return;
		var scene = this.model.getScene();
		this.situationView.model = scene;
		this.situationView.render();
		this.choiceBox.model = scene;
		this.choiceBox.render();
	}
});
var SituationView = Backbone.View.extend({
	// expects this.model typeof Scene (actors, text, choices, background)
	render: function() {
		// clear scene
		var container = this.$el.html('');
		// set background (TODO)
		this.$el;
		// add actors
		_.each(this.model.actors, function(actor){
			$('<img/>')
			.attr('src', actor.icon)
			.toggleClass('active', actor.active)
			.appendTo(container);
		});
		// add text
		$('<div class="scene-text"/>')
		.html(this.model.text)
		.appendTo(container);
	}
});
var ChoiceBoxView = InteractiveView.extend({
	// expects this.model typeof Scene
	// expects this.model.choices typeof Array<Choice>
	choice: function(evt) {
		var choiceNo = $(evt.target).data('id');
		this.model.choose(choiceNo);
	},
	render: function() {
		var choices = this.model.choices;
		var visibility = choices && choices.length > 0;
		var container = this.$el.toggle(visibility).html('');
		_.each(choices, function(choice,i) {
			$('<button type="button" data-action="choice" />')
			.attr('data-id', i)
			.text(choice.text)
			.appendTo(container);
		});
	}
});
var SummaryView = ModelWatcherView.extend({
	// expects this.model typeof Hero(Character)
	initialize: function() {
		if (this.model) this.setModel(this.model);
	},
	render: function() {
		if (!this.model) return;
		var container = this.$('table').html('');
		_.each(this.model.getVisibleAttributes(), function(val,key) {
			container.append('<tr><td>'+key+'</td><td>'+val+'</td></tr>');
		});
	}
});
var MainView = Backbone.View.extend({
	initialize: function() {
		this.model = new SettingsModel();
		this.listenTo(this.model, 'change:character', this.onCharacterChange);
		this.listenTo(this.model, 'change:adventure', this.onAdventureChange);
		this.initOptions();
		this.initSummary();
		this.initScene();
	},
	initOptions: function() {
		this.optionsView = new OptionsView({
			el: this.$('nav'),
			model: this.model
		});
	},
	initSummary: function() {
		this.summaryView = new SummaryView({
			el: this.$('aside'),
			model: this.model.get('character')
		});
	},
	initScene: function() {
		this.adventureView = new AdventureView({
			el: this.$('article'),
			model: this.model.get('adventure')
		});
	},
	onCharacterChange: function() {
		this.summaryView.setModel(this.model.get('character'));
		this.summaryView.render();
	},
	onAdventureChange: function() {
		this.adventureView.setModel(this.model.get('adventure'));
		this.adventureView.render();
	},
	render: function(){
		this.optionsView.render();
		if (this.adventureView)
			this.adventureView.render();
		if (this.summaryView)
			this.summaryView.render();
	}
});
$(function(){
	//kickstarter function
	console.log("Kickstarting... now!");
	(new MainView({el: document.body})).render();
})