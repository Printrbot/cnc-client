define([
  'app',
  'machine',
  'text!templates/status.html'
],

function(
  app,
  machine,
  Tpl
)
{

  var v = Backbone.View.extend(
  {
    initialize: function(o) {
      this.tpl = _.template(Tpl);
      var that = this;

      machine.data.on('change:stat', function(c) {
        if (c.changed.stat != undefined)
          that.updateStatusText(c.attributes.stat);
      })
    },

    events: {

    },

    status_codes: [
      "machine is initializing",
      "machine is ready for use",
      "machine is in alarm state (shut down)",
      "program stop or no more blocks",
      "program end via M2, M30, M60",
      "motion is running",
      "motion is holding",
      "probe cycle active",
      "machine is running (cycling)",
      "machine is homing",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "resetting, please wait..."
    ],

    updateStatusText: function(v)
    {
      $('.machine-status span').html(this.status_codes[v]);
    },

    render: function()
    {
      this.$el.append(this.tpl({app:app}));
      return this.$el;
    }
  });

  return v;
});
