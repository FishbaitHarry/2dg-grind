// here goes the ui
// note: I don't require jquery, it is currently an asset

$(function(){
	//kickstarter function
	var MainView = require('./views').MainView;
	console.log("Kickstarting... now!");
	(new MainView({el: document.body})).render();
});