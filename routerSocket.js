<<<<<<< HEAD

let users = require('./socketUsers');
let admin = require('./socketAdmin');
// Router Websocket

module.exports = function(app, redT) {
	app.ws('/ws', function(ws, req) {
		users(ws, redT);
	});
	app.ws('/wssocket', function(ws, req) {
		admin(ws, redT)
	});
};
=======

let users = require('./socketUsers');
let admin = require('./socketAdmin');
// Router Websocket

module.exports = function(app, redT) {
	app.ws('/ws', function(ws, req) {
		users(ws, redT);
	});
	app.ws('/wssocket', function(ws, req) {
		admin(ws, redT)
	});
};
>>>>>>> b9e5ea0e7c3903f624a8df24198716622345bf5b
