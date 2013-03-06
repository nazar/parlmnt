define([
  'sandbox',

  'widgets/sponsor/models/sponsor'
],

  function(sandbox, SponsorModel) {

    var SponsorPopupView = sandbox.mvc.View({

      events: {
        'click a.bill_link': '_showBill'
      },

      initialize: function(options) {
        this.votableBuilder = options.votableBuilder;
        this.commentableBuilder = options.commentableBuilder;
        this.commentsPath = options.commentsPath;
      },

      render: function() {
        var that = this;

        sandbox.template.render('sponsor/templates/sponsor_popup', that._toJSON(), function(o) {
          that.setElement(o);

          that._truncates();
          that._initCommentable();
          that._loadComments();

          that._renderVotable();

          that.$el.modal('show');
        });

        return this;
      },


      /// EVENTS

      _showBill: function(e) {
        var $el = sandbox.dom.$(e.target);

        e.preventDefault();

        sandbox.publish('ShowBillPopup', {id: $el.data('id')});
      },


      /// PUBLIC

      showSponsor: function(options) {
        var that = this,
          id = options.id;

        this.model = new SponsorModel({id: id});

        this.model.fetch()
          .done(function() {
            that.render();
          });
      },


      //// PRIVATE ////

      _toJSON: function() {
        var json = this.model.toJSON();

        return Object.merge(json, {
          sortedBills: json.bills.sortBy(function(b) { return b.name })
        }, true)
      },

      _truncates: function() {
        this.$el.find('.sponsor-bills').truncate({max_length: 300});
      },

      _initCommentable: function() {
        this._commentable = this.commentableBuilder({
          $el: this._commentableDiv()
        });

        this._commentableDiv().append(this._commentable.renderAddComment());
      },

      _loadComments: function() {
        this._commentable.loadComments( this.commentsPath(this.model.get('id')) );
      },

      _renderVotable: function() {
        var votableView = this.votableBuilder({
          $el: this.$el.find('.votes'),
          votable_type: 'Sponsor',
          votable_id: this.model.get('id'),
          votable_score: this.model.get('cached_votes_score')
        });

        votableView.render();

        return votableView;
      },

      _commentableDiv: function() {
        return this.$el.find('.commentable');
      }



    });


    return SponsorPopupView;

  });