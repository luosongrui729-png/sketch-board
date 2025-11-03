import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

interface User {
  id: string;
  name: string;
  canvasId: string;
  cursor?: { x: number; y: number };
  color: string;
  tool: string;
}

interface WSMessage {
  type: string;
  [key: string]: any;
}

const users = new Map<WebSocket, User>();
const userColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DFE6E9", "#74B9FF", "#A29BFE"];

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection");

    ws.on("message", (data: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());
        handleMessage(ws, message, wss);
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      const user = users.get(ws);
      if (user) {
        // Notify others that user left
        broadcast(wss, user.canvasId, {
          type: "user-left",
          userId: user.id,
        }, ws);
        users.delete(ws);
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  return wss;
}

function handleMessage(ws: WebSocket, message: WSMessage, wss: WebSocketServer) {
  switch (message.type) {
    case "join-canvas": {
      const user: User = {
        id: message.userId || generateUserId(),
        name: message.username || "Anonymous",
        canvasId: message.canvasId,
        color: userColors[users.size % userColors.length],
        tool: message.tool || "select",
      };
      users.set(ws, user);

      // Send current users to the new user
      const canvasUsers = getCanvasUsers(user.canvasId);
      send(ws, {
        type: "canvas-state",
        users: canvasUsers.filter(u => u.id !== user.id),
        userId: user.id,
        name: user.name,
        color: user.color,
      });

      // Notify others that a new user joined
      broadcast(wss, user.canvasId, {
        type: "user-joined",
        user: {
          id: user.id,
          name: user.name,
          color: user.color,
          tool: user.tool,
        },
      }, ws);
      break;
    }

    case "tool-change": {
      const user = users.get(ws);
      if (user) {
        user.tool = message.tool;
        broadcast(wss, user.canvasId, {
          type: "tool-change",
          userId: user.id,
          tool: message.tool,
          timestamp: message.timestamp || Date.now(),
        }, ws);
      }
      break;
    }

    case "cursor-move": {
      const user = users.get(ws);
      if (user) {
        user.cursor = message.cursor;
        broadcast(wss, user.canvasId, {
          type: "cursor-move",
          userId: user.id,
          cursor: message.cursor,
          timestamp: message.timestamp || Date.now(),
        }, ws);
      }
      break;
    }

    case "canvas-update": {
      const user = users.get(ws);
      if (user) {
        // Broadcast canvas changes to all users in the same canvas with timestamp
        broadcast(wss, user.canvasId, {
          type: "canvas-update",
          userId: user.id,
          action: message.action,
          data: message.data,
          timestamp: message.timestamp || Date.now(),
        }, ws);
      }
      break;
    }

    case "object-modified": {
      const user = users.get(ws);
      if (user) {
        broadcast(wss, user.canvasId, {
          type: "object-modified",
          userId: user.id,
          object: message.object,
          timestamp: message.timestamp || Date.now(),
        }, ws);
      }
      break;
    }

    case "object-removed": {
      const user = users.get(ws);
      if (user) {
        broadcast(wss, user.canvasId, {
          type: "object-removed",
          userId: user.id,
          objectId: message.objectId,
          timestamp: message.timestamp || Date.now(),
        }, ws);
      }
      break;
    }
  }
}

function broadcast(wss: WebSocketServer, canvasId: string, message: WSMessage, exclude?: WebSocket) {
  wss.clients.forEach((client) => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      const user = users.get(client);
      if (user && user.canvasId === canvasId) {
        send(client, message);
      }
    }
  });
}

function send(ws: WebSocket, message: WSMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function getCanvasUsers(canvasId: string): User[] {
  const canvasUsers: User[] = [];
  users.forEach((user) => {
    if (user.canvasId === canvasId) {
      canvasUsers.push({
        id: user.id,
        name: user.name,
        canvasId: user.canvasId,
        color: user.color,
        tool: user.tool,
        cursor: user.cursor,
      });
    }
  });
  return canvasUsers;
}

function generateUserId(): string {
  return `user_${Math.random().toString(36).substring(2, 11)}`;
}
