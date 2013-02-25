define([
  'sandbox',

  'widgets/bill/views/bills',
  'widgets/bill/views/bill_popup',
  'widgets/bill/collections/bill-list'

], function (sandbox, BillsContainerView, BillsPopupView, BillCollection) {

  return function (options) {

    var billsView,
      votableBuilder,
      billPopupView,
      commentableBuilder;

    votableBuilder = options.votableBuilder;
    commentableBuilder = options.commentableBuilder;

    billsView = new BillsContainerView({
      el: sandbox.dom.$q(options.el),
      billCollection: new BillCollection(),
      channel: options.channel,
      votableBuilder: votableBuilder,
      commentableBuilder: commentableBuilder
    });


    sandbox.subscribe('ShowBillPopup', function (options) { //('bills',

      billPopupView = new BillsPopupView({
        votableBuilder: votableBuilder,
        commentableBuilder: commentableBuilder
      });

      billPopupView.showBill(options);
    });




    return billsView;
  };

});