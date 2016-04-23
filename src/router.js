define([
    'app',
    'views/TopView'
],

function(
    app,
    TopView
)
{
    var AppRouter = Backbone.Router.extend(
    {

        initialize: function()
        {
            var that = this;
            this.topView = new TopView({el: $('#topView')});
        },

        routes:
        {
            '/': 'showConnect',
            'dashboard': 'showDashboard',
            'console': 'showConsole',
            '*actions':'showConnect'
        },

        showConnect: function(e)
        {
            app.selectedView = 'connection';
            this.topView.render();
        },

        showDashboard: function(e)
        {
            app.selectedView = 'dashboard';
            this.topView.render();
        },

        showConsole: function(e)
        {
            app.selectedView = 'console';
            this.topView.render();
        },

    });

    return AppRouter;
});
