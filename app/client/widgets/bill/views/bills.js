define([
  'sandbox',

  'widgets/bill/views/bill_card'
],

  function (sandbox, BillCardView) {

    var BillsContainerView = sandbox.mvc.View({

      initialize: function (options) {
        this.votableBuilder = options.votableBuilder;
        this.commentableBuilder = options.commentableBuilder;

        sandbox.util.bindAll(this, 'render', 'addOne', 'addAll');

        this.billCollection = options.billCollection;
        this.billCollection.bind('add', this.addOne);
        this.billCollection.bind('reset', this.render);

        this._currentYear = '';
        this._currentSort = '';
        this._currentFilters = [];

        this._rendered = false;
      },

      render: function () {
        this._triggerLoading();

        this.$el.find('div.bill').remove();

        this._updateSummary();

        this.addAll();

        this._isotopeConfig();
        this._applyFilters();
        this._lazyLoadConfig();

        this._triggerLazyImages();

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

          this._triggerLoading();

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
            var matches;

            if (term) {
              matches = sandbox.dom.$('.bill').filter(function() {
                return sandbox.dom.$(this).data('name').toLowerCase().has(term);
              });
              that.$el.isotope({filter: sandbox.dom.$(matches)});
              that._updateSummary();
              //
              that._triggerLazyImages({hidden: true});
            } else {
              that._applyFilters();
            }
          }).debounce(1000);
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

        return billView.el;
      },

      _updateSummary: function() {
        sandbox.publish('summaryChanged', {
          total: this.billCollection.length,
          hidden: sandbox.dom.$('.isotope-hidden').length,
          type: 'Bill'
        });
      },

      _isotopeConfig: function() {
        var that = this;

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
            that._triggerLazyImages();
          }
        });
      },

      _lazyLoadConfig: function() {
        this.$el.find('img.lazy').lazyload({
          effect : "fadeIn",
          failure_limit: Math.max(this.billCollection.length - 1, 0)//,
        });
      },

      _applyFilters: function() {
        this.$el.isotope({sortBy: this._currentSort});
        this.$el.isotope({filter: this._currentFilters.join('')});
        //
        this._updateSummary();
      },

      _triggerLazyImages: function(options) {
        options = options || {};

        if (options.hidden) {
          sandbox.dom.$('.bill:not(.isotope-hidden)').find('img.lazy').trigger('appear');
        } else {
          sandbox.dom.$(window).trigger('scroll');
        }

      },

      _triggerLoading: function() {
        sandbox.publish('aboutToReload');
      }


    });

    return BillsContainerView;

  });