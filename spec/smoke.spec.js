describe( "My coding environment", function() {

	it( "can require my project's files", function() {
		var bm = require('../src/battle');
		var cm = require('../src/character');

		expect(bm).toBeDefined();
		expect(cm).toBeDefined();
	});

	it( "can run the simplest battle sequence", function() {
		var bm = require('../src/battle');
		var cm = require('../src/character');

		var m1 = new cm.GenericMonster();
		var m2 = new cm.GenericMonster();

		var exBattle = new bm.Battle({
			participants: [m1, m2]
		});

		expect(exBattle.round).toEqual(1);

		exBattle.resolveCombatRound();
		exBattle.resolveCombatRound();
		exBattle.resolveCombatRound();
		exBattle.resolveCombatRound();

		expect(exBattle.round).toEqual(5);

		// bm.BattleLogFormatter.consumeLog(exBattle.log);
	});

});