import { createServer } from "node:http";
import { Server } from "socket.io";
import { getHistory, clearHistory } from "./redisClient.js";
import { handleUserQuery } from "./ragChat.js";

export function attachSocket(app, httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*", credentials: true },
  });

  // If you use express-session, share it with Socket.IO as per docs:
  // io.engine.use(sessionMiddleware); // see Socket.IO session guide [7]

  io.on("connection", (socket) => {
    const { sessionId } = socket.handshake.query || {};
    if (!sessionId) {
      socket.emit("error", "sessionId is required");
      return socket.disconnect(true);
    }

    // Join a room per session for targeted emits
    socket.join(sessionId);

    // Send recent history on connect
    getHistory(sessionId, 200).then((hist) => socket.emit("history", hist));

    socket.on("user_message", async (text, ack) => {
      try {
        const answer = await handleUserQuery(sessionId, text);
        io.to(sessionId).emit("assistant_message", answer);
        if (ack) ack({ ok: true, answer });
      } catch (e) {
        const msg = String(e?.message || e);
        socket.emit("error", msg);
        if (ack) ack({ ok: false, error: msg });
      }
    });

    socket.on("clear", async (ack) => {
      await clearHistory(sessionId);
      io.to(sessionId).emit("cleared");
      if (ack) ack({ ok: true });
    });
  });

  return io;
}
