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
        var $el;

        e.preventDefault();

        $el = sandbox.dom.$(e.target);
        this._searchBox().val('');

        sandbox.publish('ShowBillPopup', {id: $el.data('id')}); //TODO hackish... want model item instead.... revisit
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
                that._popResults(response)
              });
            } else {

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

      _popResults: function(response) {
        var that = this,
          $form = this._searchForm(),
          $bills = sandbox.dom.$('<ul class="group"></ul>');

        if (response && response.bills && Array.isArray(response.bills)) {
          console.log('response', response)
          response.bills.each(function(bill) {
            $bills.append(sandbox.dom.$('<li class="search-result"><a href="{path}" data-id="{id}">{name}</a></li>'.assign({id: bill.id, path: sandbox.routes.bill_path(bill.id), name: bill.name})))
          });

          if ($bills.length > 0) {
            $form.popover({
              html: true,
              placement: 'bottom',
              trigger: 'manual',
              title: 'Search Results',
              content: $bills
            });

            $form.popover('show');

            sandbox.dom.$('html').one('click', function(e) {
              e.preventDefault();
              $form.popover('destroy');
            });
          }

        }

      },

      _hidePopover: function() {
        this._searchForm().popover('destroy');
      }




    });


    return SearchBar;

  });