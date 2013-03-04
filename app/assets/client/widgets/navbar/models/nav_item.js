define([
  'sandbox'
], function (sandbox) {

  var MenuItem = sandbox.mvc.Model({

    //////////////// PUBLIC//////////

    isActive: function(windowPath) {
      return windowPath.endsWith(this.get('path'));
    }


  });

  return MenuItem;

});