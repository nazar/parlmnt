define([
  'sandbox'
],

  function (sandbox) {

  var AppView = sandbox.mvc.View({

    events: {

    },

    initialize: function (options) {
      this.sessionEl = options.sessionEl;

      this.render();
    },

    render: function () {
      var that = this;

      sandbox.template.render('navbar/templates/navbar', {}, function (o) {
        that.$el.html(o);
        that._renderSession();
      });

      return this;
    },


    //// PRIVATE

    _renderSession: function() {
      this.$el.find(this.sessionEl).html(sandbox.session.render().$el);
    }


  });

  return AppView;

});