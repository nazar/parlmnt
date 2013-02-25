/*global define*/

define(['core'], function (core) {

  var sandbox = {};

  sandbox.publish = core.events.publish;
  sandbox.subscribe = core.events.subscribe;

  sandbox.util = {
    bindAll: core.util.bindAll,
    each: core.util.each,
    rest: core.util.rest,
    delay: core.util.delay,
    extend: core.util.extend,
    cookie: core.util.cookie,

    mixinSessionData: function(jsonObj) {
      Object.merge(jsonObj, {
        name: sandbox.session.username(),
        avatar: sandbox.session.avatar()
      });
    }
  };

  sandbox.template = core.template;

  sandbox.mvc = core.mvc;
  sandbox.dom = core.dom;
  sandbox.P = core.P;

  sandbox.effects = core.effects;
  sandbox.Date    = core.Date;

  sandbox.ajax = core.ajax;

  sandbox.analytics = {
    init: core.analytics.init,

    identify: function(traits) {
      var baseTraits;

      traits = traits || {};

      if (sandbox.session) {
        baseTraits = {
          name: sandbox.session.username()
        };
        core.analytics.identify(sandbox.session.token(), Object.merge(baseTraits, traits))
      }
    },

    track: function(action, traits) {
      var user;

      traits = traits | {};
      user = sandbox.session ? sandbox.session.token() : 'anonymous';

      core.analytics.track(user, action, traits);

    }

  };

  return sandbox;

});