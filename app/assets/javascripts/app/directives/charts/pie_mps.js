angular.module('parlmntDeps').directive('pieMps', ['stats', function(stats) {

  return {
    link: function(scope, element) {
      stats.mps().then(function(data) {

        // Radialize the colors
        Highcharts.getOptions().colors = Highcharts.map(data.colors, function(color) {
          return {
            radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
            stops: [
              [0, color],
              [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
          };
        });

        $(element).highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
          },
          title: {
            text: 'Current MP Party Breakdown'
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            percentageDecimals: 1
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                color: '#000000',
                connectorColor: '#000000',
                formatter: function() {
                  return '<b>'+ this.point.name +'</b>: '+ this.percentage.round(1) +' %';
                }
              }
            }
          },
          series: [{
            type: 'pie',
            name: 'Party share',
            data: data.series
          }]
        });
      });
    }

  }

}]);