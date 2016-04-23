var fs = require('fs');
var lbl = require('line-by-line');

define([
  'app',
  'machine',
  'text!templates/program.html'
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
        var that = this;
        this.tpl = _.template(Tpl);

        this.program = "";
        this.programLength = 0;
        this.running = false;

        machine.data.on('change:stat', function(c) {
          if ((c.attributes.stat == 4 || c.attributes.stat == 3) && that.running)
              that.onProgramCompleted();

          else if (c.attributes.stat == 6) {
            $('button.program-pause').addClass('active');
            $('button.program-pause span').html('Continue');
          }
          else if (c.attributes.stat == 5) {
            $('button.program-pause').removeClass('active');
            $('button.program-pause span').html('Pause');
          }
        })

        this.listenTo(app.channel, 'stop-and-flush', function(e) {
          //machine.pauseAndFlush();
          //this.onProgramCompleted();
          this.render();
        }, this)

        machine.data.on('change:line', function(c) {
          var _p = Math.round(c.attributes.line / (app.programLength / 100)) + "%";
          $('.program-progress .progress-bar').css('width', _p).html(_p)
        });
      },

      events: {
        'click button.program-start': 'programStart',
        'click button.program-stop': 'programStop',
        'click button.program-load': 'programLoad',
        'click button.program-clear': 'clearProgram',
        'click button.program-pause': 'pauseProgram',
        'change input.file-upload': 'uploadFile'
      },


      clearProgram: function()
      {
        this.program = '';
        app.programName = null;
        app.gcode = null;
        app.gcodeFile = null;
        this.render();
        app.channel.trigger('screen.autoresize', true);
      },

      pauseProgram: function()
      {
        if (machine.data.attributes.stat == 6) {
          machine.command('~');
          return;
        }

        if (this.running)
          machine.command("!");
      },

      processCode: function(code)
      {
        this.program = code.trim();

        // Split collected data by line endings
        var lines = this.program.split(/(?:\r\n|\r|\n)+/);
        lines = lines.filter(function(line) {
          return !line.match(/^\s*$/);
        });

        var cnt = 0;
        lines = lines.map(function (line) {
          lineMatch = line.match(/^(?:[nN][0-9]+\s*)?(.*)$/);
          if (lineMatch) {
            cnt++;
          }
          return line;
        })

        app.programLength = cnt;

        app.gcode = (code);
      },

      onProgramCompleted: function()
      {
        this.running = false;
        this.render();
        app.channel.trigger('screen.autoresize', true);
      },

      programStart: function(e)
      {
        this.running = true;
        //$('.program-progress .progress-bar').css('width', 0).html('0%')
        // flush the machine buffer
        g.write('%');
        /*
        try {
         if (fs.statSync(__dirname + "/active.gcode")) {
           // delete it
           fs.unlinkSync(__dirname + "/active.gcode");
         }
        } catch (err) {
        }

        var rstream = new lbl(app.gcodeFile.path);
        var wstream = fs.createWriteStream(__dirname + "/active.gcode");
        //debugger

        rstream.on('error', function(err) {
            // todo
            debugger
        });

        rstream.on('line', function(line) {

          if (line == "M0") {
            line = "!";
          }
          wstream.write(line + "\n");
        });

        rstream.on('end', function() {
          wstream.end();
          g.sendFile(__dirname + "/active.gcode", function() {
            app.channel.trigger('file.sent')
          });
        });


        // pre-process the gcode to replace M0 with ~ (feed hold) commands
        // since tinyg does not stop on M0 (or M1)

        // todo

        // if "M1 optional stop" is on, replace M1 with ~ (feed hold)


        */

        g.sendFile(app.gcodeFile.path, function() {
          app.channel.trigger('file.sent')
        });

        $('.program-view').addClass('running');
        app.channel.trigger('screen.autoresize', true);


      },

      uploadFile: function(e)
      {
        var file = e.currentTarget.files[0];
        app.gcodeFile = file;
        var reader = new FileReader();
        var that = this;
        var name = file.name;

        reader.onload = function(e) {
          that.processCode(e.target.result);
          app.programName = name;
          that.render();
          app.channel.trigger('screen.autoresize', true);
        };
        reader.readAsText(file);
      },

      programLoad: function(e)
      {
        $('input.file-upload').trigger('click');
      },


      render: function()
      {
        this.$el.html(this.tpl({app:app}));
        return this.$el;
      }
  });
  return v;
});
