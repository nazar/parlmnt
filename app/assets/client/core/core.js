// ## Core
// Core module surfaces #Base abstractions and manages module lifecycles

define(['base'], function (base) {

  var core = {};

  // Expose functions from Base for use in Core
  core.routes = base.routes;

  // Surface Base definitions to Core
  //TODO don't need all of these - remove un-necessary surfaces
  core.ajax     = base.ajax;
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

  core.analytics = {
    init: function() {
      base.analytics.initialize({
        "Google Analytics": 'UA-919326-10'
      });
    },

    identify: function(user, traits) {
      base.analytics.identify(user, traits);
    },

    track: function(user, action, traits) {
      base.analytics.track(user, action, traits);
    }
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


  return core;


});