define([
  'sandbox',

  'widgets/votable/main',
  'widgets/commentable/main',

  'widgets/sponsor/collections/sponsors',

  'widgets/sponsor/views/sponsor_popup',
  'widgets/sponsor/views/sponsors'

], function (sandbox, votableWidget, commentableWidget, SponsorCollection, SponsorPopupView, SponsorsContainerView) {

  return function (options) {

    var sponsorsView,
      votableBuilder,
      commentableBuilder,
      commentsPath;


    votableBuilder = options.votableBuilder || votableWidget;
    commentableBuilder = options.commentableBuilder || commentableWidget;

    commentsPath = options.commentsPath;


    if (options.collectionRootPath) {
      sponsorsView = new SponsorsContainerView({
        el: sandbox.dom.$(options.el),
        sponsorType: options.sponsorType,
        sponsorCollection: new SponsorCollection({url: options.collectionRootPath})
      });
    }

    ///////// PUB SUBS


    sandbox.subscribe('ShowSponsorPopup', function (options) {
      var sponsorPopupView = new SponsorPopupView({
        votableBuilder: votableBuilder,
        commentableBuilder: commentableBuilder
      });

      sponsorPopupView.showSponsor(options);
    });


    sandbox.subscribe('Sponsor.RequestCommentable', function(options) {
      var commentable = commentableBuilder({
        $el: options.$el,
        commentable_id: options.commentable_id,
        commentable_type: 'Sponsor',
        comments_path: commentsPath
      });

      options.yield(commentable);
    });

    sandbox.subscribe('Sponsor.RequestVotable', function(options) {
      var votable = votableBuilder({
        $el: options.$el,
        votable_score: options.votable_score,
        votable_id: options.votable_id,
        votable_type: 'Sponsor'
      });

      options.yield(votable);
    });



    return sponsorsView;
  };

});