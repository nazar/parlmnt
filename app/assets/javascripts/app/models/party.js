angular.module('parlmntDeps').factory('party', ['$http', function($http) {

  var party = {};

  var partyColours = {
    "conservative": 'blue',
    "labour": 'red',
    "liberal-democrat": 'yellow',
    "labour-(co-op)": '#ff6352',
    "speaker": 'white',
    "democratic-unionist": '#c1c1ca',
    "scottish-national": '#cdcdd6',
    "sinn-fein": '#d8d8e1',
    "social-democratic-&-labour-party": '#e7e7f0',
    "plaid-cymru": '#ececf5',
    "independent": '#f3f3fc',
    "green": 'green'
  };

   party.getMps = function(){
     return $http.get(Routes.mps_parties_path());
   };

   party.getLords = function(){
     return $http.get(Routes.lords_parties_path());
   };

  party.getColourFor = function(party){
    console.log('dash', party.name.dasherize())
    return partyColours[party.name.dasherize()];
  };

  return party;

}]);