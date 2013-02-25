define([
  'sandbox',

  'widgets/sidebar/models/menu_item' //TODO change this to section_items
],

  function (sandbox, MenuItem) {

    var MenuItems = sandbox.mvc.Collection({

      model: MenuItem,

      initialize: function () {
        this.itemSelections = {};
      },

      addSectionItems: function (header, options) {
        var that = this,
          model;

        model = {
          "name": header,
          "type": options.type,
          "section": options.section || header,
          "items": options.items,
          "default": options.default
        };

        this.add(model);

        //note defaults and populate this.itemSelections
        Object.each(options.items, function (item, itemOptions) {
          if ( (itemOptions.code || item) === options.default) {
            that.manageSections(itemOptions.code || item, model.section, 'down' )
          }
        });
      },


      manageSections: function (code, section, state) {
        if (state && state === 'up') {
          delete this.itemSelections[section];
        } else {
          this.itemSelections[section] = code;
        }
      }

      ////////////////////// PRIVATE /////////////////////

    });

    return MenuItems;
  });