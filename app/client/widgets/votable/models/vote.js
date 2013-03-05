define([
  'sandbox'
], function (sandbox) {


  var VoteModel = sandbox.mvc.Model({

    urlRoot: '/votes',      //TODO supply jsroutes func

    /// PUBLIC functions

    initVotableData: function(view) {
      this.set({
        votable_id: view.votable_id,
        votable_type: view.votable_type,
        votable_score: view.votable_score
      });
    },

    voteUp: function() {
      this.set('vote_flag', 'true');
    },

    voteDown: function() {
      this.set('vote_flag', 'false');
    }



  });

  return VoteModel;

});