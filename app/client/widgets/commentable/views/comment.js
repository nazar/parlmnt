define([
  'sandbox',

  'widgets/commentable/models/comment'
],

  function (sandbox, CommentModel) {


    var CommentView = sandbox.mvc.View({

      initialize: function(options) {
        sandbox.util.bindAll(this, 'render');

        this.votableBuilder = options.votableBuilder;
        this.model = new CommentModel(options.comment);

        this.model.on('change:cached_votes_score', this.render);
      },

      render: function() {
        var that = this;

        sandbox.template.render('commentable/templates/comment', this._toJSON(), function (o) {
          var $comment;

          $comment = sandbox.dom.$(o);
          that._hCommentActions($comment);

          that.$el.html($comment);
          that.$el.addClass('comment clearfix');
          that._renderVotable();

          that.model.get('children').each(function(comment) {
            that.$el.append( that._renderComment(comment) );
          });
        });

        return this;
      },

      ////// PUBLIC

      /////////// EVENT Handlers

      _reply: function(e) {
        var that = this;

        e.preventDefault();

        if (!this._isReplying()) {

          if (sandbox.session.loggedIn()) {
            sandbox.template.render('commentable/templates/reply', {}, function (o) {
              var $reply = sandbox.dom.$('<div class="reply"></div>');

              $reply.html(o);
              that._hReplyAction($reply);
              that.$el.find('.content-container:first').append($reply.addClass('animated fadeInDown'));
            });
          } else {
            sandbox.publish('NeedRegistration');
          }
        }
      },

      _save: function($reply) {
        var that = this;

        CommentModel.addReply(this.model,  $reply.find('textarea').val())
          .done(function(comment) {
            var $target = that.$el.closest('.comment'),
              $newComment = that._renderComment(comment);

            $target.append($newComment.addClass('animated fadeInDown'));
            $reply.remove();
          });
      },

      /////////// PRIVATES //////////////

      _toJSON: function() {
        return this.model.toJSON();
      },

      _hCommentActions: function($el) {
        var that = this;

        $el.find('a.reply').click(function(e) {
          that._reply(e);
        });
      },
      
      _hReplyAction: function($el) {
        var that = this;

        $el.find('button.cancel').click(function() {
          $el.addClass('animated fadeOutUp');
          setTimeout(function() {
            $el.remove();
          }, 500);
        });
        $el.find('button.save').click(function() {
          that._save($el);
        });
      },

      _renderComment: function(comment) {
        var view = new CommentView({votableBuilder: this.votableBuilder, comment: comment}),
          $sub = view.render().$el;

        $sub.addClass('child');

        return $sub;
      },

      _renderVotable: function() {
        var votableView = this.votableBuilder({
          compact: true,
          $el: this.$el.find('.votes'),
          votable_type: 'Comment',
          votable_id: this.model.get('id'),
          onVoteChanged: this._setPoints.bind(this)
        });

        votableView.render();

        return votableView;
      },

      _isReplying: function() {
        return this.$el.find('.content-container:first').children('.reply').length > 0;
      },

      _setPoints: function(points) {
        this.model.set('cached_votes_score', points);
      }

    });


    return CommentView;

  });