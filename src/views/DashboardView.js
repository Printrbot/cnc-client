define([
  'app',
  'views/NavView',
  'views/StatusView',
  'views/JogView',
  'views/ControlView',
  'views/ProgramView'
],

function(
  app,
  NavView,
  StatusView,
  JogView,
  ControlView,
  ProgramView
)
{
  var v = Backbone.View.extend(
  {
    initialize: function(o) {

    },

    events: {
//      'click button.connect-button': 'connect'
    },


    render: function()
    {

      var nv = this.loadView(new NavView(), 'nav');
      this.$el.html(nv.render());

      var jv = this.loadView(new JogView(), 'jog');
      this.$el.append(jv.render());

      var sv = this.loadView(new StatusView(), 'stat');
      this.$el.append(sv.render());

      var cv = this.loadView(new ControlView(), 'ctrl');
      this.$el.append(cv.render());

      var pv = this.loadView(new ProgramView(), 'program');
      this.$el.append(pv.render());


      //this.$el.append(this.tpl({app:app}));

      return this.$el;
    }
  });

  return v;
});
