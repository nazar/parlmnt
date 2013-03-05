define([
  'sandbox',

  'widgets/sponsor/models/sponsor'
],

function (sandbox, SponsorModel) {

  var SponsorCollection = sandbox.mvc.Collection({

    model: SponsorModel,

    initialize: function(options) {
      this.url = options.url;
    },

    //////////// PUBLIC

    fetchSponsors: function() {
      this.fetch({url: this.url({format: 'json'})});
    }



  });

  return SponsorCollection;

});