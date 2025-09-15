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

graph TD
A[React Client] <--> B[Node.js Server]
B <--> C[Google Gemini AI]
B <--> D[OpenAI Embeddings]
B <--> E[Pinecone Vector DB]
B <--> F[Redis Cache]
B <--> G[News Sources]
A --> |Socket.IO| B
B --> |REST API| A

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

RAG-NEWS-CHATBOT/
├── project-root/ # Backend
│ ├── src/
│ │ ├── app.js # Main server entry
│ │ ├── newsIngest.js # Article ingestion
│ │ ├── embeddings.js # OpenAI embeddings
│ │ ├── vectorStore.js # Pinecone operations
│ │ ├── geminiApi.js # Gemini integration
│ │ ├── ragChat.js # RAG pipeline
│ │ ├── redisClient.js # Redis operations
│ │ └── socketServer.js # WebSocket server
│ ├── package.json
│ └── .env.example
│
├── frontend/ # React app
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── services/ # API services
│ │ └── styles/ # SCSS files
│ ├── package.json
│ └── .env.example
│
└── README.md

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

flowchart LR
A[News Articles] --> B[Text Embedding]
B --> C[Vector Storage]
D[User Query] --> E[Query Embedding]
E --> F[Semantic Search]
C --> F
F --> G[Context Retrieval]
G --> H[Gemini AI]
H --> I[Response]

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
