import { io } from 'socket.io-client';

class SocketService {
  socket = null;
  sessionId = null;

  connect(sessionId) {
    this.sessionId = sessionId;
    this.socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:3000', {
      query: { sessionId }
    });

    return new Promise((resolve) => {
      this.socket.on('connect', () => {
        console.log('Connected to server');
        resolve();
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message, callback) {
    if (this.socket) {
      this.socket.emit('user_message', message, callback);
    }
  }

  clearSession(callback) {
    if (this.socket) {
      this.socket.emit('clear', callback);
    }
  }

  onHistory(callback) {
    if (this.socket) {
      this.socket.on('history', callback);
    }
  }

  onAssistantMessage(callback) {
    if (this.socket) {
      this.socket.on('assistant_message', callback);
    }
  }

  onSessionCleared(callback) {
    if (this.socket) {
      this.socket.on('cleared', callback);
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  offAllListeners() {
    if (this.socket) {
      this.socket.off();
    }
  }
}

export default new SocketService();
