import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import '../styles/ChatWindow.scss';

const ChatWindow = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 && !isLoading && (
          <div className="welcome-message">
            <h3>👋 Welcome to RAG News Chatbot!</h3>
            <p>Ask me anything about recent news and current events.</p>
            <div className="example-questions">
              <p><strong>Try asking:</strong></p>
              <ul>
                <li>"What's happening in India today?"</li>
                <li>"Tell me about recent technology news"</li>
                <li>"What are the latest sports updates?"</li>
              </ul>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}

        {isLoading && (
          <div className="typing-indicator">
            <div className="typing-avatar">🤖</div>
            <div className="typing-bubble">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">Assistant is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
