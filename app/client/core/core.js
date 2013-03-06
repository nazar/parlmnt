// ## Core
// Core module surfaces #Base abstractions and manages module lifecycles

define(['base'], function (base) {

  var core = {};

  // Expose functions from Base for use in Core
  core.routes = base.routes;

  // Surface Base definitions to Core
  //TODO don't need all of these - remove un-necessary surfaces
  core.dom      = base.dom;
  core.events   = base.events;
  core.mvc      = base.mvc;
  core.P        = base.P;
  core.template = base.template;
  core.util     = base.util;
  core.effects  = base.effects;


  core.util.shift = function(args) {
    var shift = [].shift;
    return shift.apply(args);
  };

  core.events = {
    publish: function() {
      var event = core.util.shift(arguments),
        args = arguments.length > 1 ? arguments : arguments[0];

      return base.events(event).broadcast(args);
    },

    subscribe: function() {
      var event = core.util.shift(arguments),
        args = arguments.length > 1 ? arguments : arguments[0];

      return base.events(event).subscribe(args);
    }
  };

  core.ajax = {
    request: base.ajax.request,
    post: function (url, data, success) {
      var auth_options = {},
        auth_key = $("meta[name='csrf-param']").attr('content'),
        auth_value = $("meta[name='csrf-token']").attr('content'),
        authData = data || {};

      auth_options[auth_key] = auth_value;

      Object.merge(authData, auth_options);

      return base.ajax.post(url, authData, success)
    }
  };



  return core;


});