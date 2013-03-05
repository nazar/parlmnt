define([
  'sandbox',

  'widgets/bill/models/bill'
],

function (sandbox, Bill) {

  var BillList = sandbox.mvc.Collection({

    model: Bill,

    initialize: function(options) {
      this.url = options.url;
    },

    //// PUBLIC

    fetchByYear: function(year) {
      return this.fetch({url: this.url({year: year, format: 'json'})});
    }

  });

  return BillList;

});