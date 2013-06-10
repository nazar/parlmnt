angular.module('parlmntDeps').directive('chartActs', ['stats', function(stats) {

  return {
    link: function(scope, element) {
      stats.acts().then(function(data) {
        $(element).highcharts({
          chart: {
            type: 'column'
          },
          title: {
            text: 'Acts of Parliament, by Year and Party'
          },
          xAxis: {
            categories: data.years
          },
          yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
              text: 'Number of Acts of Parliament'
            }
          },
          tooltip: {
            formatter: function() {
              return '<b>'+ this.x +'</b>: Acts<br/>'+
                this.series.name +': '+ this.y +'<br/>'+
                'Total: '+ this.point.stackTotal;
            }
          },
          plotOptions: {
            column: {
              stacking: 'normal'
            }
          },
          series: data.series,
          colors: data.colors
        });
      });
    }

  }

}]);