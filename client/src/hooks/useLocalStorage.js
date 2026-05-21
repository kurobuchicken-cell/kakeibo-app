import { useState, useEffect } from 'react';

// ローカルストレージと同期するカスタムフック
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      // 読み取りに失敗した場合は初期値を返す
      return initialValue;
    }
  });

  // 値が変わるたびにローカルストレージへ保存
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (e) {
      console.error('ローカルストレージへの保存に失敗しました:', e);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
