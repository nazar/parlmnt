define([
  'sandbox'
], function (sandbox) {

  var UserModel = sandbox.mvc.Model({

    urlRoot: '/sessions',

    defaults: {
      "loggedIn": false,
      "token": ''
    },

    initialize: function(options) {
      this.getMyDetails();
    },

    isRegistered: function() {
      return this.get('loggedIn');
    },

    getMyDetails: function() {
      var that = this;
      sandbox.ajax.request('/sessions/me')
      .done(function(data) {
        //data = JSON.parse(data);
        if (data && data['name']) {
          that.set(data);
          that.set('loggedIn', true);
        } else {
          that.set('loggedIn', false);
        }
      });
    }




  });

  return UserModel;

});