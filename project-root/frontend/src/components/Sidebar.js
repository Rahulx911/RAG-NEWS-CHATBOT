import React from 'react';
import ChatHistoryItem from './ChatHistoryItem';
import '../styles/Sidebar.scss';

const Sidebar = ({ 
  isOpen, 
  onToggle, 
  chatHistory, 
  currentSessionId, 
  onLoadChat, 
  onDeleteChat, 
  onNewChat 
}) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <h2>💬 Chat History</h2>
          </div>
          <button className="new-chat-btn" onClick={onNewChat}>
            <span className="icon">➕</span>
            New Chat
          </button>
        </div>

        <div className="sidebar-content">
          {chatHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No chat history yet.</p>
              <p>Start a conversation!</p>
            </div>
          ) : (
            <div className="chat-history-list">
              {chatHistory.map((chat) => (
                <ChatHistoryItem
                  key={chat.sessionId}
                  chat={chat}
                  isActive={chat.sessionId === currentSessionId}
                  onLoad={onLoadChat}
                  onDelete={onDeleteChat}
                />
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="app-info">
            <div className="version">v1.0.0</div>
            <div className="powered-by">Powered by RAG & Gemini AI</div>
          </div>
        </div>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
    </>
  );
};

export default Sidebar;
