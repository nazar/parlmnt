define([
  'sandbox',

  'widgets/navbar/collections/nav_items'
],

  function (sandbox, NavItems) {

  var AppView = sandbox.mvc.View({

    initialize: function (options) {
      this.sessionEl = options.sessionEl;

      this._processItems(options.items);

      this.render();
    },

    render: function () {
      var that = this;

      sandbox.template.render('navbar/templates/navbar', {}, function (o) {
        that.$el.html(o);
        that._renderNavItems();
        that._renderSession();
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
      this.$el.find(this.sessionEl).html(sandbox.session.render().$el);
    }




  });

  return AppView;

});