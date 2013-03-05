define([
  'sandbox',
  './views/app'
], function (sandbox, AppView) {

  return function (options) {
    var navbarView =  new AppView(options);

    return navbarView;
  };

});