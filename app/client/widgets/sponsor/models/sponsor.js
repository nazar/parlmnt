define([
  'sandbox'
], function (sandbox) {

  var SponsorModel = sandbox.mvc.Model({

    initialize: function(options) {

    },

    url: function() {
      return sandbox.routes.sponsor_path(this.get('id'), {format: 'json'});
    },

    /////////// PUBLIC

    sponsorParty: function() {
      var party = this.get('party_name'),
        short;

      short = {
        "Democratic Unionist": 'DemUnionist',
        "Green Party": 'Greens',
        "Labour/Co-operative": 'Lab/Co-op',
        "Liberal Democrat": 'Lib Dem',
        "Plaid Cymru": 'PlaidCymru',
        "Scottish National Party": 'SNP',
        "Speaker of the House": 'Speaker',

        "Labour Independent": 'LabInd',
        "Non-affiliated": 'None',
        "Ulster Unionist Party": 'Ulster',
        "UK Independence Party": 'UKIP'
      };

      return short[party] || party;

    },

    firstName: function() {
      return this.get('name').split(' ').first();
    },

    lastName: function() {
      return this.get('name').split(' ').last();
    }


  });

  return SponsorModel;

});