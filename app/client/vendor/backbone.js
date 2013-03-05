//AMD wrapper for backbone and any backbone plugins we choose to use

define([
  'backbone-raw',
  'mutators',
  'sync-rails'
],
  function (Backbone) {
    return Backbone;
  }
);