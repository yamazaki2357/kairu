import React, { useState } from 'react';
import Chat from './chat';  // chat.js のインポート
import './App.css';

const App = () => {
  // メッセージの状態管理用のステート
  const [message, setMessage] = useState('');

  // 回答の状態間利用のステート
  const [answer, setAnswer] = useState('');

  // メッセージの格納
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  }

  // 「質問」ボタンを押したときの処理
  const handleSubmit = async (event) => {
    event.preventDefault();

    // chat.js にメッセージを渡して API から回答を取得
    const responseText = await Chat(message);

    // 回答の格納
    setAnswer(responseText);
  }

  // チャットフォームの表示
  return (
    <div className='character-area'>
      <div className="message-box">

      <div>
        <h1>何について調べますか？</h1>

      <form onSubmit={handleSubmit}>
        <label>
          <textarea
            rows='3'
            className="input-area"
            value={message}
            onChange={handleMessageChange}
          />
        </label>
        <div className="btn-area">
          <button type="submit">オプション(O)</button>
          <button type="submit">検索(S)</button>
        </div>
      </form>
      {answer && (
        <div>
          <h2>回答:</h2>
          <p>{answer.split(/\n/).map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {item}
                  <br />
                </React.Fragment>
              );
            })
          }
          </p>
        </div>
      )}
        </div>
      </div>
      <img src="/images/GPTKairuKun.png" alt="GPTKairuKun" className='character-image'/>
    </div>
  );
}

export default App;