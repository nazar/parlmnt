define([
  'sandbox',

  'widgets/sponsor/views/sponsor_popup'
],

  function(sandbox) {

    var SponsorCardView = sandbox.mvc.View({

      tagName: 'div',
      className: 'sponsor',

      events: {
        "click a.sponsor_link": '_showSponsor',  //TODO BB route
        "click a.watch": '_watch'
      },

      initialize: function(options) {
        sandbox.util.bindAll(this, 'render');
      },

      render: function() {
        var that = this;

        sandbox.template.render('sponsor/templates/sponsor_card', this._toJSON(), function(o) {
          that.$el.html(o);

          that.$el.find('.info:last').css('border-bottom', 'none');

          that._renderVotable();

          that._setSponsorFilterClasses();
          that._setSponsorData();
        });

        return this;
      },

      /// EVENTS

      _watch: function(e) {
        e.preventDefault();
      },

      _showSponsor: function(e) {
        e.preventDefault();

        sandbox.publish('ShowSponsorPopup', {id: this.model.get('id')});
      },

      /// PUBLIC

      //// PRIVATE ////

      _toJSON: function() {
        var json = this.model.toJSON();

        return Object.merge(json, {
          "sponsorUrl": 'http://www.parliament.uk' + json.url_details,
          "sponsorPartyAsClasses": 's-' + this._sponsorPartyClass(),
          "sponsorParty": this.model.sponsorParty()
        });
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

      _setSponsorFilterClasses: function() {
        this.$el.addClass('party-' + this._sponsorPartyClass());
      },

      _sponsorPartyClass: function() {
        var party = this.model.get('party_name');

        return party.dasherize();
      },

      _setSponsorData: function() {
        this.$el.data('name', this.model.get('name'));
        this.$el.data('bills', this.model.get('count_bills'));
      }


    });


    return SponsorCardView;

  });