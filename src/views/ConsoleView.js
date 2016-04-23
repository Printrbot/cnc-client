define([
  'app',
  'views/NavView',
  'views/StatusView',
  'machine',
  'text!templates/console.html'
],
function(
  app,
  NavView,
  StatusView,
  machine,
  Tpl
)
{
  var v = Backbone.View.extend(
  {
    initialize: function(o) {
      this.historyIndex = 1;
      this.tpl = _.template(Tpl);
      this.listenTo(app.channel, 'machine.response', function(s) {
        if (app.selectedView == 'console') {
          var c = $('.console-out');
          c.append('<div class="line">'+s+'</div>');
          c.scrollTop(c.prop("scrollHeight"));
        }
      })
    },

    events: {
      'keyup input.console-in': 'keypress'
    },

    keypress: function(e)
    {
      // arrow up
      if (e.keyCode == 38) {
        if (app.commandHistory.length > 0 && this.historyIndex <= app.commandHistory.length) {
          var c = app.commandHistory[app.commandHistory.length - this.historyIndex];
          $('input.console-in').val(c);
          this.historyIndex++;
        }
      }

      // enter
      else if (e.keyCode == 13) {
        this.historyIndex = 1;
        this.runCommand();
      }
    },

    runCommand: function()
    {
      var cmd = $('input.console-in').val();
      if (cmd != "") {
        machine.command(cmd)
        app.commandHistory.push(cmd);
        $('div.console-out').append('<div class="line">'+cmd+'</div>');
      }
      $('input.console-in').val('');
    },

    render: function()
    {
      var nv = this.loadView(new NavView(), 'nav');
      this.$el.html(nv.render());

      this.$el.append(this.tpl({app:app, machine: machine}));

      var sv = this.loadView(new StatusView(), 'stat');
      this.$el.append(sv.render());

      return this.$el;
    }
  });
  return v;
});
