define([
  'sandbox',

  'widgets/sponsor/models/sponsor'
],

  function(sandbox, SponsorModel) {

    var SponsorPopupView = sandbox.mvc.View({

      events: {
        'click a.bill_link': '_showBill'
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
        var that = this;

        sandbox.publish('Sponsor.RequestCommentable', {
          $el: this._commentableDiv(),
          commentable_id: this.model.get('id'),
          yield: function(commentable) {
            that._commentable = commentable;
            that._commentableDiv().append(that._commentable.renderAddComment());
          }
        });
      },

      _loadComments: function() {
        this._commentable.loadComments( this.model.get('id') );
      },

      _renderVotable: function() {
        sandbox.publish('Sponsor.RequestVotable', {
          $el: this.$el.find('.votes'),
          votable_id: this.model.get('id'),
          votable_score: this.model.get('cached_votes_score'),
          yield: function(votableView) {
            votableView.render();
          }
        });
      },

      _commentableDiv: function() {
        return this.$el.find('.commentable');
      }



    });


    return SponsorPopupView;

  });