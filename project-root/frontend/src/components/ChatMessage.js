import React, { useState, useEffect } from 'react';
import '../styles/ChatMessage.scss';

const ChatMessage = ({ message }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.role === 'assistant') {
      setIsTyping(true);
      setDisplayedText('');
      
      let i = 0;
      const typingSpeed = 30; // milliseconds per character
      
      const typeText = () => {
        if (i < message.text.length) {
          setDisplayedText(message.text.slice(0, i + 1));
          i++;
          setTimeout(typeText, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };

      // Start typing after a brief delay
      setTimeout(typeText, 300);
    } else {
      setDisplayedText(message.text);
    }
  }, [message.text, message.role]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message ${message.role}`}>
      <div className="message-avatar">
        {message.role === 'user' ? '👤' : '🤖'}
      </div>
      
      <div className="message-content">
        <div className="message-bubble">
          <div className="message-text">
            {displayedText}
            {isTyping && <span className="typing-cursor">|</span>}
          </div>
        </div>
        <div className="message-timestamp">
          {formatTimestamp(message.ts)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
