//
var jquery = require('jquery');
var TinyG = require("tinyg");

window.$ = jquery;
window.jQuery = jquery;

define([
	'machine'
],
function(
	machine
) {

	Backbone.View.prototype.views = [];

	Backbone.View.prototype.close = function(){

		_.each(this.views, function(v) {
			 v.close();
		});

		if (this.onClose) {
			this.onClose();
		}

		this.undelegateEvents();
		this.$el.removeData().unbind();
		this.unbind();
		this.stopListening();
		this.remove();
		Backbone.View.prototype.remove.call(this);
	}

	Backbone.View.prototype.loadView = function(view, view_id)
	{
		if (typeof this.views[view_id] !== 'undefined') {
			 this.views[view_id].close();
		}
		this.views[view_id] = view;
		return this.views[view_id];
	}

	var app = {
		'gcodeFile': null,
		'gcode': null,
		'programName': null
	};
	app.commandHistory = [];
	app.programLength = 0;

	window.g = new TinyG();

	g.on('error', function(e) {
		if (e.name=="TinyGOpenFirstError")
			app.channel.trigger('connection.error');
		console.error(e);
	});

	g.on('sentRaw', function(data, channel) {
		console.info(data);
		app.channel.trigger('machine.response', data)
  });

	g.on('open', function() {
		g.writeWithPromise('%\n{sr:{line:t,posx:t,posy:t,posz:t,unit:t,coor:t,dist:t,xfr:t,yfr:t,zfr:t,stat:t}}')
			.then(g.writeWithPromise('{x:n}\n{y:n}\n{z:n}'));
		app.channel.trigger('connection.success');
	});

	g.on('data', function(data) {
		console.info(data);
		app.channel.trigger('machine.response', data)
	});

	g.on('close', function() {
		app.channel.trigger('connection.closed');
	});

	g.on('statusChanged', function(st) {
		machine.updateFromReport(st);
	});

	process.on('uncaughtException', function (error) {
  // Handle the error
		if (error.name == 'TinyGError:' && error.data == 0) {
			app.channel.trigger('connection.error');
		}
		console.error(error)
	});


	//debugger

  app.channel = _.extend({}, Backbone.Events);


  return app;

});
