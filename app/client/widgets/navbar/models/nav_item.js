define([
  'sandbox'
], function (sandbox) {

  var MenuItem = sandbox.mvc.Model({

    //////////////// PUBLIC//////////

    isActive: function(windowPath) {
      var path = this.get('path');

      //path can be a string or an array
      if (Array.isArray(path)) {
        return path.any(windowPath) || path.any(windowPath.remove(/^\//))
      } else {
        return windowPath.endsWith(this.get('path'));
      }
    }


  });

  return MenuItem;

});