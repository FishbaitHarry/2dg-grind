var bm = require('../src/battle');
var cm = require('../src/character');

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
//console.log(JSON.stringify(exBattle));
//console.log(JSON.stringify(exBattle.log));
console.log("trololo");