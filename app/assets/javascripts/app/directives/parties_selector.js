angular.module('parlmntDeps').directive('partiesSelector', ['party', function(party) {

  return {

    templateUrl: '/templates/parties/selector',
    replace: true,

    scope: {
      partySrc: '=',
      partyClick: '&'
    },

    controller: ['$scope', '$element', 'party', function($scope, $element, party) {

      $scope.parties = [];

      $scope.$watch('partySrc', function(partySrc) {
        var func = partySrc === 'mps' ? party.getMps : (partySrc === 'lords' ? party.getLords : null);

        if (func) {
          func().success(function(res){
            $scope.parties = res;
            _recalculateMetrics();
            $scope.$broadcast('loaded');
          });
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

        result['background-color'] = party.backgroundColor;
        result['width'] = party.width - 1 +  '%';
        result['color'] = party.color;

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
        var total = $scope.parties.sum(function(p){ return p.count });

        function contrast(hexcolor){
          var r = parseInt(hexcolor.substr(0,2),16);
          var g = parseInt(hexcolor.substr(2,2),16);
          var b = parseInt(hexcolor.substr(4,2),16);
          var yiq = ((r*299)+(g*587)+(b*114))/1000;
          return (yiq >= 128) ? 'black' : 'white';
        }

        $scope.parties.each(function(partyObj){
          partyObj.backgroundColor = party.getColourFor(partyObj);
          partyObj.width = ((partyObj.count / total) * 100).round();
          partyObj.color = partyObj.backgroundColor ? contrast(partyObj.backgroundColor.remove('#')) : 'black';
        });
      }
    }]
  }

}]);