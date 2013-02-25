define([
  'sandbox',

  'widgets/bill/models/bill'
],

function (sandbox, Bill) {

  var BillList = sandbox.mvc.Collection({

    model: Bill,
    url : '/bills',

    //// PUBLIC

    fetchByYear: function(year) {
      return this.fetch({url: '/bills.json?year={year}'.assign({year: year})});
    },

    billIds: function() {
      var result = [];

      this.forEach(function(bill) {
        result.push(bill.get('id'));
      });
      return result.unique();
    }

  });

  return BillList;

});