var  requirejsconfig = ({
    //appDir: ".", //this is where the project is
	baseUrl: ".",
	//dir: "./built",
    paths: {
        //jquery: "some/other/jquery"
    },
    //modules: [ {name:"test"} ],
	name: "test",
    out: "built/test-built.js",
	fileExclusionRegExp: /\.git/
})

var gluejs = require('gluejs');
new gluejs()
  .basepath('./src') // output paths are relative to this
  .include('./src')  // includes all files in the dir
  .export('App') // the package is output as window.App
  .npm('underscore','./')
  .render(function (err, txt) {
    // or write the result to a file
    require('fs').writeFile('./app.js', txt);
  });