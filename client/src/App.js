import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [language, setLanguage] = useState(null); // 言語選択状態
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [command, setCommand] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullTextJP = 'ようこそ、woof株式会社コーポレートサイトへ';
  const fullTextEN = 'Welcome to the Woof Corporation website';

  useEffect(() => {
    if (language) {
      let index = 0;
      const fullText = language === 'JP' ? fullTextJP : fullTextEN;
      const interval = setInterval(() => {
        setDisplayedText(fullText.substring(0, index + 1));
        index += 1;
        if (index === fullText.length) {
          setIsTypingDone(true);
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [language]);

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

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
  };

  if (!language) {
    return (
      <div className="App">
        <header className="App-header">
          <p className="language-select">Select Language / 言語を選択してください</p>
          <div className="language-buttons">
            <button className="language-button" onClick={() => handleLanguageSelect('EN')}>English</button>
            <button className="language-button" onClick={() => handleLanguageSelect('JP')}>日本語</button>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <p className="typing-effect">{displayedText}</p>
        {isTypingDone && (
          <>
            <p className="menu-intro">{language === 'JP' ? '下記からメニューを選ぶまたはタイピングでAIに指示してください' : 'Please choose from the menu below or type your instructions to the AI'}</p>
            <div className="menu-buttons">
              <button className="menu-button">{language === 'JP' ? '会社概要' : 'Company Overview'}</button>
              <button className="menu-button">{language === 'JP' ? '私たちの事業について' : 'About Our Business'}</button>
              <button className="menu-button">{language === 'JP' ? '採用情報' : 'Recruitment Information'}</button>
            </div>
            <p className="command-prompt">{language === 'JP' ? 'AIに指示を入力' : 'Enter instructions to AI'}</p>
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
                {language === 'JP' ? 'この内容で送信しますか？OKであればエンター、入力し直す場合はESCを押してください。' : 'Do you want to send this? Press Enter to confirm, or ESC to edit.'}
              </p>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
