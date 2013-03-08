define([
  'sandbox',

  'widgets/bill/views/bill_popup'
],

  function(sandbox) {

    var stagesToClass = {
      "1": '1st',
      "2": '2nd',
      "3": '3rd',
      "C": "co",
      "A": 'am',
      "R": 'ra'
    };

    var typesToClass = {
      "1": 'pu',
      "2": 'pr',
      "3": 'prm',
      "4": 'hy'
    };

    var BillCardView = sandbox.mvc.View({

      tagName: 'div',
      className: 'bill',

      events: {
        "click a.watch": '_watch'
      },

      initialize: function(options) {
        sandbox.util.bindAll(this, 'render');
      },

      render: function() {
        var that = this;

        sandbox.template.render('bill/templates/bill_card', this.model.toJSON(), function(o) {
          that.$el.html(o);

          that.$el.find('.info:last').css('border-bottom', 'none');

          that._renderVotable();

          that._setBillSortData();
          that._setBillFilterClasses();
          that._setBillPartyClasses();
          that._setBillData();
        });

        return this;
      },

      /// EVENTS

      _watch: function(e) {
        e.preventDefault();
      },


      /// PUBLIC



      //// PRIVATE ////

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

      _setBillSortData: function() {
        var that = this;

        ['name', 'votes', 'type', 'stage', 'sponsor', 'bill_updated_at'].each(function(field) {
          that.$el.data(field, that.model.get(field));
        });
      },

      _setBillFilterClasses: function () {
        var stage = stagesToClass[this.model.get('stageToCode')],
          type = typesToClass[this.model.get('bill_type')],
          origin = this.model.get('originToClass');

        this.$el.addClass(stage);
        this.$el.addClass(type);
        this.$el.addClass(origin);
      },

      _setBillPartyClasses: function() {
        var that = this;

        this.model.sponsorParties().each(function(party) {
          that.$el.addClass('party-' + party.dasherize());
        });
      },

      _setBillData: function() {
        this.$el.data('name', this.model.get('name'));
      }


    });


    return BillCardView;

  });