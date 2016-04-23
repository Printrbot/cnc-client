var remote = require('remote');

define([
  'app',
  'views/NavView',
  'views/ConnectionView',
  'views/DashboardView',
  'views/ConsoleView'
],

function(
  app,
  NavView,
  ConnectionView,
  DashboardView,
  ConsoleView
)
{

    var v = Backbone.View.extend(
    {
        id: 'topView',

        className: 'index-view container-fluid',

        initialize: function()
        {
          var that = this;
          app.channel.bind('connection.success', function(e) {
              app.selectedView = 'dashboard';
              app.connected = true;
              app.connecting = false;
              that.render();
          });

          app.channel.bind('connection.closed', function(e) {
              app.selectedView = 'connection';
              app.connected = false;
              app.connecting = false;
              that.render();
          })

          app.channel.bind('connection.error', function(e) {
              app.selectedView = 'connection';
              app.connected = false;
              app.connecting = false;
              that.render();
          })

          app.channel.bind('screen.autoresize', function(e) {
            var win = remote.getCurrentWindow();
            win.setSize($('.content').width(), ($('.content').height() + 70));
          });

          if (!app.connected && !app.connecting) {
            app.connecting = true;
            g.openFirst();
          }
        },

        events: {

        },


        render: function()
        {
            if (app.selectedView == 'connection') {
                var v = this.loadView(new ConnectionView(), 'connection');
                this.$el.html(v.render());
            }

            if (app.selectedView == 'dashboard') {
                var v = this.loadView(new DashboardView(), 'dashboard');
                this.$el.html(v.render());
            }

            if (app.selectedView == 'console') {
                var v = this.loadView(new ConsoleView(), 'console');
                this.$el.html(v.render());
            }

            app.channel.trigger('screen.autoresize', true);

            return this.$el;
        }
    });

    return v;

});
