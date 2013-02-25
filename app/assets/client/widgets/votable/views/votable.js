define([
  'sandbox',

  'widgets/votable/models/vote'
],

  function (sandbox, BillModel) {


    var VotableView = sandbox.mvc.View({

      events: {
        "click .up": '_voteUp',
        "click .down": '_voteDown'
      },

      initialize: function(options) {
        sandbox.util.bindAll(this, 'render', '_doOnVoteChanged');

        this.$el = options.$el;

        this.compact = options.compact === true;
        this.votable_type = options.votable_type;
        this.votable_id = options.votable_id;
        this.votable_score = options.votable_score;

        this.onVoteChanged = options.onVoteChanged;

        this._initModel();
      },

      render: function() {
        var that = this;

        function jsoniser() {  //TODO should be in vote model instead?
          return {
            votable_score: that.model.get('votable_score')
          };
        }

        sandbox.template.render('votable/templates/votable', jsoniser(), function (o) {
          that.$el.html(o);
          if (that.compact) {
            that.$el.find('.count').remove();
          }
        });

        return this;
      },


      /////////// EVENT Handlers

      _voteUp: function() {
        this.model.voteUp();
        this._saveVote();

        sandbox.analytics.track('Up voted a {v}'.assign({v: this.votable_type}), {
          votable_id: this.model.get('votable_id_id')
        });
      },

      _voteDown: function() {
        this.model.voteDown();
        this._saveVote();

        sandbox.analytics.track('Down voted a {v}'.assign({v: this.votable_type}), {
          votable_id: this.model.get('votable_id_id')
        });
      },


      /////////// PRIVATES //////////////

      _initModel: function() {
        this.model = new BillModel();

        this.model.initVotableData(this);
        this.model.on('change:votable_score', this._doOnVoteChanged);

        if (!this.compact) {
          this.model.on('change:votable_score', this.render);
        }
      },

      _saveVote: function() {
        this.model.save()
      },

      _doOnVoteChanged: function(vote) {
        if (this.onVoteChanged) {
          this.onVoteChanged(vote.get('votable_score'));
        }
      }

    });


    return VotableView;

  });