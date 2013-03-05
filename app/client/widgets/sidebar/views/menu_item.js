define([
  'sandbox'
],

  function (sandbox) {

    var MenuItemView = sandbox.mvc.View({

      tagName: 'li',

      initialize: function (options) {
        sandbox.util.bindAll(this, 'render', '_clickButton');

        this._onToggleSelection = sandbox.dom.callbacks(); //TODO replace with pub/sub

        //simple templates
        this._buttonTemplate = '<button data-code="{code}" type="button" class="btn btn-small btn-info">{name}</button>';
        this._inputTemplate = '<input data-code="{code}" type="text">';
      },

      events: {
        "click button": '_clickButton'
      },

      render: function () {      //TODO needs simplification? Func is too long
        var item = this.model,
          type = item.get('type'),
          $group = sandbox.dom.$q('<div class="btn-group" data-toggle="buttons-radio"></div>');

        this.$el.addClass('nav-header');
        this.$el.text(item.get('name'));

        this._renderSectionItems($group, type);
        this.$el.append($group);

        return this;
      },

      onToggleSelection: function (fn) {
        this._onToggleSelection.add(fn);
      },



      /////////////// PRIVATE

      _renderSectionItems: function ($group, type) {
        var that = this,
          item = this.model,
          items = item.get('items'),
          defaultCode = item.get('default'),
          $element;

        Object.each(items, function (caption, itemOptions) {
          var name = caption,
            code = itemOptions.code || name;

          //use either caption or icon for button
          if (itemOptions.icon) {
            name = '<img src="{src}" class="btn-icon" data-code="{code}" />'.assign({src: itemOptions.icon, code: code});
          }

          if (type === 'search') {   //TODO refactor into function
            $element = sandbox.dom.$q( that._inputTemplate.assign({"name": name, "code": code}) );
            $element.addClass('search-query');

            if (itemOptions.cssClass) {
              itemOptions.cssClass.split(' ').each(function(cssClass) {
                $element.addClass(cssClass)
              });
            }
            if (itemOptions.placeholder) {
              $element.attr('placeholder', itemOptions.placeholder)
            }
            if (itemOptions.events) {
              Object.each(itemOptions.events, function(event, fn) {
                $element.on(event, fn);
              });
            }
          } else {
            $element = sandbox.dom.$q( that._buttonTemplate.assign({"name": name, "code": code}) );
          }

          if (itemOptions.tip) {
            $element.tooltip({
              "title": itemOptions.tip,
              "container": 'body'
            });
          }

          if (itemOptions.cssClass) {
            $element.addClass(itemOptions.cssClass);
          }

          if (defaultCode && (code === defaultCode)) {
            $element.addClass('active');
          }

          $group.append($element);

        });
      },

      _clickButton: function (e) {
        var $b = this.$(e.target),
          wasActive = $b.hasClass('active'), //active records state prior active class being set by bootstrap
          type = this.model.get('type'),
          direction;

        if (type === 'pick') {
          direction = 'down'
        } else {
          direction = wasActive ? 'up' : 'down';
        }

        this._onToggleSelection.fire($b.data('code'), this.model.get('section'), direction);

        //hack to toggle button
        if ( wasActive && (this.model.get('type') === 'toggle')) {
          setTimeout(function () {
            $b.removeClass('active');
          }, 10);
        }
      }




    });

    return MenuItemView;

  });