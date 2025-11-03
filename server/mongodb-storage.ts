import { MongoClient, Db, Collection } from 'mongodb';
import { type User, type InsertUser, type Canvas, type InsertCanvas } from "@shared/schema";
import { randomUUID } from "crypto";
import { IStorage } from './storage';
import { config } from './config';

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private users: Collection<User>;
  private canvases: Collection<Canvas>;
  private isConnected: boolean = false;

  constructor(connectionString: string, dbName: string = 'sketchboard') {
    this.client = new MongoClient(connectionString, config.mongodb.options);
    this.db = this.client.db(dbName);
    this.users = this.db.collection<User>('users');
    this.canvases = this.db.collection<Canvas>('canvases');
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        console.log('🔄 Attempting to connect to MongoDB...');
        
        await this.client.connect();
        // Test the connection
        await this.client.db("admin").command({ ping: 1 });
        this.isConnected = true;
        console.log('✅ Successfully connected to MongoDB!');
        
        // Create indexes for better performance
        await this.users.createIndex({ username: 1 }, { unique: true });
        await this.canvases.createIndex({ code: 1 }, { unique: true });
        
        // Seed demo canvases if collection is empty
        const canvasCount = await this.canvases.countDocuments();
        if (canvasCount === 0) {
          await this.seedDemoCanvases();
        }
      } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        console.log('💡 Please check your MongoDB Atlas cluster URL and credentials');
        console.log('💡 Make sure your IP address is whitelisted in MongoDB Atlas');
        console.log('💡 Verify your cluster is active and accessible');
        throw error;
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }

  private async seedDemoCanvases(): Promise<void> {
    const demoCanvases = [
      { code: "ABC123", name: "Design Meeting" },
      { code: "XYZ789", name: "Team Brainstorm" },
      { code: "DEF456", name: "Project Sketch" },
    ];

    const emptyCanvasData = { version: "6.0.0", objects: [] };
    const now = new Date();

    const canvasesToInsert = demoCanvases.map((demo) => ({
      id: randomUUID(),
      name: demo.name,
      code: demo.code,
      canvasData: emptyCanvasData,
      thumbnail: null,
      createdAt: now,
      modifiedAt: now,
    }));

    await this.canvases.insertMany(canvasesToInsert);
    console.log('Seeded demo canvases');
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = await this.users.findOne({ id });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.users.findOne({ username });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: randomUUID(),
      ...insertUser,
    };
    
    await this.users.insertOne(user);
    return user;
  }

  async getCanvas(id: string): Promise<Canvas | undefined> {
    const canvas = await this.canvases.findOne({ id });
    return canvas || undefined;
  }

  async getCanvasByCode(code: string): Promise<Canvas | undefined> {
    const canvas = await this.canvases.findOne({ code });
    return canvas || undefined;
  }

  async listCanvases(): Promise<Canvas[]> {
    const canvases = await this.canvases.find({}).sort({ modifiedAt: -1 }).toArray();
    return canvases;
  }

  async createCanvas(insertCanvas: InsertCanvas): Promise<Canvas> {
    const now = new Date();
    const canvas = {
      id: randomUUID(),
      ...insertCanvas,
      createdAt: now,
      modifiedAt: now,
    } as Canvas;
    
    await this.canvases.insertOne(canvas);
    return canvas;
  }

  async updateCanvas(id: string, data: Partial<InsertCanvas>): Promise<Canvas | undefined> {
    const updateData = {
      ...data,
      modifiedAt: new Date(),
    };
    
    const result = await this.canvases.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return result || undefined;
  }

  async deleteCanvas(id: string): Promise<boolean> {
    const result = await this.canvases.deleteOne({ id });
    return result.deletedCount > 0;
  }
}