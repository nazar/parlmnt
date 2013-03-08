define([
  'sandbox',

  'widgets/session/models/user'
],

  function (sandbox, UserModel) {

    var SearchBar = sandbox.mvc.View({

      events: {
        "click button.btn": '_searchButtonClick',
        "submit form": '_searchButtonClick',
        "click li.search-result a": '_resultClicked'
      },

      initialize: function (options) {

        this.searchDelay = options.searchDelay || 500;
        this.minSearchLength = options.minSearchLength || 3;

        this.model = new UserModel();
      },

      render: function () {
        var that = this;

        sandbox.template.render('search/templates/search_box', {}, function (o) {
          that.$el.html(o);
        });

        return this;
      },
      /////// PUBLIC ////

      ///////////// EVENTS

      _searchButtonClick: function(e) {
        e.preventDefault();
        this._processSearch(this._searchTerm(), {force: true});
      },

      _resultClicked: function(e) {
        //slight hack as the  sandbox.dom.$('html').one in func _popResults capture clicks to close the menu. TODO better fix
        window.location = sandbox.dom.$(e.target).attr('href');
      },

      //// PRIVATE ////

      _processSearch: function(term, options) {
        var that = this,
          minLength;

        options = options || {};
        minLength = options.force ? 1 : this.minSearchLength;


        if (!this._debouncedSearch) {
          this._debouncedSearch = (function(term) {
            if (term && (term.length >= minLength)) {
              sandbox.dom.$.post( sandbox.routes.search_path({term: term}), {}, function(response) {
                if (that._hasResults(response)) {
                  that._popResults(response);
                }
              });
            }
          }).debounce(this.searchDelay);
        }
        this._debouncedSearch(term);
      },

      _searchTerm: function() {
        return this._searchBox().val();
      },

      _searchBox: function() {
        return this.$el.find('input')
      },

      _searchForm: function() {
        return this.$el.find('.form-search');
      },

      _hasResults: function(response) {
        var results;

        results = Object.values(response).sum(function(r) {
          return r.result.length;
        });

        return results > 0;
      },

      _popResults: function(response) {
        var $form = this._searchForm(),
          $group = sandbox.dom.$('<ul class="group"></ul>'),
          $result = sandbox.dom.$('<div class="search-container"></div>');

        Object.each(response, function(group, groupResults) {
          if (groupResults.result.length > 0) {
            $group.append('<li class="header">{group}</li>'.assign({group: group.capitalize()}));
            groupResults.result.each(function(result) {
              var li = '<li class="search-result"><a href="{path}" data-id="{id}">{name}</a></li>'.assign({
                id: result.id,
                path: '#{route}/{id}'.assign({route: groupResults.route || group, id: result.id}),
                name: result.name
              });

              $group.append(li)
            });
          }
        });

        $result.append($group);

        $form.popover({
          html: true,
          placement: 'bottom',
          trigger: 'manual',
          title: 'Search Results',
          content: $group
        });

        $form.popover('show');

        //add a page listener to close menu on mouse click
        sandbox.dom.$('html').one('click', function(e) {
          e.preventDefault();
          $form.popover('destroy');
        });
      }

    });


    return SearchBar;

  });