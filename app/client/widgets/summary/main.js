define([
  'sandbox',

  'widgets/summary/views/summary'

], function (sandbox, SummaryView) {

  return function (options) {

    var summaryView = new SummaryView(options);

    return summaryView;
  };

});