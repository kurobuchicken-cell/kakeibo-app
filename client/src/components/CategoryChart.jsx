import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CATEGORY_COLORS } from './ReceiptUploader';

// Chart.jsの必要モジュールを登録
ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryChart({ receipts }) {
  // カテゴリ別に金額を集計
  const categoryTotals = {};
  receipts.forEach((receipt) => {
    receipt.items.forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.price;
    });
  });

  const labels = Object.keys(categoryTotals);
  const grandTotal = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [
      {
        data: labels.map((cat) => categoryTotals[cat]),
        backgroundColor: labels.map((cat) => CATEGORY_COLORS[cat] ?? '#94a3b8'),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, font: { size: 13 } } },
      tooltip: {
        callbacks: {
          // ツールチップに金額と割合を表示
          label: (ctx) => {
            const pct = grandTotal > 0 ? Math.round((ctx.parsed / grandTotal) * 100) : 0;
            return ` ¥${ctx.parsed.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
  };

  if (labels.length === 0) {
    return (
      <div className="chart-box empty-chart">
        <h3>カテゴリ別支出</h3>
        <p>データがありません</p>
      </div>
    );
  }

  return (
    <div className="chart-box">
      <h3>カテゴリ別支出</h3>
      <div className="chart-inner">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default CategoryChart;
