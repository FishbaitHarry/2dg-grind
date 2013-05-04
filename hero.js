var MyObject = require('myobject');

var Hero = Character.extend({
	defaults: {
		level: 1,
		xp: 0,
		attributes: {},
		abilities: [],
		equipment: [],
		status: []
	},
	
	serialize: function(){}
	/* private */
	
});

var LevelingActionModule = {
	levelUp: function(hero){
		var reqXp = hero.level * 1000;
		if(hero.xp >= reqXp) {
			hero.xp -= reqXp;
			hero.level += 1;
			hero.trigger('levelup');
			return true;
		} else {
			return false;
		}
	}
}

exports.hero = Hero;