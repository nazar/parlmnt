angular.module('parlmntDeps').directive('chartBills', ['stats', function(stats) {

  return {
    link: function(scope, element) {
      stats.bills().then(function(data) {
        $(element).highcharts({
          chart: {
            type: 'column'
          },
          title: {
            text: 'Proposed Bills in Parliament, by Year and Party'
          },
          xAxis: {
            categories: data.years
          },
          yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
              text: 'Number of Proposed Bills in Parliament'
            }
          },
          tooltip: {
            formatter: function() {
              return '<b>'+ this.x +'</b>: Bills<br/>'+
                this.series.name +': '+ this.y +'<br/>'+
                'Total: '+ this.point.stackTotal;
            }
          },
          plotOptions: {
            column: {
              stacking: 'normal'
            }
          },
          series: data.series
        });
      });
    }

  }

}]);