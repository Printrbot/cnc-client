define([
  'app',
  'machine',
  'bootstrap',
  'text!templates/jog.html'
],

function(
  app,
  machine,
  bootstrap,
  Tpl
)
{
  var v = Backbone.View.extend(
  {

    initialize: function(o) {

      this.tpl = _.template(Tpl);

      var that = this;

      this.listenTo(machine.data, 'change:posx', function(e)
      {
        that.updateCoords(e);
      });
      this.listenTo(machine.data, 'change:posy', function(e)
      {
        that.updateCoords(e);
      });
      this.listenTo(machine.data, 'change:posz', function(e)
      {
        that.updateCoords(e);
      });

      this.listenTo(machine.data, 'change:unit', function(e)
      {
        that.render();
      });


      this.listenTo(machine.data, 'change:coords', function(e)
      {
        that.updateCoords(e);
      });

      this.listenTo(machine.data, 'change:coordinates', function(e)
      {
        that.updateCoords(e);
      });

    },

    events: {
      'click .dro-axis button.h': 'homeAxis',
      'click .dro-axis button.z': 'setZero',
      'click .units a[idx=mm]': 'changeUnits',
      'click .units a[idx=inch]': 'changeUnits',
      'mousedown .jog-xyz': 'onJog',
      'mouseup .jog-xyz': 'offJog',
      'change .jog-speed input': 'changeJogSpeed',
      'click .jog-type a': 'changeJogMode',
      'keyup .dro-axis input': 'onDroInput',
      'click .dro-axis ul.dropdown-menu li a': 'onSave'
    },

    onJog: function(e)
    {
      var b = $(e.currentTarget)
        , mode = machine.get('jog_mode')
        , feed = machine.get('jog_speed')
        , s = machine.get('jog_step')
        , ax = b.attr('ctrl')
        console.info("ON JOG");
      if (ax == 'y+') {
        if (mode == 'con') machine.command('G1F'+feed+'Y10000\n');
        else if (mode == 'inc') machine.moveBy('y',s);
      }
      else if (ax == 'y-') {
        if (mode == 'con') machine.command('G1F'+feed+'Y-10000\n');
        else if (mode == 'inc') machine.moveBy('y',-s);
      }
      else if (ax == 'x+') {
        if (mode == 'con') machine.command('G1F'+feed+'X10000\n');
        else if (mode == 'inc') machine.moveBy('x',s);
      }
      else if (ax == 'x-') {
        if (mode == 'con') machine.command('G1F'+feed+'X-10000\n');
        else if (mode == 'inc') machine.moveBy('x',-s);
      }
      else if (ax == 'z+') {
        if (mode == 'con') machine.command('G1F'+feed+'Z10000\n');
        else if (mode == 'inc') machine.moveBy('z',s);
      }
      else if (ax == 'z-') {
        if (mode == 'con') machine.command('G1F'+feed+'Z-10000\n');
        else if (mode == 'inc') machine.moveBy('z',-s);
      }
      else if (_.contains(['x0','y0','z0'], b.attr('ctrl'))) {
        var c = machine.get('coords')
          , a = b.attr('ctrl').substring(0,1);

        machine.command(c+'G0'+a+'0\n');
      }
    },

    offJog: function(e)
    {
      if (machine.get('jog_mode') == 'con')
          machine.command('!\n%\n~');
    },

    onDroInput: function(e)
    {
      if (e.keyCode == 27) {
        $(e.currentTarget).blur();
      }
      if (e.keyCode == 13) {
        var a = $(e.currentTarget).attr('ctrl')
          , v = $(e.currentTarget).val();

        machine.command('G0'+a+v);
        $(e.currentTarget).blur();
      }
    },

    changeUnits: function(e)
    {
        machine.setUnits($(e.currentTarget).attr('idx'));
        this.render();
    },

/*
    updateUnits: function()
    {
      if (machine.data.attributes.unit == 1) {
        $('div.jog-speed div.l').html('Speed (mm/min):')
        $('div.units button').html('<i class="fa fa-tachometer"></i> mm');
        $('div.units ul').html('<li><a href="#" idx="inch"><i class="fa fa-tachometer"></i> inch</a></li>');
      } else {
        $('div.jog-speed div.l').html('Speed (inch/min):')
        $('div.units button').html('<i class="fa fa-tachometer"></i> inch');
        $('div.units ul').html('<li><a href="#" idx="mm"><i class="fa fa-tachometer"></i> mm</a></li>');
      }
      $('div.coords button').append('<span class="caret"></span>');

    },

  */
    homeAxis: function(e)
    {
      var a = $(e.currentTarget).parent().find('label').html();
      machine.homeAxis(a);
      machine.getStatusReport();
    },

    setZero: function(e)
    {
      var a = $(e.currentTarget).parent().find('label').html();
      machine.zeroMachine(a);
    },

    getJogFeed: function(axis) {
      var m = machine.get('jog_speed');

      if (axis == "x")
          return machine.get('x').fr / 20 * m;
      if (axis == "y")
          return machine.get('y').fr / 20 * m;
      if (axis == "z")
          return machine.get('z').fr / 20 * m;
    },

    updateCoords: function(e)
    {
      $('input[ctrl=x]').val(e.attributes.posx);
      $('input[ctrl=y]').val(e.attributes.posy);
      $('input[ctrl=z]').val(e.attributes.posz);
    },

    changeJogSpeed: function(e)
    {
      if (machine.get('jog_mode') == 'con') {
        machine.set({'jog_speed': $(e.currentTarget).val()});
      } else {
        machine.set({'jog_step': $(e.currentTarget).val()});
      }
    },

    changeJogMode: function(e)
    {
      e.preventDefault();
      machine.set({'jog_mode': $(e.currentTarget).attr('idx')});
      this.render();
    },

    changeCoords: function(e)
    {
      e.preventDefault();
      machine.set({'coords': $(e.currentTarget).attr('idx')});
    },

    render: function()
    {
      this.$el.html(this.tpl({app:app, machine: machine}));
      return this.$el;
    }
  });

  return v;
});
