angular.module('parlmntDeps').factory('party', ['$http', function($http) {

  var party = {};

  var partyColours = {
    "conservative": '#0000ff',
    "labour": '#ff0000',
    "liberal-democrat": '#ffff00',
    "labour-(co-op)": '#ff6352',
    "speaker": '#ffffff',
    "democratic-unionist": '#c1c1ca',
    "scottish-national": '#cdcdd6',
    "sinn-fein": '#d8d8e1',
    "social-democratic-&-labour-party": '#e7e7f0',
    "plaid-cymru": '#ececf5',
    "independent": '#f3f3fc',
    "green": 'green',
    "crossbench": '#a67fc0',
    "bishops": '#c397e2',
    "non-affiliated": '#ffe4ea'
  };

   party.getMps = function(){
     return $http.get(Routes.mps_parties_path());
   };

   party.getLords = function(){
     return $http.get(Routes.lords_parties_path());
   };

  party.getColourFor = function(party){
    return partyColours[party.name.dasherize()];
  };

  party.getColourForName = function(name){
    return partyColours[name.dasherize()];
  };

  return party;

}]);