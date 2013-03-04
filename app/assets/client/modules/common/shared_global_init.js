define([
  'sandbox',

  'widgets/navbar/main',
  'widgets/session/main'


], function (sandbox, navbarWidget, sessionWidget)  {


  return function() {

    //session manager
    sandbox.session = sessionWidget();

    //start app widgets
    navbarWidget({
      el: '#navbar',
      sessionEl: '#session',
      items: {
        "Bills": {
          url: sandbox.routes.bills_path()
        },
        "Acts": {
          url: sandbox.routes.acts_path()
        }
      }
    });

  }
});