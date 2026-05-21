import { CATEGORY_COLORS } from './ReceiptUploader';

function ExpenseList({ receipts, onDelete, onDeleteAll }) {
  // データなし時の空状態表示
  if (receipts.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">🧾</p>
        <p className="empty-title">まだレシートが登録されていません</p>
        <p className="empty-sub">「アップロード」タブからレシートを読み込んでください</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <div className="list-toolbar">
        <h2>支出一覧</h2>
        <button className="btn btn-danger-outline" onClick={onDeleteAll}>
          全て削除
        </button>
      </div>

      {/* レシートごとにカード表示 */}
      {receipts.map((receipt) => (
        <div key={receipt.id} className="receipt-card">
          <div className="receipt-card-header">
            <div className="receipt-meta">
              <span className="receipt-store">{receipt.store}</span>
              <span className="receipt-date">{receipt.date}</span>
            </div>
            <div className="receipt-actions">
              <span className="receipt-total">¥{receipt.total.toLocaleString()}</span>
              <button
                className="btn btn-danger-sm"
                onClick={() => onDelete(receipt.id)}
              >
                削除
              </button>
            </div>
          </div>

          {/* 商品一覧テーブル */}
          <table className="items-table">
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th>商品名</th>
                <th className="text-right">金額</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, i) => (
                <tr key={i}>
                  <td>
                    <span
                      className="category-badge"
                      style={{
                        backgroundColor: CATEGORY_COLORS[item.category] ?? '#94a3b8',
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td>{item.name}</td>
                  <td className="text-right price-cell">
                    ¥{item.price.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
