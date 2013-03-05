define([
  'sandbox',
  'widgets/bill/models/bill'
],

  function(sandbox, BillModel) {

    var BillPopupView = sandbox.mvc.View({

      events: {
      },

      initialize: function(options) {
        this.votableBuilder = options.votableBuilder;
        this.commentableBuilder = options.commentableBuilder;
        this.commentsPath = options.commentsPath;
      },

      render: function() {
        var that = this;

        sandbox.template.render('bill/templates/bill_popup', that.model.toJSON(), function(o) {
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


      /// PUBLIC

      showBill: function(options) {
        var that = this,
          id = options.id;

        this.model = new BillModel({id: id});

        this.model.fetch()
          .done(function() {
            sandbox.analytics.track('Viewing Bill', {
              bill_id: that.model.get('id'),
              bill_name: that.model.get('name')
            });

            that.render();
          });
      },


      //// PRIVATE ////

      _truncates: function() {
        this.$el.find('.documents').truncate({max_length: 100});
        this.$el.find('.stages').truncate({max_length: 100});
        this.$el.find('.summary-container').truncate({max_length: 500});
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
          votable_type: 'Bill',
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


    return BillPopupView;

  });