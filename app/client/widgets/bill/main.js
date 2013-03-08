define([
  'sandbox',

  'widgets/votable/main',
  'widgets/commentable/main',

  'widgets/bill/views/bills',
  'widgets/bill/views/bill_popup',
  'widgets/bill/collections/bill-list'

], function (sandbox, votableWidget, commentableWidget, BillsContainerView, BillsPopupView, BillCollection) {

  return function (options) {

    var billsView,
      votableBuilder,
      billPopupView,
      commentableBuilder,
      billCommentsPath;

    votableBuilder = options.votableBuilder || votableWidget;
    commentableBuilder = options.commentableBuilder || commentableWidget;

    billCommentsPath = options.commentsPath;

    if (options.collectionRootPath) {
      billsView = new BillsContainerView({
        el: sandbox.dom.$q(options.el),
        billCollection: new BillCollection({url: options.collectionRootPath})
      });
    }


    ////// PUB / SUBS


    sandbox.subscribe('ShowBillPopup', function(options) {

      billPopupView = new BillsPopupView({
        votableBuilder: votableBuilder,
        commentableBuilder: commentableBuilder
      });

      billPopupView.showBill(options);
    });

    sandbox.subscribe('BillPopupClosed', function(options) {
      window.location.hash = '';
    });

    sandbox.subscribe('Bill.RequestCommentable', function(options) {
      var commentable = commentableBuilder({
        $el: options.$el,
        commentable_id: options.commentable_id,
        commentable_type: 'Bill',
        comments_path: billCommentsPath
      });

      options.yield(commentable);
    });

    sandbox.subscribe('Bill.RequestVotable', function(options) {
      var votable = votableBuilder({
        $el: options.$el,
        votable_score: options.votable_score,
        votable_id: options.votable_id,
        votable_type: 'Bill'
      });

      options.yield(votable);
    });


    return billsView;
  };

});