define([
  'app'
],
function(
  app
) {

    var that = null;

    var mmodel = Backbone.Model.extend({
        defaults:
        {
            default_speed_mm:100,
            default_speed_in:0.1,
            jog_speed: 800,
            jog_step: 1,
            jog_mode: 'con',
            coords: 'g54',
            posx: 0,
            posy: 0,
            posz: 0
        }
    });

    function Machine()
    {
        this.running = false;
        this.serialPortSpeed = 115200;
        this.serialQueue = [];
        this.responseBuffer = "";
        this.queueAvailable = 28;

        this.data = new mmodel();

/*
        this.data.on('change:unit', function(d) {
          if(d.attributes.unit == 1 && d.attributes.jog_mode == 'jog')
            d.set({jog_speed:d.attributes.zvf});
        })
*/
        that = this;
    }

    Machine.prototype.get = function(e)
    {
        return this.data.get(e);
    };

    Machine.prototype.set = function(e)
    {
        return that.data.set(e);
    };

    Machine.prototype.trigger = function(e)
    {
        that.data.trigger(e);
    }

    Machine.prototype.onConnectionError = function(e)
    {
        that.connected = false;
        channel.trigger('connection.error', e);
    }

    Machine.prototype.command = function(data, cb) {
      console.info("writing to g")
      if (!cb)
        cb = function() {};
      g.serialPortData.write(data+"\n");
      //g.write(data);
      console.info("done writing to g")
    }

    Machine.prototype.homeAxis = function(axis)
    {
        that.command('{"gc": "G28.2 _AXIS_0"}'.replace("_AXIS_", axis));
    }

    Machine.prototype.getStatusReport = function()
    {
        that.command('{"sr":""}');
    }

    Machine.prototype.zeroMachine = function(axis)
    {
        that.command('{"gc": "G28.3 _AXIS_0"}'.replace('_AXIS_', axis));
        that.command('{"sr":""}');
    },

    Machine.prototype.pauseAndFlush = function()
    {
      g.flush();
    }

    Machine.prototype.moveBy = function(axis, distance)
    {
      that.command('G91');
      that.command('G0 '+axis+distance);
      that.command('G90');
    }

    Machine.prototype.updateFromReport = function(sr)
    {
        this.data.set(sr);
    }

    Machine.prototype.setUnits = function(unit)
    {
        if (unit == 'mm')
          that.command('{"gc": "G21"}');
        else
          that.command('{"gc": "G20"}');

        that.command('{"sr":""}')
    }



    return new Machine();


});
