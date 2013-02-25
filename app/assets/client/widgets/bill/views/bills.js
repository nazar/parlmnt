define([
  'sandbox',

  'widgets/bill/views/bill_card'
],

  function (sandbox, BillCardView) {

    var BillsContainerView = sandbox.mvc.View({

      initialize: function (options) {
        this.channel = options.channel;
        this.votableBuilder = options.votableBuilder;
        this.commentableBuilder = options.commentableBuilder;

        sandbox.util.bindAll(this, 'render', 'addOne', 'addAll');

        this.billCollection = options.billCollection;
        this.billCollection.bind('add', this.addOne);
        this.billCollection.bind('reset', this.render);

        this._currentYear = '';
        this._currentSort = '';
        this._currentFilters = [];

        this._billViews = {};   //TODO need this? Only here for isotope.

        this._rendered = false;
      },

      render: function () {
        this.$el.find('div.bill').remove();

        this._updateSummary();

        this.addAll();

        this._isotopeConfig();
        this._applyFilters();
        this._lazyLoadConfig();

        $(window).trigger('scroll'); //kicks off isotope

        this._rendered = true;
        sandbox.publish('billsLoaded');

        return this;
      },

      addOne: function (bill) {
        this.$el.append(this._renderBill(bill));
      },

      /**
       * Optimised func to render all bills in memory then append at-once to the DOM
       */
      addAll: function () {
        var that = this,
          bills = [];

        this._billViews = {}; //resets views
        this.billCollection.each(function(bill) {
          bills.push(that._renderBill(bill))
        });

        this.$el.append(bills);
      },

      filteringAndSorting: function (options) {
        var that = this;

        //set states for requested options
        if (options.sort && (this._currentSort !== options.sort)) {
          this._currentSort = options.sort;
        }

        this._currentFilters = [];
        ['type', 'stage', 'origin', 'party'].each(function (key) {
          if (options[key]) {
            that._currentFilters.push( '.' + options[key] )
          }
        });

        if (options.year && (this._currentYear !== options.year) ) {
          this._currentYear = options.year;

          sandbox.publish('aboutToReload');

          //collection will be reset and rendered if year changes
          this.billCollection.fetchByYear(options.year);
        } else {
          this._applyFilters();
        }
      },

      showMatchedBills: function(term) {
        var that = this;

        if (!this._debouncedSearch) {
          this._debouncedSearch = (function(term) {
            var tst = [];

            if (term) {
              Object.each(that._billViews, function(id, billView) {
                billView.applyNameFilter(term, {
                  show: function(view) {
                    tst.push(view.el);
                  }
                });
              });

              if (tst.length > 0) {
                that.$el.isotope({filter: that.$(tst)});  //FIXME should work in addition to _currentFilters
              }
            } else {
              this._applyFilters();       //TODO that?
            }

          }).debounce(500);
        }

        this._debouncedSearch(term);

      },

      relayout: function() {
        this.$el.isotope('reLayout');
      },

      //////// TEH PRIVATES ////////

      _renderBill: function(bill) {
        var billView = new BillCardView({
          model: bill,
          votableBuilder: this.votableBuilder,
          commentableBuilder: this.commentableBuilder
        });

        billView.render();

        this._billViews[bill.get('id')] = billView;

        return billView.el;
      },

      _updateSummary: function() {
        var title,
          summary;

        title = '{n} {bills}'.assign({n: this.billCollection.length, bills: this.billCollection.length > 0 ? 'Bills' : 'Bill'});
        summary = 'Started in {year}'.assign({year: this._currentYear});

        sandbox.publish('summaryChanged', {title: title, summary: summary});
      },

      _isotopeConfig: function() {
        var $window = $(window);

        if (this._rendered) {
          this.$el.isotope('destroy');
        }

        this.$el.isotope({
          itemSelector: '.bill',
          animationEngine : 'css',
          getSortData: {
            name: function ($el) {
              return $el.data('name');
            },
            last_updated: function ($el) {
              return Date.create($el.data('bill_updated_at')).getTime() * -1.0;
            }
          },
          onLayout: function() {
            $window.trigger('scroll');
          }
        });
      },

      _lazyLoadConfig: function() {
        this.$el.find('img.lazy').lazyload({
          effect : "fadeIn",
          failure_limit: Math.max(this.billCollection.length - 1, 0)
        });
      },

      _applyFilters: function() {
        this.$el.isotope({sortBy: this._currentSort});
        this.$el.isotope({filter: this._currentFilters.join('')});
      }


    });

    return BillsContainerView;

  });