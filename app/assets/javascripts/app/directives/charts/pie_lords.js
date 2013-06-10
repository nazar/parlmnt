angular.module('parlmntDeps').directive('pieLords', ['stats', function(stats) {

  return {
    link: function(scope, element) {
      stats.lords().then(function(data) {

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
            text: 'Current Lords Party Breakdown'
          },
          tooltip: {
            formatter: function () {
              return '{party}: <b>{percent}%</b>, <b>{seats}</b> seats'.assign({party: this.point.name, percent: Highcharts.numberFormat(this.percentage, 1), seats: this.y});
            }
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