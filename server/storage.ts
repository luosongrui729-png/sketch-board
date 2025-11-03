import { type User, type InsertUser, type Canvas, type InsertCanvas } from "@shared/schema";
import { randomUUID } from "crypto";
import { MongoStorage } from './mongodb-storage';
import { config } from './config';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Canvas CRUD methods
  getCanvas(id: string): Promise<Canvas | undefined>;
  getCanvasByCode(code: string): Promise<Canvas | undefined>;
  listCanvases(): Promise<Canvas[]>;
  createCanvas(canvas: InsertCanvas): Promise<Canvas>;
  updateCanvas(id: string, data: Partial<InsertCanvas>): Promise<Canvas | undefined>;
  deleteCanvas(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private canvases: Map<string, Canvas>;

  constructor() {
    this.users = new Map();
    this.canvases = new Map();
    
    // Seed demo canvases for landing page
    this.seedDemoCanvases();
  }

  private seedDemoCanvases() {
    const demoCanvases = [
      { code: "ABC123", name: "Design Meeting" },
      { code: "XYZ789", name: "Team Brainstorm" },
      { code: "DEF456", name: "Project Sketch" },
    ];

    const emptyCanvasData = JSON.stringify({ version: "6.0.0", objects: [] });
    const now = new Date();

    demoCanvases.forEach((demo) => {
      const id = randomUUID();
      const canvas: Canvas = {
        id,
        name: demo.name,
        code: demo.code,
        canvasData: emptyCanvasData,
        thumbnail: null,
        createdAt: now,
        modifiedAt: now,
      };
      this.canvases.set(id, canvas);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { id: randomUUID(), ...insertUser };
    this.users.set(user.id, user);
    return user;
  }

  async getCanvas(id: string): Promise<Canvas | undefined> {
    return this.canvases.get(id);
  }

  async getCanvasByCode(code: string): Promise<Canvas | undefined> {
    return Array.from(this.canvases.values()).find(
      (canvas) => canvas.code === code,
    );
  }

  async listCanvases(): Promise<Canvas[]> {
    return Array.from(this.canvases.values()).sort(
      (a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime(),
    );
  }

  async createCanvas(insertCanvas: InsertCanvas): Promise<Canvas> {
    const now = new Date();
    const canvas = {
      id: randomUUID(),
      ...insertCanvas,
      createdAt: now,
      modifiedAt: now,
    } as Canvas;
    this.canvases.set(canvas.id, canvas);
    return canvas;
  }

  async updateCanvas(id: string, data: Partial<InsertCanvas>): Promise<Canvas | undefined> {
    const canvas = this.canvases.get(id);
    if (!canvas) return undefined;

    const updatedCanvas: Canvas = {
      ...canvas,
      ...data,
      modifiedAt: new Date(),
    };
    this.canvases.set(id, updatedCanvas);
    return updatedCanvas;
  }

  async deleteCanvas(id: string): Promise<boolean> {
    return this.canvases.delete(id);
  }
}

// Try to connect to MongoDB, fallback to in-memory storage if it fails
async function initializeStorage(): Promise<IStorage> {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    const mongoStorage = new MongoStorage(config.mongodb.connectionString, config.mongodb.database);
    await mongoStorage.connect();
    console.log('✅ Using MongoDB storage');
    return mongoStorage;
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, falling back to in-memory storage');
    console.log('📝 To use MongoDB, please:');
    console.log('   1. Get your correct MongoDB Atlas cluster URL');
    console.log('   2. Update server/config.ts with the correct cluster URL');
    console.log('   3. Ensure your IP is whitelisted in MongoDB Atlas');
    console.log('   4. Verify your credentials are correct');
    console.log('🔄 Using in-memory storage for now...');
    return new MemStorage();
  }
}

// Initialize storage (will be MongoDB if available, otherwise in-memory)
let storageInstance: IStorage | null = null;

export const getStorage = async (): Promise<IStorage> => {
  if (!storageInstance) {
    storageInstance = await initializeStorage();
  }
  return storageInstance;
};

// For backward compatibility, export a promise that resolves to storage
export const storage = initializeStorage();
