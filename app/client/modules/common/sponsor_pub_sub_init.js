define([
  'sandbox'

], function (sandbox)  {


  return function(options) {

    var summary = options.summary,
      sponsors = options.sponsors,
      tracking = options.tracking;

    sandbox.analytics.init();
    sandbox.analytics.identify();
    sandbox.analytics.track(tracking);


    sandbox.subscribe('aboutToReload', function () {
      summary.startLoader();
    });

    sandbox.subscribe('sponsorsLoaded', function () {
      summary.stopLoader();
    });

    sandbox.subscribe('summaryChanged', function (summaryObject) {
      summary.setTitleFromSummary(summaryObject);
    });

    sandbox.subscribe('FilterChanged', function (selections) {
      sponsors.filteringAndSorting(selections);
    });

    sandbox.subscribe('SponsorSearchName', function (term) {
      sponsors.showMatchedSponsors(term);
    });

    sandbox.subscribe('relayout', function () {
      sponsors.relayout();
    });

    sandbox.subscribe('sessionReload', function() {
      sandbox.session.reload();
    });

    sponsors.loadSponsors();
  }
});