google.charts.load('current', { packages: ['corechart', 'line'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart(divId) {
  const data = new google.visualization.DataTable();
  data.addColumn('number', 'Time');
  data.addColumn('number', 'Temperature');

  data.addRows([
    [0, 15], [1, 14], [2, 13], [3, 12], [4, 12], [5, 11],
    [6, 12], [7, 14], [8, 18], [9, 21], [10, 24], [11, 26],
    [12, 28], [13, 30], [14, 31], [15, 32], [16, 31], [17, 30],
    [18, 28], [19, 26], [20, 24], [21, 22], [22, 20], [23, 18]
  ]);

  const options = {
    backgroundColor: 'transparent',
    colors: ['#3498db'],
    areaOpacity: 0,
    hAxis: {
      title: 'Time (Hour)',
      textStyle: { color: '#333', fontSize: 12 },
      ticks: [...Array(24).keys()],
      gridlines: { color: 'transparent' }
    },
    vAxis: {
      ticks: [],
      textStyle: { color: '#333', fontSize: 12 },
      gridlines: { color: 'transparent' }
    },
    legend: 'none',
    chartArea: { width: '85%', height: '80%' },
    lineWidth: 3
  };

  const chart = new google.visualization.LineChart(document.getElementById(divId));
  chart.draw(data, options);
}
