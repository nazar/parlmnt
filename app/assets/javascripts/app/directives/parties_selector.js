angular.module('parlmntDeps').directive('partiesSelector', ['$timeout', 'party', function($timeout, party) {

  return {

    templateUrl: '/templates/parties/selector',
    replace: true,

    scope: {
      partySrc: '=',
      partyClick: '&'
    },

    link: function(scope, element, attrs){

      scope.$on('loaded', _recalcDims);

      $(window).resize(_recalcDims);

      //////////////////////

      function _recalcDims(){
        var width = element.width(),
          total = scope.parties.sum(function(p){ return p.count });

        scope.parties.each(function(partyObj){
          partyObj.width = (partyObj.count / total) * width;
        });

        $timeout(function(){
          element.find('li').each(function(i){
            var $li = $(this),
              party = scope.parties[i],
              padding = $li.css('padding-left').toNumber() + $li.css('padding-right').toNumber();

            $li.width( party.width - padding  );
          });

        });
      }

    },

    controller: ['$scope', '$element', 'party', function($scope, $element, party) {

      $scope.parties = [];

      $scope.$watch('partySrc', function(partySrc) {
        var func;

        if (partySrc) {
          if (partySrc === 'mps') {
            func = party.getMps;
          } else if (partySrc === 'lords') {
            func = party.getLords;
          }

          if (func) {
            func().success(function(res){
              $scope.parties = res;
              _recalculateMetrics();
              $scope.$broadcast('loaded');
            });
          }
        }
      });

      $scope.partyToClass = function(party){
        var classes = [party.name.dasherize()];

        if (party.selected) {
          classes.push('selected');
        }

        return classes.join(' ');
      };

      $scope.styles = function(party){
        var result = {};

        result['background-color'] = party.colour;

        return result;
      };

      $scope.setToSelection = function(party){
        if (party.selected) {
          party.selected = false;
          $scope.partyClick({party: null});
        } else {
          $scope.parties.each(function(p){
            p.selected = false;
          });
          party.selected = true;
          $scope.partyClick({party: party});
        }

      };

      $scope.largeParties = function(party){
        return party.count.toNumber() > 5;
      };

      // PRIVATE

      function _recalculateMetrics(){
        var width = $element.width(),
          total = $scope.parties.sum(function(p){ return p.count });

        $scope.parties.each(function(partyObj){
          partyObj.width = (partyObj.count / total) * width;
          partyObj.colour = party.getColourFor(partyObj);
        });
      }
    }]
  }

}]);