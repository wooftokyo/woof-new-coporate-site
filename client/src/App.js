import React, { useState, useCallback } from 'react';
import './App.css';

function App() {
  const [language, setLanguage] = useState(null);
  const [command, setCommand] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCommandSubmit = useCallback(async () => {
    try {
      if (command.trim() === '') return;

      setIsLoading(true);
      setError(null);
      setMessages(prevMessages => [...prevMessages, { role: 'user', content: command }]);
      setCommand('');

      const response = await fetch('http://localhost:3001/api/generate', {
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

      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.text }]);

    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [command]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        handleCommandSubmit();
      }
    },
    [handleCommandSubmit]
  );

  const handleChange = (event) => {
    setCommand(event.target.value);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
  };

  if (!language) {
    return (
      <div className="App language-select-container">
        <h2>Select Language / 言語を選択してください</h2>
        <div className="language-buttons">
          <button onClick={() => handleLanguageSelect('EN')}>English</button>
          <button onClick={() => handleLanguageSelect('JP')}>日本語</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <div className="header-links">
          <a href="#company">会社概要</a>
          <a href="#business">私たちの事業</a>
          <a href="#recruit">採用情報</a>
        </div>
      </header>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <span className="sender">{message.role === 'user' ? 'あなた' : 'わふちゃん'}</span>
              <p className="content">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <span className="sender">わふちゃん</span>
              <p className="content loading">...</p>
            </div>
          )}
          {error && (
            <div className="message error">
              <p className="content">{error}</p>
            </div>
          )}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={command}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder={language === 'JP' ? "メッセージを入力" : "Type a message"}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;