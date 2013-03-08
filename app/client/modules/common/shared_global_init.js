define([
  'sandbox',

  'widgets/navbar/main',
  'widgets/session/main',
  'widgets/search/main'


], function (sandbox, navbarWidget, sessionWidget, searchWidget)  {


  return function() {

    var search, Router;

    Router = sandbox.mvc.Router({

      routes: {
        "bills/:id": 'showBill',
        "sponsors/:id": 'showSponsor'
      },

      showBill:function(id) {
        sandbox.publish('ShowBillPopup', {id: id});
      },

      showSponsor: function(id) {
        sandbox.publish('ShowSponsorPopup', {id: id});
      }
    });

    new Router();

    //session manager
    sandbox.session = sessionWidget();
    search = searchWidget({
      url: sandbox.routes.search_path
    });


    sandbox.subscribe('onRenderSession', function(options) {
      if (options.rendered) {
        options.rendered( sandbox.session.render().$el )
      }
    });

    sandbox.subscribe('onRenderSearch', function(options) {
      if (options.rendered) {
        options.rendered( search.render().$el )
      }
    });

    //start app widgets
    navbarWidget({
      el: '#navbar',
      items: {
        "Bills": {
          url: sandbox.routes.bills_path()
        },
        "Acts": {
          url: sandbox.routes.acts_path()
        },
        "MPs": {
          url: sandbox.routes.mps_path()
        },
        "Lords": {
          url: sandbox.routes.lords_path()
        },
        "API": {
          url: sandbox.routes.api_path()
        }

      }
    });


  }
});