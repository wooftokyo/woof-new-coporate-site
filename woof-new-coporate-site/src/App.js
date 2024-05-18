import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [command, setCommand] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullText = 'ようこそ、woof株式会社コーポレートサイトへ';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.substring(0, index + 1));
      index += 1;
      if (index === fullText.length) {
        setIsTypingDone(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const handleKeyPress = useCallback((event) => {
    if (isConfirming) {
      if (event.key === 'Enter') {
        alert('処理は今後実装されます');
        setCommand('');
        setIsConfirming(false);
      } else if (event.key === 'Escape') {
        setIsConfirming(false);
      }
    } else if (event.key === 'Enter') {
      setIsConfirming(true);
    }
  }, [isConfirming]);

  const handleChange = (event) => {
    if (!isConfirming) {
      setCommand(event.target.value);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className="typing-effect">{displayedText}</p>
        {isTypingDone && (
          <>
            <p className="menu-intro">下記からメニューを選ぶまたはタイピングでAIに指示してください</p>
            <div className="menu-buttons">
              <button className="menu-button">会社概要</button>
              <button className="menu-button">私たちの事業について</button>
              <button className="menu-button">採用情報</button>
            </div>
            <p className="command-prompt">AIに指示を入力</p>
            <div className="command-input-wrapper">
              <span className="command-input">
                {command}
                <span className="cursor">{cursorVisible ? '|' : ' '}</span>
              </span>
              <input
                type="text"
                value={command}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="hidden-input"
                autoFocus
                readOnly={isConfirming} // 確認メッセージ表示中は読み取り専用
              />
            </div>
            {isConfirming && (
              <p className="confirmation-text">
                この内容で送信しますか？OKであればエンター、入力し直す場合はESCを押してください。
              </p>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
