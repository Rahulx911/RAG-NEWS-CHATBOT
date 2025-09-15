import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import SessionControls from './components/SessionControls';
import socketService from './services/socketService';
import './styles/App.scss';

function App() {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Load chat history from localStorage
    const savedChats = JSON.parse(localStorage.getItem('chat-history') || '[]');
    setChatHistory(savedChats);

    // Generate or get session ID
    const storedSessionId = localStorage.getItem('current-session-id') || uuidv4();
    localStorage.setItem('current-session-id', storedSessionId);
    setSessionId(storedSessionId);

    connectToSession(storedSessionId);

    return () => {
      socketService.disconnect();
    };
  }, []);

  const connectToSession = async (sessionId) => {
    try {
      await socketService.connect(sessionId);
      setIsConnected(true);

      // Listen for events
      socketService.onHistory((history) => {
        const formattedMessages = history.map(msg => ({
          ...msg,
          id: msg.ts || Date.now()
        }));
        setMessages(formattedMessages);
        
        // Update chat history with latest messages
        updateChatHistoryForSession(sessionId, formattedMessages);
      });

      socketService.onAssistantMessage((message) => {
        const newMessage = {
          id: Date.now(),
          role: 'assistant',
          text: message,
          ts: Date.now()
        };
        setMessages(prev => {
          const updated = [...prev, newMessage];
          updateChatHistoryForSession(sessionId, updated);
          return updated;
        });
        setIsLoading(false);
      });

      socketService.onSessionCleared(() => {
        setMessages([]);
        setIsLoading(false);
        updateChatHistoryForSession(sessionId, []);
      });

      socketService.onError((error) => {
        console.error('Socket error:', error);
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const updateChatHistoryForSession = (sessionId, messages) => {
    const chatHistory = JSON.parse(localStorage.getItem('chat-history') || '[]');
    const existingChatIndex = chatHistory.findIndex(chat => chat.sessionId === sessionId);
    
    const chatTitle = messages.length > 0 
      ? messages.find(m => m.role === 'user')?.text?.slice(0, 30) + '...' || 'New Chat'
      : 'New Chat';

    const chatData = {
      sessionId,
      title: chatTitle,
      lastMessage: messages[messages.length - 1]?.text || '',
      timestamp: Date.now(),
      messageCount: messages.length
    };

    if (existingChatIndex >= 0) {
      chatHistory[existingChatIndex] = chatData;
    } else if (messages.length > 0) {
      chatHistory.unshift(chatData);
    }

    // Keep only last 20 chats
    if (chatHistory.length > 20) {
      chatHistory.splice(20);
    }

    localStorage.setItem('chat-history', JSON.stringify(chatHistory));
    setChatHistory([...chatHistory]);
  };

  const handleSendMessage = (message) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: message,
      ts: Date.now()
    };
    
    setMessages(prev => {
      const updated = [...prev, userMessage];
      updateChatHistoryForSession(sessionId, updated);
      return updated;
    });
    setIsLoading(true);

    socketService.sendMessage(message, (ack) => {
      if (!ack?.ok) {
        console.error('Failed to send message:', ack?.error);
        setIsLoading(false);
      }
    });
  };

  const handleClearSession = () => {
    if (!isLoading) {
      setIsLoading(true);
      socketService.clearSession((ack) => {
        if (!ack?.ok) {
          console.error('Failed to clear session:', ack?.error);
          setIsLoading(false);
        }
      });
    }
  };

  const handleNewSession = () => {
    const newSessionId = uuidv4();
    localStorage.setItem('current-session-id', newSessionId);
    setSessionId(newSessionId);
    setMessages([]);
    setIsLoading(false);
    
    socketService.disconnect();
    connectToSession(newSessionId);
  };

  const handleLoadChat = async (selectedSessionId) => {
    if (selectedSessionId === sessionId) return;

    setSessionId(selectedSessionId);
    localStorage.setItem('current-session-id', selectedSessionId);
    setMessages([]);
    setIsLoading(false);
    
    socketService.disconnect();
    await connectToSession(selectedSessionId);
  };

  const handleDeleteChat = (sessionIdToDelete) => {
    const updatedHistory = chatHistory.filter(chat => chat.sessionId !== sessionIdToDelete);
    localStorage.setItem('chat-history', JSON.stringify(updatedHistory));
    setChatHistory(updatedHistory);

    // If we deleted the current session, create a new one
    if (sessionIdToDelete === sessionId) {
      handleNewSession();
    }
  };

  return (
    <div className="app">
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chatHistory={chatHistory}
        currentSessionId={sessionId}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewSession}
      />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="app-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1>RAG News Chatbot</h1>
          </div>
          <div className="connection-status">
            {isConnected ? (
              <span className="connected">🟢 Connected</span>
            ) : (
              <span className="disconnected">🔴 Connecting...</span>
            )}
          </div>
        </header>
        
        <main className="app-main">
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading}
          />
          
          <div className="app-controls">
            <MessageInput 
              onSendMessage={handleSendMessage}
              disabled={!isConnected || isLoading}
            />
            <SessionControls 
              onClearSession={handleClearSession}
              onNewSession={handleNewSession}
              disabled={!isConnected || isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
