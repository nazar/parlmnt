angular.module('parlmntDeps').factory('stats', ['$http', '$q', 'party', function($http, $q, party) {

  var stat = {};

  stat.billsAndActs = function() {
    return $http.get(Routes.bills_acts_stats_path())
      .then(_processStatsIntoStackedChartObjects);
  };

  stat.bills = function() {
    return $http.get(Routes.bills_stats_path())
      .then(_processStatsIntoStackedChartObjects);
  };

  stat.acts = function() {
    return $http.get(Routes.acts_stats_path())
      .then(_processStatsIntoStackedChartObjects);
  };

  stat.mps = function() {
    return $http.get(Routes.mps_stats_path())
      .then(_processStatsIntoPieChartObjects);
  };

  stat.lords = function() {
    return $http.get(Routes.lords_stats_path())
      .then(_processStatsIntoPieChartObjects);
  };



  ///////////// PRIVATE

  function _processStatsIntoStackedChartObjects(res) {
    var $d = $q.defer(),
      series = [],
      colors = [],
      parties,
      bills,
      years;


    bills = res.data.filter(function(s) {
      return s.year > 2009;
    });

    years = bills.map(function(b) {
      return b.year
    }).unique();

    parties = bills.sortBy(function(b) {
      return b.count * -1;
    }).map(function(b) {
        return b.name;
      }).unique();

    parties.each(function(partyName) {
      var data;

      data = years.map(function(year) {
        var item = bills.find(function(b) {
          return (b.year === year) && (b.name === partyName);
        });

        return item ? item.count : 0;
      });

      series.push({
        name: partyName,
        data: data
      });

      colors.push(party.getColourForName(partyName))
    });

    $d.resolve({years: years, series: series, colors: colors});

    return $d.promise;
  }


  function _processStatsIntoPieChartObjects(res){
    var $d = $q.defer(),
      series = [],
      colors = [];

    res.data.sortBy(function(party) {
      return party.count * -1;
    }).each(function(partyObj) {
      colors.push(party.getColourForName(partyObj.name));
      series.push( [partyObj.name, partyObj.count] )
    });

    $d.resolve({series: series, colors: colors});

    return $d.promise;
  }


  return stat;

}]);