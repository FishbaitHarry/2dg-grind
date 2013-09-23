var Character = require('../src/character').Character;
var monster = require('../src/character').GenericMonster;

describe( "Character", function() {
	var character;

	beforeEach( function() {
		character = new monster();
	});

	it( "provides some basic description", function() {
		expect(character.name).toBeDefined();
		expect(character.icon).toBeDefined();
		expect(character.description).toBeDefined();
	});

	it( "participates in battle", function() {
		var mockBattle = {participants: [character]};
		var actions = character.getActions(mockBattle);
		expect(actions.length).toBeGreaterThan(0);
	});

	it( "can be serialized and deserialized", function() {
		var json = character.toJSON();
		var serialized = JSON.stringify(json);
		expect(serialized.length).toBeGreaterThan(0);
		var copy = Character.fromJSON(json);
		expect(copy instanceof Character).toBeTruthy();
	});

	describe( "it's attributes", function() {
		it( "can be always accessed", function() {
			expect(character.getAttr('attack')).toBeDefined();
			expect(character.getAttr('defense')).toBeDefined();
			expect(character.getAttr('level')).toBeDefined();
			expect(character.getAttr('nonsense')).toBeDefined();
		});
		it( "are numeric values", function() {
			expect(isFinite(character.getAttr('attack'))).toBeTruthy();
			expect(isFinite(character.getAttr('nonsense'))).toBeTruthy();
		});
		it( "have a visible subset", function() {
			expect(isFinite(character.getAttr('attack'))).toBeTruthy();
			expect(isFinite(character.getAttr('nonsense'))).toBeTruthy();
		});
	});

});