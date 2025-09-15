# RAG News Chatbot

A full-stack Retrieval-Augmented Generation chatbot that answers questions about news articles using AI. Built with React, Node.js, and Google Gemini AI.

![License](https://img.shields.io/badge/License-MIT-blue) ![Node](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-18-blue)

---

## Overview

The RAG News Chatbot combines retrieval-augmented generation with real-time chat functionality. It ingests news articles, creates vector embeddings, and uses semantic search to provide contextually relevant answers.

### Key Features
- Real-time WebSocket chat
- Smart context retrieval from news corpus
- Persistent chat history with Redis
- Modern React interface with typing animations
- RESTful API and WebSocket support

---

## Architecture

<img width="946" height="218" alt="Screenshot 2025-09-16 at 4 36 35 AM" src="https://github.com/user-attachments/assets/79357b66-605c-4d86-a2ed-d925e94e14ad" />


**Data Flow:**
1. User message → React UI → Socket.IO → Node.js Server
2. Server queries Pinecone for relevant news context
3. Combines context with user query → Google Gemini API
4. AI response → Client with conversation stored in Redis

---

## Tech Stack

**Frontend**
- React 18+ (UI Framework)
- SCSS (Styling)
- Socket.IO Client (WebSocket)

**Backend**
- Node.js 18+ (Runtime)
- Express.js (Web Framework)
- Socket.IO (WebSocket Server)
- Redis (Session Storage)

**AI & Data**
- Google Gemini API (Language Model)
- OpenAI API (Text Embeddings)
- Pinecone (Vector Database)

---

## Repository Structure

<img width="794" height="462" alt="Screenshot 2025-09-16 at 4 37 29 AM" src="https://github.com/user-attachments/assets/547f9e39-0395-418c-9f50-a3598b18067e" />
<img width="835" height="218" alt="Screenshot 2025-09-16 at 4 37 50 AM" src="https://github.com/user-attachments/assets/64d1b0cc-29ec-4957-84d5-729505035f90" />
<img width="850" height="499" alt="Screenshot 2025-09-16 at 4 38 27 AM" src="https://github.com/user-attachments/assets/9693b3d3-0668-4f20-a9cf-4b80110d0fa0" />
<img width="700" height="502" alt="Screenshot 2025-09-16 at 4 39 05 AM" src="https://github.com/user-attachments/assets/564c718d-b95c-4ebb-89ba-7e02019e3d86" />


text

---

## Quick Start

### Prerequisites
- Node.js 18+, npm
- Redis server
- API Keys: OpenAI, Pinecone, Google Cloud
- Google Service Account JSON file

### Setup Commands
Clone repository
git clone https://github.com/Rahulx911/RAG-NEWS-CHATBOT.git
cd RAG-NEWS-CHATBOT

Backend setup
cd project-root
npm install --legacy-peer-deps
cp .env.example .env

Edit .env with your API keys
Frontend setup
cd ../frontend
npm install
cp .env.example .env

Start services (3 terminals)
redis-server # Terminal 1
cd project-root && node src/app.js # Terminal 2
cd frontend && npm start # Terminal 3

text

### Access Points
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- WebSocket Test: http://localhost:3000/test

---

## Configuration

### Environment Variables

**Backend (.env)**
OPENAI_API_KEY=your-openai-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=your-environment
PINECONE_INDEX_NAME=news-embeddings
REDIS_URL=redis://localhost:6379
PORT=3000

text

**Frontend (.env)**
REACT_APP_SERVER_URL=http://localhost:3000

text

---

## API Reference

### REST Endpoints

**POST /query** - Send chat message
Request: {"sessionId": "session-id", "question": "What's the news?"}
Response: {"answer": "Based on recent articles..."}

text

**GET /history/:sessionId** - Get chat history
**POST /clear/:sessionId** - Clear session

### WebSocket Events
- Client → Server: `user_message`, `clear`
- Server → Client: `history`, `assistant_message`, `cleared`, `error`

---

## RAG Pipeline Process

<img width="843" height="171" alt="Screenshot 2025-09-16 at 4 37 04 AM" src="https://github.com/user-attachments/assets/253bca76-1830-41e5-9443-f186a10ceb86" />


text

1. **Ingestion**: Fetch news articles from RSS feeds
2. **Embedding**: Generate vector embeddings using OpenAI
3. **Storage**: Store vectors in Pinecone database
4. **Query**: User question converted to embedding
5. **Search**: Semantic similarity search for relevant articles
6. **Generation**: Gemini AI generates response with context

---

## Development

### Backend Development
cd project-root
npx nodemon src/app.js # Development mode
npm test # Run tests

text

### Frontend Development
cd frontend
npm start # Development server
npm run build # Production build
npm test # Run tests

text

---

## Deployment

### Docker Example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["node", "src/app.js"]

text

### Cloud Options
- **Frontend**: Netlify, Vercel, Firebase Hosting
- **Backend**: Railway, Render, Google Cloud Run
- **Redis**: Redis Cloud, Google Cloud Memorystore

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

### Code Standards
- Follow existing patterns
- Add comments for complex logic
- Include tests for new features
- Update documentation

---

## License

MIT License - see LICENSE file for details.

---

## Support

- GitHub Issues: [Report bugs](https://github.com/Rahulx911/RAG-NEWS-CHATBOT/issues)
- Discussions: [Community support](https://github.com/Rahulx911/RAG-NEWS-CHATBOT/discussions)

---

**Built with React, Node.js, Google Gemini AI, and modern web technologies.**
