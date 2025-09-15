import React from 'react';
import '../styles/SessionControls.scss';

const SessionControls = ({ onClearSession, onNewSession, disabled }) => {
  return (
    <div className="session-controls">
      <button
        onClick={onClearSession}
        disabled={disabled}
        className="clear-button"
        title="Clear current conversation"
      >
        🗑️ Clear Chat
      </button>
      
      <button
        onClick={onNewSession}
        disabled={disabled}
        className="new-session-button"
        title="Start new session"
      >
        ➕ New Session
      </button>
    </div>
  );
};

export default SessionControls;
