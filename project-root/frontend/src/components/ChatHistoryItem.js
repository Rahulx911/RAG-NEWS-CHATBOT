import React, { useState } from 'react';
import '../styles/ChatHistoryItem.scss';

const ChatHistoryItem = ({ chat, isActive, onLoad, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const chatTime = new Date(timestamp);
    const diffInHours = (now - chatTime) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return chatTime.toLocaleDateString();
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete(chat.sessionId);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div 
      className={`chat-history-item ${isActive ? 'active' : ''}`}
      onClick={() => onLoad(chat.sessionId)}
    >
      <div className="chat-item-content">
        <div className="chat-title">{chat.title}</div>
        <div className="chat-preview">
          {chat.lastMessage.length > 50 
            ? chat.lastMessage.substring(0, 50) + '...' 
            : chat.lastMessage}
        </div>
        <div className="chat-meta">
          <span className="message-count">💬 {chat.messageCount}</span>
          <span className="timestamp">{formatTimestamp(chat.timestamp)}</span>
        </div>
      </div>
      
      <div className="chat-actions">
        <button 
          className={`delete-btn ${showDeleteConfirm ? 'confirm' : ''}`}
          onClick={handleDelete}
          title={showDeleteConfirm ? 'Click again to confirm' : 'Delete chat'}
        >
          {showDeleteConfirm ? '✓' : '🗑️'}
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="delete-overlay" onClick={(e) => {
          e.stopPropagation();
          setShowDeleteConfirm(false);
        }} />
      )}
    </div>
  );
};

export default ChatHistoryItem;
