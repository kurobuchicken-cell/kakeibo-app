import { useState, useCallback } from 'react';
import ReceiptUploader from './components/ReceiptUploader';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import CategoryChart from './components/CategoryChart';
import MonthlyChart from './components/MonthlyChart';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

function App() {
  // レシートデータをローカルストレージで永続管理
  const [receipts, setReceipts] = useLocalStorage('kakeibo-receipts', []);
  const [activeTab, setActiveTab] = useState('upload');

  // 新しいレシートを先頭に追加
  const handleReceiptAdded = useCallback(
    (receiptData) => {
      const newReceipt = {
        ...receiptData,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString(),
      };
      setReceipts((prev) => [newReceipt, ...prev]);
      setActiveTab('list');
    },
    [setReceipts]
  );

  // 指定IDのレシートを削除
  const handleDelete = useCallback(
    (id) => {
      setReceipts((prev) => prev.filter((r) => r.id !== id));
    },
    [setReceipts]
  );

  // 全件削除（確認ダイアログあり）
  const handleDeleteAll = useCallback(() => {
    if (window.confirm('全てのデータを削除しますか？この操作は元に戻せません。')) {
      setReceipts([]);
    }
  }, [setReceipts]);

  const tabs = [
    { id: 'upload', label: 'アップロード' },
    { id: 'list', label: `一覧 (${receipts.length})` },
    { id: 'charts', label: 'グラフ' },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-icon">🧾</div>
        <h1>レシート家計簿</h1>
        <p>レシートを撮影・アップロードして自動で家計を管理</p>
      </header>

      <nav className="app-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 'upload' && (
          <ReceiptUploader onReceiptAdded={handleReceiptAdded} />
        )}
        {activeTab === 'list' && (
          <ExpenseList
            receipts={receipts}
            onDelete={handleDelete}
            onDeleteAll={handleDeleteAll}
          />
        )}
        {activeTab === 'charts' && (
          <div className="charts-page">
            <Summary receipts={receipts} />
            <div className="charts-grid">
              <CategoryChart receipts={receipts} />
              <MonthlyChart receipts={receipts} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
