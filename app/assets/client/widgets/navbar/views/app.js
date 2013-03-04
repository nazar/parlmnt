define([
  'sandbox',

  'widgets/navbar/collections/nav_items'
],

  function (sandbox, NavItems) {

  var AppView = sandbox.mvc.View({

    initialize: function (options) {
      this._processItems(options.items);

      this.render();
    },

    render: function () {
      var that = this;

      sandbox.template.render('navbar/templates/navbar', {}, function (o) {
        that.$el.html(o);
        that._renderNavItems();
        that._renderSession();
        that._renderSearch();
      });

      return this;
    },

    //// PRIVATE

    _processItems: function(items) {
      this.navItems = new NavItems();
      this.navItems.loadNavItems(items);
    },

    _renderNavItems: function() {
      var $parent = this.$el.find('ul.nav');

      this.navItems.each(function(navItem) {
        var $nav = sandbox.dom.$('<li></li>');

        navItem.isActive(window.location.pathname) ? $nav.addClass('active') : $nav.removeClass('active');
        $nav.append(sandbox.dom.$('<a href="{url}">{name}</a>'.assign({url: navItem.get('url'), name: navItem.get('name')})));

        $parent.append($nav);
      });
    },

    _renderSession: function() {
      var that = this;

      sandbox.publish('onRenderSession', {
        rendered: function(html) {
          that.$el.find('#session').html(html);
        }
      });
    },

    _renderSearch: function() {
      var that = this;

      sandbox.publish('onRenderSearch', {
        rendered: function(html) {
          that.$el.find('#search').html(html);
        }
      });
    }




  });

  return AppView;

});