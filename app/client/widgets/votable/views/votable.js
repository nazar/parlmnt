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
        sandbox.util.bindAll(this, 'render', '_doOnVoteChanged', '_doVoteIfSession');

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
        var that = this;

        this._doVoteIfSession(function() {
          that.model.voteUp();
          that._saveVote();
        });
      },

      _voteDown: function() {
        var that = this;

        this._doVoteIfSession(function() {
          that.model.voteDown();
          that._saveVote();
        });
      },

      _doVoteIfSession: function(fn) {
        if (sandbox.session.loggedIn()) {
          fn();
        } else {
          sandbox.publish('NeedRegistration');
        }
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