import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCanvasSchema } from "@shared/schema";
import { setupWebSocket } from "./websocket";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize storage once
  const storageInstance = await storage;
  
  // Canvas CRUD routes
  
  // List all canvases
  app.get("/api/canvases", async (_req, res) => {
    try {
      const canvases = await storageInstance.listCanvases();
      res.json(canvases);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get canvas by ID
  app.get("/api/canvases/:id", async (req, res) => {
    try {
      const canvas = await storageInstance.getCanvas(req.params.id);
      if (!canvas) {
        return res.status(404).json({ error: "Canvas not found" });
      }
      res.json(canvas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get canvas by code
  app.get("/api/canvases/code/:code", async (req, res) => {
    try {
      const canvas = await storageInstance.getCanvasByCode(req.params.code);
      if (!canvas) {
        return res.status(404).json({ error: "Canvas not found" });
      }
      res.json(canvas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new canvas
  app.post("/api/canvases", async (req, res) => {
    try {
      const result = insertCanvasSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const canvas = await storageInstance.createCanvas(result.data);
      res.status(201).json(canvas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update canvas
  app.patch("/api/canvases/:id", async (req, res) => {
    try {
      const result = insertCanvasSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const canvas = await storageInstance.updateCanvas(req.params.id, result.data);
      if (!canvas) {
        return res.status(404).json({ error: "Canvas not found" });
      }
      res.json(canvas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete canvas
  app.delete("/api/canvases/:id", async (req, res) => {
    try {
      const success = await storageInstance.deleteCanvas(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Canvas not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time collaboration
  setupWebSocket(httpServer);

  return httpServer;
}
