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

var SettingsModel = Backbone.Model.extend({
	defaults: {character:{hp:3, mana:4, swag:2}}
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
var OptionsView = InteractiveView.extend({
	render: function(){
		// this.$el.text("OPTIONS ARE HERE")
	},
	newGame: function(){console.log('newGame')},
	load: function(){console.log('load')},
	save: function(){console.log('save')},
});
var SceneView = Backbone.View.extend({
	// expects this.model typeof Adventure
	initialize: function() {
		this.choiceBox = new ChoiceBoxView({el: this.$('footer')});
		this.situationView = new SituationView({el: this.$('section')});
		this.listenTo(this.model, 'change', this.render);
	},
	render: function() {
		var toRender = this.model.getCurrentContent();
		this.situationView.model = toRender;
		this.situationView.render();
		this.choiceBox.choices = toRender.choices;
		this.choiceBox.render();
	}
});
var SituationView = Backbone.View.extend({
	render: function() {
		this.html('');
	}
});
var ChoiceBoxView = InteractiveView.extend({
	choice: function(evt) {
		var choiceNo = $(evt.target).data('id');
		
	},
	render: function() {
		var visibility = this.choices && this.choices.length > 0;
		var container = this.$el.toggle(visibility).html('');
		_.each(this.choices, function(choice,i) {
			$('<button type="button" data-action="choice" />')
			.attr('data-id', i).text(choice.text).append(container);
		});
	}
});
var SummaryView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},
	render: function() {
		var container = this.$('table').html('');
		_.each(this.model.getVisibleAttributes(), function(val,key) {
			container.append('<tr><td>'+key+'</td><td>'+val+'</td></tr>');
		});
	}
});
var MainView = Backbone.View.extend({
	initialize: function() {
		this.model = new SettingsModel();
		this.listenTo(this.model, 'change:character', this.initSummary);
		this.listenTo(this.model, 'change:adventure', this.initScene);
		this.initOptions();
	},
	initOptions: function() {
		this.optionsView = new OptionsView({
			el: this.$('nav'),
			model: this.model
		});
	},
	initSummary: function() {
		if (this.summaryView) {
			this.summaryView.remove();
		}
		this.summaryView = new SummaryView({
			el: this.$('aside'),
			model: this.model.get('character')
		});
	},
	initScene: function() {
		if (this.sceneView) {
			this.sceneView.remove();
		}
		this.sceneView = new SceneView({
			el: this.$('article'),
			model: this.model.get('adventure')
		});
	},
	render: function(){
		this.optionsView.render();
		if (this.sceneView)
			this.sceneView.render();
		if (this.summaryView)
			this.summaryView.render();
	}
});
$(function(){
	//kickstarter function
	console.log("Kickstarting...");
	(new MainView({el: document.body})).render();
})