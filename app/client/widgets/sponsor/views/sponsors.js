define([
  'sandbox',

  'widgets/sponsor/views/sponsor_card'
],

  function (sandbox, SponsorCardView) {

    var SponsorsContainerView = sandbox.mvc.View({

      initialize: function (options) {

        this.sponsorType = options.sponsorType;

        sandbox.util.bindAll(this, 'render', 'addOne', 'addAll');

        this.sponsorCollection = options.sponsorCollection;
        this.sponsorCollection.bind('add', this.addOne);
        this.sponsorCollection.bind('reset', this.render);

        this._currentSort = '';
        this._currentFilters = [];

        this._rendered = false;
        this._showUnbilled = false;
        this._hidden = 0;
      },

      render: function () {
        this._triggerLoading();

        this._updateSummary();

        this.addAll();

        this._isotopeConfig();
        this._applyFilters();
        this._lazyLoadConfig();

        this._triggerLazyImages();

        this._rendered = true;

        sandbox.publish('sponsorsLoaded');

        return this;
      },

      addOne: function (bill) {
        this.$el.append(this._renderSponsor(bill));
      },

      addAll: function () {
        var that = this,
          bills = [];

        this._hidden = 0;

        this.sponsorCollection.each(function(bill) {
          if (that._showUnbilled) {
            bills.push(that._renderSponsor(bill))
          } else {
            if (bill.get('count_bills') > 0) {
              bills.push(that._renderSponsor(bill))
            } else {
              that._hidden = that._hidden + 1;
            }
          }
        });

        this.$el.append(bills);
      },

      ////// PUBLIC

      loadSponsors: function() {
        this._triggerLoading();
        this.sponsorCollection.fetchSponsors();
      },

      filteringAndSorting: function (options) {
        var that = this,
          showUnbilled = options.visibility === 'show_unbilled';

        if (this._showUnbilled !== showUnbilled) {
          this._showUnbilled = showUnbilled;
          this._triggerLoading();
          this._resetSponsors();
          this.render();
        }
        //set states for requested options
        if (options.sort && (this._currentSort !== options.sort)) {
          this._currentSort = options.sort;
        }

        this._currentFilters = [];
        ['party'].each(function (key) {
          if (options[key]) {
            that._currentFilters.push( '.' + options[key] )
          }
        });

        this._applyFilters();
      },

      showMatchedSponsors: function(term) {
        var that = this;

        if (!this._debouncedSearch) {
          this._debouncedSearch = (function(term) {
            var matches;

            if (term) {
              matches = sandbox.dom.$('.sponsor').filter(function() {
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

      _renderSponsor: function(sponsor) {
        var sponsorView = new SponsorCardView({
          model: sponsor
        });

        sponsorView.render();

        return sponsorView.el;
      },

      _updateSummary: function() {
        sandbox.publish('summaryChanged', {
          total: this.sponsorCollection.length,
          hidden: sandbox.dom.$('.isotope-hidden').length + this._hidden,
          type: this.sponsorType
        });
      },

      _isotopeConfig: function() {
        var that = this;

        if (this._rendered) {
          this.$el.isotope('destroy');
        }

        this.$el.isotope({
          itemSelector: '.sponsor',
          animationEngine : 'css',
          getSortData: {
            name: function ($el) {
              return $el.data('name');
            },
            bill_count: function($el) {
              return parseInt($el.data('bills'), 10) * -1;
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
          failure_limit: Math.max(this.sponsorCollection.length - 1, 0)//,
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
          sandbox.dom.$('.sponsor:not(.isotope-hidden)').find('img.lazy').trigger('appear');
        } else {
          sandbox.dom.$(window).trigger('scroll');
        }

      },

      _triggerLoading: function() {
        sandbox.publish('aboutToReload');
      },

      _resetSponsors: function() {
        this.$el.isotope('destroy');
        this.$el.html('');
        this._rendered = false;
      }


    });

    return SponsorsContainerView;

  });