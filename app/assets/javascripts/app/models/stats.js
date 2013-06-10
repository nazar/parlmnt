angular.module('parlmntDeps').factory('stats', ['$http', '$q', 'party', function($http, $q, party) {

  var stat = {};

  stat.billsAndActs = function() {
    return $http.get(Routes.bills_acts_stats_path())
      .then(_processStatsIntoObjects);
  };

  stat.bills = function() {
    return $http.get(Routes.bills_stats_path())
      .then(_processStatsIntoObjects);
  };

  stat.acts = function() {
    return $http.get(Routes.acts_stats_path())
      .then(_processStatsIntoObjects);
  };



  ///////////// PRIVATE

  function _processStatsIntoObjects(res) {
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


  return stat;

}]);