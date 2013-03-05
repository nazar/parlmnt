define([
  'sandbox'
], function (sandbox) {

  var SponsorModel = sandbox.mvc.Model({

    initialize: function(options) {

    },

    url: function() {
      return sandbox.routes.sponsor_path(this.get('id'), {format: 'json'});
    }


  });

  return SponsorModel;

});