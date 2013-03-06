define([
  'sandbox',

  'widgets/session/views/session-manager'
],

  function (sandbox, SessionManagerView) {


    return function (options) {
      var session = new SessionManagerView(options);

      sandbox.subscribe('NeedRegistration', function() {
        session.startRegistration();
      });

      return session;
    };

  });