//AMD wrapper for jquery and any $ dependant plugins we choose to use

define([
  'jquery-raw',
  'isotope',
  'bootstrap',
  'bootstrap-modal',
  'bootstrap-modalmanager',
  'cookie',
  'lazyload',
  'popup',
  'truncator'
],
  function ($) {
    return $.noConflict(true);
  }
);