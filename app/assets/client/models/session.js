define([
  'sandbox'
], function (sandbox) {

  var Session = sandbox.mvc.Model({

    defaults: {
      token: null,
      user: null
    },

    initialize: function() {
      this._load();
    },

    authenticated: function() {
      return Object.isString(this.get('token'));
    },



    ///// PRIVATE

    _load: function() {
      this.set({
        user: sandbox.util.cookie('user'),
        token: sandbox.util.cookie('token')
      });
    }



  });

  return Session;

});