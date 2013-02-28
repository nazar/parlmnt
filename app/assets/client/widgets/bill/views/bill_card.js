define([
  'sandbox',

  'widgets/bill/views/bill_popup'
],

  function(sandbox) {

    var stagesToClass = {
      "1": '1st',
      "2": '2nd',
      "3": '3rd',
      "C": "co",
      "A": 'am',
      "R": 'ra'
    };

    var typesToClass = {
      "1": 'pu',
      "2": 'pr',
      "3": 'prm',
      "4": 'hy'
    };

    var BillCardView = sandbox.mvc.View({

      tagName: 'div',
      className: 'bill',

      events: {
        "click a.bill_link": '_showBill',  //TODO BB route
        "click a.watch": '_watch'
      },

      initialize: function(options) {
        sandbox.util.bindAll(this, 'render');

        this.votableBuilder = options.votableBuilder;
        this.commentableBuilder = options.commentableBuilder;
      },

      render: function() {
        var that = this;

        sandbox.template.render('bill/templates/bill_card', this.model.toJSON(), function(o) {
          that.$el.html(o);

          that.$el.find('.info:last').css('border-bottom', 'none');

          that._initCommentable();
          that._renderVotable();

          that._setBillSortData();
          that._setBillFilterClasses();
          that._setBillPartyClasses();
          that._setBillData();
        });

        return this;
      },

      /// EVENTS

      _watch: function(e) {
        e.preventDefault();
      },

      _showBill: function(e) {
        e.preventDefault();

        sandbox.publish('ShowBillPopup', {id: this.model.get('id')});
      },

      /// PUBLIC

      applyNameFilter: function(term, options) {
        var reg = new RegExp(term, 'i');

        if ( this.model.get('name').has(reg) === true ) {
          options.show(this);
        }
      },

      addToCommentable: function(comment) {
        this._commentable.addToCommentable(comment);
      },


      //// PRIVATE ////

      _initCommentable: function() {
        this._commentable = this.commentableBuilder({
          $el: this.$el.find('.commentable'),
          commentable_id: this.model.get('id'),
          commentable_type: 'Bill'
        });
      },

      _renderVotable: function() {
        var votableView = this.votableBuilder({
          $el: this.$el.find('.votes'),
          votable_type: 'Bill',
          votable_id: this.model.get('id'),
          votable_score: this.model.get('cached_votes_score')
        });

        votableView.render();

        return votableView;
      },

      _setBillSortData: function() {
        var that = this;

        ['name', 'votes', 'type', 'stage', 'sponsor', 'bill_updated_at'].each(function(field) {
          that.$el.data(field, that.model.get(field));
        });
      },

      _setBillFilterClasses: function () {
        var stage = stagesToClass[this.model.get('stageToCode')],
          type = typesToClass[this.model.get('bill_type')],
          origin = this.model.get('originToClass');

        this.$el.addClass(stage);
        this.$el.addClass(type);
        this.$el.addClass(origin);
      },

      _setBillPartyClasses: function() {
        var that = this;

        this.model.sponsorParties().each(function(party) {
          that.$el.addClass('party-' + party.dasherize());
        });
      },

      _setBillData: function() {
        this.$el.data('name', this.model.get('name'));
      }


    });


    return BillCardView;

  });