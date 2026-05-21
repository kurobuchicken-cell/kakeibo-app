import { useState, useRef, useCallback } from 'react';

// カテゴリの色定義（他コンポーネントと共有）
export const CATEGORY_COLORS = {
  食費: '#ef4444',
  外食: '#f97316',
  日用品: '#eab308',
  交通費: '#14b8a6',
  医療費: '#3b82f6',
  娯楽費: '#8b5cf6',
  その他: '#94a3b8',
};

function ReceiptUploader({ onReceiptAdded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const fileInputRef = useRef(null);

  // 画像ファイルをAPIに送信して解析する
  const processFile = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith('image/')) {
        setError('画像ファイル（JPG・PNG・WEBP等）を選択してください');
        return;
      }

      // 選択した画像のプレビューを表示
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);

      setIsLoading(true);
      setError(null);
      setLastResult(null);

      try {
        const formData = new FormData();
        formData.append('image', file);

        // Viteのプロキシ経由でバックエンドに送信（ブラウザからAPIキーは見えない）
        const response = await fetch('/api/analyze-receipt', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'レシートの解析に失敗しました');
        }

        const data = await response.json();
        setLastResult(data);
        onReceiptAdded(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [onReceiptAdded]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
    e.target.value = ''; // 同じファイルを再度選択できるようリセット
  };

  return (
    <div className="uploader">
      {/* ドラッグ＆ドロップエリア */}
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {preview && !isLoading && (
          <img src={preview} alt="レシートプレビュー" className="image-preview" />
        )}

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Claude AIがレシートを解析中...</p>
          </div>
        ) : (
          !preview && (
            <div className="upload-hint">
              <span className="upload-icon">📸</span>
              <p className="upload-title">レシート画像をドロップ</p>
              <p className="upload-sub">またはクリックして選択</p>
              <small>JPG・PNG・WEBP・GIF 対応（最大10MB）</small>
            </div>
          )
        )}

        {preview && !isLoading && (
          <div className="preview-overlay">クリックして別の画像を選択</div>
        )}
      </div>

      {/* エラーメッセージ */}
      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {/* 解析結果のプレビュー */}
      {lastResult && (
        <div className="result-card">
          <div className="result-header">
            <span className="result-check">✅ 読み取り完了</span>
            <div className="result-meta">
              <strong>{lastResult.store}</strong>
              <span>{lastResult.date}</span>
            </div>
          </div>

          <ul className="result-items">
            {lastResult.items.map((item, i) => (
              <li key={i} className="result-item">
                <span
                  className="category-badge"
                  style={{ backgroundColor: CATEGORY_COLORS[item.category] ?? '#94a3b8' }}
                >
                  {item.category}
                </span>
                <span className="item-name">{item.name}</span>
                <span className="item-price">¥{item.price.toLocaleString()}</span>
              </li>
            ))}
          </ul>

          <div className="result-total">
            合計: <strong>¥{lastResult.total.toLocaleString()}</strong>
          </div>
          <p className="result-hint">一覧タブに追加しました</p>
        </div>
      )}
    </div>
  );
}

export default ReceiptUploader;
