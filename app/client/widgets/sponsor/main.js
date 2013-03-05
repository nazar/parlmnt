define([
  'sandbox',

  'widgets/sponsor/collections/sponsors',

  'widgets/sponsor/views/sponsor_popup',
  'widgets/sponsor/views/sponsors'

], function (sandbox, SponsorCollection, SponsorPopupView, SponsorsContainerView) {

  return function (options) {

    var sponsorsView,
      votableBuilder,
      commentableBuilder,
      billCommentsPath;


    votableBuilder = options.votableBuilder;
    commentableBuilder = options.commentableBuilder;
    billCommentsPath = options.commentsPath;

    sponsorsView = new SponsorsContainerView({
      el: sandbox.dom.$(options.el),
      sponsorType: options.sponsorType,
      sponsorCollection: new SponsorCollection({url: options.collectionRootPath}),
      votableBuilder: votableBuilder,
      commentableBuilder: commentableBuilder
    });


    sandbox.subscribe('ShowSponsorPopup', function (options) {
      var sponsorPopupView = new SponsorPopupView({
        votableBuilder: votableBuilder,
        commentableBuilder: commentableBuilder,
        commentsPath: billCommentsPath
      });

      sponsorPopupView.showSponsor(options);
    });

    return sponsorsView;
  };

});