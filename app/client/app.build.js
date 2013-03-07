//noinspection BadExpressionStatementJS
({

  baseUrl:'.',

  out:'./build/application.js',

  optimize: 'uglify',
  preserveLicenseComments: false,

  paths:{
    //folder shortcuts
    "vendor":      './vendor',
    "widgets":     './widgets',
    "modules":     './modules',

    //vendor libraries
    "requirejs":   'vendor/require.2.1.1',

    //jQuery + plugins and wrappers
    "jquery-raw":  'vendor/jquery.1.7.2.min',
    //plugins
    "bootstrap":   'vendor/bootstrap.min',
    "bootstrap-modal":   'vendor/bootstrap-modal.2.1',
    "bootstrap-modalmanager":   'vendor/bootstrap-modalmanager.2.1',
    "isotope":     'vendor/isotope.1.5.19.min',
    "cookie":      'vendor/jquery.cookie',
    "lazyload":    'vendor/jquery.lazyload',
    "popup":       'vendor/jquery.popup',
    "truncator":   'vendor/jquery.truncator',
//    "transit":     'vendor/jquery.transit.0.9.9',
    //wrapper
    "jquery":      'vendor/jquery',

    //stuff for BB
    "underscore":  'vendor/underscore.1.3.3.min',
    "backbone-raw":'vendor/backbone.0.9.2',
    //BB plugins
    "mutators":    'vendor/backbone.mutators.0.3.0',
    "sync-rails":  'vendor/backbone-rails-sync',
    //wrapper for backbone to include its plugins
    "backbone":    'vendor/backbone',

    //third party stuff
    "dust":        'vendor/dust-core-1.0.0',
    "dust-custom-helpers":        'vendor/dust-custom-helpers',
    "sugar":       'vendor/sugar.1.3.9.min',
    "q":           'vendor/q.0.8.12',
    "analytics":   'vendor/analytics.0.6.1.min',
    "radio":       'vendor/radio.0.2',
    "routes":      'vendor/jsroutes',


    //core files
    "core":        './core/core',
    "base":        './core/base',
    "sandbox":     './core/sandbox',

    //compiled DUST templates
    templates:     './build/templates',

    //modules
    //MUST add any defined modules above to include that follows
    "bills":  'modules/bills/main',
    "acts":   'modules/acts/main',
    "mps":    'modules/mps/main',
    "lords":  'modules/lords/main',
    "pages":  'modules/pages/main'
  },

  include: ['bills', 'acts', 'mps', 'lords', 'pages'],   //MUST include all from modules section just above

  deps: ['requirejs', 'sugar', 'q'],

  shim:{

    "jquery":{
      deps:   ['jquery-raw'],
      exports: function() {
        return jQuery.noConflict(true);
      }
    },

    "underscore":{
      exports:'_'
    },

    "backbone-raw":{
      deps:   ['jquery', 'underscore', 'dust', 'templates'],
      exports:'Backbone'
    },

    "bootstrap":{
      deps:['jquery-raw']
    },

    "isotope":{
      deps:['jquery-raw']
    },

    "dust":{
      exports: 'dust'
    },

    "templates":{
      deps:['dust']
    }

//    "main":{
//      deps:['requirejs', 'sugar']
//    }

  }

})