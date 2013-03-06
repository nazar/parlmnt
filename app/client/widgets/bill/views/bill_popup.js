define([
  'sandbox',
  'widgets/bill/models/bill'
],

  function(sandbox, BillModel) {

    var BillPopupView = sandbox.mvc.View({

      render: function() {
        var that = this;

        sandbox.template.render('bill/templates/bill_popup', that._toJSON(), function(o) {
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
            that.render();
          });
      },


      //// PRIVATE ////

      _toJSON: function() {
        var json = this.model.toJSON();

         return Object.merge(json, {
           bill_documents_sorted: json.bill_documents.sortBy(function(d) { return d.name })
         });
      },

      _truncates: function() {
        this.$el.find('.documents').truncate({max_length: 100});
        this.$el.find('.stages').truncate({max_length: 100});
        this.$el.find('.summary-container').truncate({max_length: 500});
      },

      _initCommentable: function() {
        var that = this;

        sandbox.publish('Bill.RequestCommentable', {
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
        sandbox.publish('Bill.RequestVotable', {
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


    return BillPopupView;

  });