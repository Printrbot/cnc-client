define([
  'app',
  'text!templates/connection.html'
],

function(
  app,
  Tpl
)
{
  var ConnectionView = Backbone.View.extend(
  {
    initialize: function(o) {
      this.tpl = _.template(Tpl);
      this.connectionError = false;

      var that = this;
      app.channel.bind('connection.error', function(e) {
        //  chrome.app.window.current().innerBounds.setSize(380,417);
        that.connectionError = true;
        that.render();
        app.channel.trigger('screen.autoresize', true);
      })

      if (!app.connected && !app.connecting)
        this.connect();
    },

    events: {
      'click button.connect-button': 'connect'
    },

    connect: function()
    {
      this.connectionError = false;
      this.render();
      g.openFirst();
    },

    render: function()
    {
      this.$el.html(this.tpl({app:app, error: this.connectionError }));
      return this.$el;
    }
  });

  return ConnectionView;
});
