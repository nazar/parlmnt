define([
  'sandbox',

  'widgets/votable/views/votable'

], function (sandbox, VotableView) {

  return function (options) {

    var votableView = new VotableView(options);

    return votableView;
  };

});