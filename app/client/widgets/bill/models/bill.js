define([
  'sandbox'
], function (sandbox) {

  var typeDescriptor = {
    "1": 'Public',
    "2": 'Private',
    "3": 'Private Members',
    "4": 'Hybrid'
  };

  var stageDescriptor = {
    "1": 'First Reading',
    "2": 'Second Reading',
    "3": 'Third Reading',
    "C": 'Committee',
    "A": 'Amendments',
    "E": 'Report',
    "R": 'Royal Assent'
  };

  var originsToClass = {
    "1": 'commons',
    "2": 'lords',
    "3": 'royal'
  };

  var Bill = sandbox.mvc.Model({


    urlRoot: '/bills',

    url: function() {
      return '{root}/{id}'.assign({root: this.urlRoot, id: this.get('id')});
    },

    mutators: {       //TODO remove mutators. These funcs should really be in the View and not here. Move to view.jsoniser
      lastUpdatedShort: function() {
        return Date.create(this.bill_updated_at).relative();
      },
      lastUpdatedNumber: function() {
        return Date.create(this.bill_updated_at).getTime();
      },
      totalVotes: function() {
        return this.count_against + this.count_for;
      },
      invCountAgainst: function() {
        return this.count_against * -1;
      },
      invCountFor: function() {
        return this.count_for * -1;
      },
      typeDescription: function () {
        return typeDescriptor[this.bill_type];
      },
      stageDescription: function () {
        return stageDescriptor[this.stage];
      },
      stageToCode: function() {
        var stage,
          stages,
          result;

        if (this.current_stage && this.current_stage.stage) {
          stage = this.current_stage.stage;

          stages = {
            "1": /^1st reading/i,
            "2": /^2nd reading/i,
            "3": /^3rd reading/i,
            "C": /^committee/i,
            "E": /^report/i,
            "R": /^royal/i
          };

          Object.each(stages, function(code, matcher) {
            if (stage.match(matcher)) {
              result = code;
            }
          });


          if (!result) {
            result = 'A';
          }

          return result;
        }
      },
      originToString: function () {
        var klass = originsToClass[this.origin];

        if (klass) {
          return "House of " + klass.capitalize();
        } else {
          return '';
        }
      },
      originToClass: function() {
        return originsToClass[this.origin];
      },
      locationToString: function () {
        var loc = this.current_stage ? this.current_stage.location : null;

        if (loc) {
          return originsToClass[loc].capitalize();
        } else {
          console.log('Missing location for', this);
        }
      },
      sponsorCountDesc: function() {
        var result = 'Sponsor';

        if (this.sponsors && Array.isArray(this.sponsors) && (this.sponsors.length > 1)) {
          result = 'Sponsors';
        }

        return result;
      },

      /*
      For use in bill.dust template
       */
      sponsorPartyAsClasses: function() {
        var result = [];

        if (this.sponsors && Array.isArray(this.sponsors) && (this.sponsors.length > 0)) {
          this.sponsors.each(function(sponsor) {
            if (sponsor['party']) {
              result.push('s-' + sponsor['party'].name.dasherize())
            }
          });
        }

        return result.unique().join(' ');
      }

    },


    /// PUBLIC functions

    sponsorParties: function() {    //TODO not to thrilled to have sponsorParties _AND_ sponsorPartyAsClasses doing the same thing. Investigate dust template model access without mutators
      var sponsors = this.get('sponsors'),
        result = [];

      if (sponsors && Array.isArray(sponsors)) {
        sponsors.each(function(sponsor) {
          if (sponsor['party']) {
            result.push(sponsor['party'].name)
          }
        });
      }

      return result.unique();
    }

  });

  return Bill;

});