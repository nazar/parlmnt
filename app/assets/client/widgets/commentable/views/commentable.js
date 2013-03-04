define([
  'sandbox',
  'widgets/commentable/views/comment',
  'widgets/commentable/models/comment'
],

  function (sandbox, CommentView, CommentModel) {


    var CommentableView = sandbox.mvc.View({

      initialize: function(options) {
        this.$el = options.$el;

        this.votableBuilder = options.votableBuilder;

      },

      ////// PUBLIC

      loadComments: function(path) {
        var that = this;

        sandbox.ajax.request(path)
          .done(function(comments) {
            comments.each(function(comment) {
              that._jsonCommentToView(comment);
            });
          });
      },

      renderAddComment: function() {
        var that = this,
          $comment = sandbox.dom.$('<div class="please-register"></div>');

        if (sandbox.session.loggedIn()) {
          sandbox.template.render('commentable/templates/add-comment', {}, function (o) {
            $comment.html(o);
            $comment.addClass('add-comment');

            that._hAddEvents($comment);
          });
        } else {
          $comment.html('<a href="#">Login or Register</a> to add and reply to comments').find('a').click(function(e) {
            e.preventDefault();
            sandbox.publish('NeedRegistration');
          });
        }

        return $comment;
      },

      addComment: function() {
        this.$el.append(this.renderAddComment());
      },

      addToCommentable: function(commentable) {
        this.collection.add(commentable);
      },


      /////////// EVENT Handlers

      /////////// PRIVATES //////////////

      _jsonCommentToView: function(comment, options) {
        var view;

        options = options || {};

        view = new CommentView({
          comment: comment,
          votableBuilder: this.votableBuilder
        });

        if (options.animate) {
          this.$el.append(view.render().$el.addClass('animated fadeInDown'));
        } else {
          this.$el.append(view.render().$el);
        }
      },

      _hAddEvents: function($el) {
        var that = this;

        $el.find('button.save').click(function() {
          that._saveComment();
        });
      },

      _saveComment: function() {
        var that = this,
          body = this.$el.find('.add-comment textarea').val();

        CommentModel.addNewCommentFromView(this, body)
          .done(function(comment) {
            that._jsonCommentToView(comment, {animate: true});
          });

        this.$el.find('.add-comment textarea').val('');
      }
    });


    return CommentableView;

  });