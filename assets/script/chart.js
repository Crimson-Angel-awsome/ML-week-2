const ctx = document.getElementById('GrooveChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['30d ago', '25d ago', '20d ago', '15d ago', '10d ago', '5d ago', 'Today'],
    datasets: [{
      label: 'Vibe Score',
      data: [65, 70, 75, 72, 80, 85, 88],
      borderColor: '#7c5cff',
      backgroundColor: 'rgba(124, 92, 255, 0.15)',
      tension: 0.4,
      fill: true,
      pointRadius: 5
    }]
  },
  options: {
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  }
});
