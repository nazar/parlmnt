// ## Base
// Base Module abstracts all dependencies and presents these higher up the chain by only picking and exposing required library functionality

define([

  'jquery',
  'underscore',
  'backbone',
  'dust',
  'dust-custom-helpers',
  'q',
  'radio',
  'routes',
  'analytics'

], function ($, _, Backbone, Dust, DustCustomHelpers, Q, Radio, Routes, A) { //
  return {

    // dom wraps jQuery and exposes certain jQuery functions
    dom: {
      $q: function (selector, context) {
        if (context) {
          return $(context).find(selector);
        } else {
          return $(selector);
        }
      },
      $: $,
      callbacks: $.Callbacks
    },

    //Promises wrapper
    P: {
      defer: Q.defer,
      when: Q.when,
      then: Q.then,
      fail: Q.fail,
      fin: Q.fin,
      all: Q.all
    },

    // Wraps jQuery get and return promise. Assume promises will always be present in ajax.request
    ajax: {
      request: function (url, data) {
        return $.get(url, data, 'json');
      }
    },

    // expose Backbone classes
    mvc: {
      Model: function (properties, classProperties) {
        return Backbone.Model.extend(properties, classProperties);
      },

      View: function (properties, classProperties) {
        return Backbone.View.extend(properties, classProperties);
      },

      Collection: function (properties, classProperties) {
        return Backbone.Collection.extend(properties, classProperties);
      },

      Router: function(properties, classProperties) {
        return Backbone.Router.extend(properties, classProperties);
      },

      startHistory: function(options) {
        Backbone.history.start(options)
      }
    },

    //expose Dust plus any helpers we might require
    template: {
      render: function (name, attributes, doneCb) {
        attributes = attributes || {};
        Dust.render(name, attributes, function (e, o) {
          if (e) {
            throw e;
          } else {
            doneCb(o);
          }
        });
      }
    },

    events: Radio,


    util: {
      bindAll: function() {
        return _.bindAll.apply(this, arguments);
      },
      decamelize: function (camelCase, delimiter) {
        delimiter = (delimiter === undefined) ? '_' : delimiter;
        return camelCase.replace(/([A-Z])/g, delimiter + '$1').toLowerCase();
      },
      // Camelize a string
      //
      // * [https://gist.github.com/827679](camelize.js)
      //
      // * **param:** {string} str String to make camelCase
      camelize: function (str) {
        return str.replace(/(?:^|[\-_])(\w)/g, function (delimiter, c) {
          return c ? c.toUpperCase() : '';
        });
      },
      // Always returns the fn within the context
      //
      // * **param:** {object} fn Method to call
      // * **param:** {object} context Context in which to call method
      // * **returns:** {object} Fn with the correct context
      method: function (fn, context) {
        return $.proxy(fn, context);
      },
      // Get the rest of the elements from an index in an array
      //
      // * **param:** {array} arr The array or arguments object
      // * **param:** {integer} [index=0] The index at which to start
      delay: function () {
        return _.delay.apply(this, arguments);
      },

      // jQuery stuff
      parseJson: $.parseJSON,

      // underscore stuff
      each: _.each,
      extend: _.extend,
      rest: _.rest,
      isObject: _.isObject,
      isArray: _.isArray,
      cookie: $.cookie,

      shift: [].shift
    },

    analytics: analytics,

    routes: window.Routes

  };


});