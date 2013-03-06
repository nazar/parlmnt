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
    cookie: core.util.cookie
  };

  sandbox.template = core.template;

  sandbox.mvc = core.mvc;
  sandbox.dom = core.dom;
  sandbox.P = core.P;

  sandbox.effects = core.effects;
  sandbox.Date    = core.Date;

  sandbox.ajax = core.ajax;

  sandbox.routes = core.routes;

  return sandbox;

});