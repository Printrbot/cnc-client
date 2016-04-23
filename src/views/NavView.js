define([
  'app',
  'text!templates/nav.html'
],

function(
  app,
  Tpl
)
{
  var NavView = Backbone.View.extend(
  {
    initialize: function(o) {
      //this.activeView = 'program';
      this.tpl = _.template(Tpl);
    },

    events: {
      'click .program-page-btn': 'onDashboardPage',
      'click .console-page-btn': 'onConsolePage'
    },

    onDashboardPage: function(e)
    {
      Backbone.history.navigate('dashboard', true);
    },



    onConsolePage: function(e)
    {
      Backbone.history.navigate('console', true);
    },

    render: function()
    {
      this.$el.append(this.tpl({app:app}));
      return this.$el;
    }
  });

  return NavView;
});
