import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

function App() {
  const [language, setLanguage] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [command, setCommand] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullTextJP = 'ようこそ、woof株式会社コーポレートサイトへ';
  const fullTextEN = 'Welcome to the Woof Corporation website';

  const eventSourceRef = useRef(null);

  const handleCommandSubmit = useCallback(async () => {
    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      console.log('Sending request to backend');
      const response = await fetch('http://localhost:3001/api/generate', { // URLを修正
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.details || 'An error occurred');
      }

      eventSourceRef.current = new EventSource('http://localhost:3001/api/generate/stream'); // URLを修正

      eventSourceRef.current.onmessage = (event) => {
        setDisplayedText((prevText) => prevText + event.data);
      };

      eventSourceRef.current.onerror = (error) => {
        console.error('Error during streaming:', error);
        alert('An error occurred during streaming. Please try again.');
        eventSourceRef.current.close();
      };

    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred: ${error.message}`);
    }
  }, [command]);

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

  const handleKeyPress = useCallback(
    (event) => {
      if (isConfirming) {
        if (event.key === 'Enter') {
          handleCommandSubmit();
          setCommand('');
          setIsConfirming(false);
        } else if (event.key === 'Escape') {
          setIsConfirming(false);
        }
      } else if (event.key === 'Enter') {
        setIsConfirming(true);
      }
    },
    [isConfirming, handleCommandSubmit]
  );

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
          <p className="language-select">
            Select Language / 言語を選択してください
          </p>
          <div className="language-buttons">
            <button
              className="language-button"
              onClick={() => handleLanguageSelect('EN')}
            >
              English
            </button>
            <button
              className="language-button"
              onClick={() => handleLanguageSelect('JP')}
            >
              日本語
            </button>
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
            <p className="menu-intro">
              {language === 'JP'
                ? '下記からメニューを選ぶまたはタイピングでAIに指示してください'
                : 'Please choose from the menu below or type your instructions to the AI'}
            </p>
            <div className="menu-buttons">
              <button className="menu-button">
                {language === 'JP' ? '会社概要' : 'Company Overview'}
              </button>
              <button className="menu-button">
                {language === 'JP' ? '私たちの事業について' : 'About Our Business'}
              </button>
              <button className="menu-button">
                {language === 'JP' ? '採用情報' : 'Recruitment Information'}
              </button>
            </div>
            <p className="command-prompt">
              {language === 'JP' ? 'AIに指示を入力' : 'Enter instructions to AI'}
            </p>
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
                readOnly={isConfirming}
              />
            </div>
            {isConfirming && (
              <p className="confirmation-text">
                {language === 'JP'
                  ? 'この内容で送信しますか？OKであればエンター、入力し直す場合はESCを押してください。'
                  : 'Do you want to send this? Press Enter to confirm, or ESC to edit.'}
              </p>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;