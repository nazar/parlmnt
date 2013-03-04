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
      commentableBuilder,
      billCommentsPath;

    votableBuilder = options.votableBuilder;
    commentableBuilder = options.commentableBuilder;
    billCommentsPath = options.commentsPath;

    billsView = new BillsContainerView({
      el: sandbox.dom.$q(options.el),
      billCollection: new BillCollection({url: options.collectionRootPath}),
      channel: options.channel,
      votableBuilder: votableBuilder,
      commentableBuilder: commentableBuilder
    });


    sandbox.subscribe('ShowBillPopup', function (options) {

      billPopupView = new BillsPopupView({
        votableBuilder: votableBuilder,
        commentableBuilder: commentableBuilder,
        commentsPath: billCommentsPath
      });

      billPopupView.showBill(options);
    });




    return billsView;
  };

});