import { CATEGORY_COLORS } from './ReceiptUploader';

function Summary({ receipts }) {
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

  // 今月のレシートのみ抽出
  const thisMonthReceipts = receipts.filter((r) => r.date.startsWith(currentMonth));
  const thisMonthTotal = thisMonthReceipts.reduce((sum, r) => sum + r.total, 0);
  const allTotal = receipts.reduce((sum, r) => sum + r.total, 0);

  // 今月のカテゴリ別集計
  const categoryTotals = {};
  thisMonthReceipts.forEach((receipt) => {
    receipt.items.forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.price;
    });
  });

  const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);

  return (
    <div className="summary">
      {/* サマリーカード */}
      <div className="summary-cards">
        <div className="summary-card primary">
          <p className="card-label">今月の支出合計</p>
          <p className="card-value">¥{thisMonthTotal.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <p className="card-label">登録レシート数</p>
          <p className="card-value">{receipts.length} 件</p>
        </div>
        <div className="summary-card">
          <p className="card-label">累計支出</p>
          <p className="card-value">¥{allTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* 今月のカテゴリ別内訳 */}
      {sortedCategories.length > 0 && (
        <div className="category-breakdown">
          <h3>今月のカテゴリ別内訳</h3>
          {sortedCategories.map(([cat, amount]) => (
            <div key={cat} className="breakdown-row">
              <span
                className="breakdown-label"
                style={{ color: CATEGORY_COLORS[cat] ?? '#94a3b8' }}
              >
                {cat}
              </span>
              <div className="breakdown-bar-bg">
                <div
                  className="breakdown-bar-fill"
                  style={{
                    width: `${(amount / thisMonthTotal) * 100}%`,
                    backgroundColor: CATEGORY_COLORS[cat] ?? '#94a3b8',
                  }}
                />
              </div>
              <span className="breakdown-amount">¥{amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
