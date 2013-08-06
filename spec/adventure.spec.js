var Adventure = require('../src/adventure');
describe( "Adventure", function() {
	var adv;

	beforeEach( function() {
		adv = new Adventure();
	});

	it( "provides some basic description", function() {
		expect(adv.name).toBeDefined();
		expect(adv.description).toBeDefined();
	});

	it( "provides current scene", function() {
		var scene = adv.getScene();
		var actions = this.character.getActions();
		expect(actions.length).toBeGreaterThan(0);
	});

	describe( "current scene", function() {
		it( "is an object", function() {
			var scene = adv.getScene();
			expect(scene instanceof Object).toBeTruthy();
		});
		it( "has a type", function() {
			var scene = adv.getScene();
			expect(scene.type).toBeDefined();
			var allowedType = ['battle','dialog'];
			expect(allowedType.indexOf(scene.type) > -1).toBeTruthy();
		});
		it( "has important attrs", function() {
			var scene = adv.getScene();
			expect(scene.actors).toBeDefined();
			expect(scene.text).toBeDefined();
			expect(scene.choices).toBeDefined();
		});
	});

});