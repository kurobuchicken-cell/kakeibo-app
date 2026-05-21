import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.jsの必要モジュールを登録
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MonthlyChart({ receipts }) {
  // 月別（YYYY-MM）に支出を集計
  const monthlyTotals = {};
  receipts.forEach((receipt) => {
    const month = receipt.date.substring(0, 7);
    monthlyTotals[month] = (monthlyTotals[month] || 0) + receipt.total;
  });

  // 月順にソートして最新6ヶ月を表示
  const sortedMonths = Object.keys(monthlyTotals).sort().slice(-6);

  const data = {
    labels: sortedMonths.map((m) => {
      const [year, month] = m.split('-');
      return `${year}年${parseInt(month)}月`;
    }),
    datasets: [
      {
        label: '支出合計',
        data: sortedMonths.map((m) => monthlyTotals[m]),
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ¥${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `¥${val.toLocaleString()}`,
        },
      },
    },
  };

  if (sortedMonths.length === 0) {
    return (
      <div className="chart-box empty-chart">
        <h3>月別支出</h3>
        <p>データがありません</p>
      </div>
    );
  }

  return (
    <div className="chart-box">
      <h3>月別支出</h3>
      <div className="chart-inner">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default MonthlyChart;
