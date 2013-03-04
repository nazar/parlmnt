define([
  'sandbox',

  'widgets/navbar/models/nav_item'
],

  function (sandbox, NavItem) {

    var NavItems = sandbox.mvc.Collection({

      model: NavItem,

      /////////////// PUBLIC ///////////

      loadNavItems: function(items) {
        var that = this;

        Object.each(items, function(key, options) {
          that.add( new that.model({name: key, url: options.url, path: options.path || key.toLowerCase()}) )
        });
      }

      ////////////////////// PRIVATE /////////////////////

    });

    return NavItems;
  });