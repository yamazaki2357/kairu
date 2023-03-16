import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './chat.css';

const API_URL = 'https://api.openai.com/v1/';
const MODEL = 'gpt-3.5-turbo';
const API_KEY = process.env.REACT_APP_POSIPAN_API_KEY;

const Chat = () => {
  // メッセージの状態管理用のステート
  const [message, setMessage] = useState('');
  // 回答の状態管理用のステート
  const [answer, setAnswer] = useState('');
  // 会話の記録用のステート
  const [conversation, setConversation] = useState([]);
  // ローディング表示用のステート
  const [loading, setLoading] = useState(false);
  // 前回のメッセージの保持、比較用
  const prevMessageRef = useRef('');

  // 回答が取得されたとき
  useEffect(() => {
    // 直前のチャット内容
    const newConversation = [
      {
        'role': 'assistant',
        'content': answer,
      },
      {
        'role': 'user',
        'content': message,
      }
    ];

    // 会話の記録(直前のチャット内容の追加)
    setConversation([...conversation, ...newConversation]);

    // メッセージの消去(フォームのクリア)
    setMessage('');
  }, [answer]);

  // フォーム送信時の処理
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    // フォームが空のとき
    if (!message) {
      alert('メッセージがありません。');
      return;
    }

    // APIリクエスト中はスルー
    if (loading) return;

    // APIリクエストを開始する前にローディング表示を開始
    setLoading(true);

    try {
      // API リクエスト
      const response = await axios.post(`${API_URL}chat/completions`, {
        model: MODEL,
        messages: [
          ...conversation,
          {
            'role': 'user',
            'content': message,
          },
        ],
      }, {
        // HTTPヘッダー(認証)
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      // 回答の取得
      setAnswer(response.data.choices[0].message.content.trim());

    } catch (error) {
      // エラーハンドリング
      console.error(error);

    } finally {
      // 後始末
      setLoading(false);  // ローディング終了
      prevMessageRef.current = message; // 今回のメッセージを保持
    }
  }, [loading, message, conversation]);

  // チャット内容
  const ChatContent = React.memo(({ prevMessage, answer }) => {
    return (
      <div className='result'>
        <div className='current-message'>
          <h2>質問:</h2>
          <p>{prevMessage}</p>
        </div>
        <div className='current-answer'>
          <h2>回答:</h2>
          <p>{answer.split(/\n/)
            .map((item, index) => {
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
      </div>
    )
  });

  // フォームの表示
  return (
    <div>
      <div className='character-area'>
        <div className="message-box">
          <div>
            <h1 className="message-title">何について調べますか？</h1>
            <form onSubmit={handleSubmit}>
              <label>
                <textarea
                  rows='4'
                  className="input-area"
                  placeholder="ここに質問文を入力し、[検索]をクリックしてください！"
                  value={message}
                  onChange={e => { setMessage(e.target.value); }}
                />
              </label>
              <div className="btn-area">
                <button type="submit" className="btn">オプション(O)</button>
                <button type="submit" className="btn">検索(S)</button>
              </div>
            </form>
            {loading && (
              <div className='loading'>
                <p>回答中...</p>
                <img src="/images/indicator.gif" alt="loading" className='indicator' />
              </div>
            )}
            {answer && !loading && (
              <ChatContent
                prevMessage={prevMessageRef.current}
                answer={answer}
              />
            )}
          </div>
        </div>
        <img src="/images/GPTKairuKun.png" alt="GPTKairuKun" className='character-image' />
      </div>
    </div>
  );
}

export default Chat;