define([
  'sandbox',

  'widgets/sidebar/views/menu_item',
  'widgets/sidebar/collections/menu_items'
],

  function (sandbox, MenuItemView, MenuItems) {

    var SidebarContainer =  sandbox.mvc.View({

      initialize: function (options) {
        sandbox.util.bindAll(this, 'render', 'renderNavigation', '_itemClicked');

        this._initNavigation(options.choices);

        this.render();
      },

      initDefaults: function() {
        this._publishFilterChanged();
      },

      render: function () {
        var that = this;
        sandbox.template.render('sidebar/templates/container', {}, function (o) {
          that.$el.html(o);
          that.$itemList = that.$el.find('ul');
          that.sections.each(that.renderNavigation);
        });
        return this;
      },

      renderNavigation: function (model) {
        var section = new MenuItemView({model: model});

        section.onToggleSelection(this._itemClicked);
        section.render();

        this.$itemList.append(section.$el);
      },

      ///////////// PRIVATE ///////////

      _initNavigation: function (choices) {
        var that = this;
        this.sections = new MenuItems();
        Object.each(choices, function (header, options) {
          that.sections.addSectionItems( header, options );
        });
      },

      _itemClicked: function (code, section, state) {
        this.sections.manageSections(code, section, state);
        this._publishFilterChanged();
      },

      _publishFilterChanged: function() {
        sandbox.publish('FilterChanged', this.sections.itemSelections);
      }

    });

    return SidebarContainer;

  });