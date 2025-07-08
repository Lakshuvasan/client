import { 
  users, chatSessions, chatMessages, certifications,
  type User, type InsertUser,
  type ChatSession, type InsertChatSession,
  type ChatMessage, type InsertChatMessage,
  type Certification, type InsertCertification
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  
  getAllCertifications(): Promise<Certification[]>;
  searchCertifications(query: string): Promise<Certification[]>;
  getCertificationsByCategory(category: string): Promise<Certification[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatSessions: Map<string, ChatSession>;
  private chatMessages: Map<string, ChatMessage[]>;
  private certifications: Map<number, Certification>;
  private currentUserId: number;
  private currentSessionId: number;
  private currentMessageId: number;
  private currentCertificationId: number;

  constructor() {
    this.users = new Map();
    this.chatSessions = new Map();
    this.chatMessages = new Map();
    this.certifications = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
    this.currentMessageId = 1;
    this.currentCertificationId = 1;
    
    // Initialize with certification data
    this.initializeCertifications();
  }

  private initializeCertifications() {
    // This will be populated by the certifications data file
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = this.currentSessionId++;
    const session: ChatSession = { 
      ...insertSession, 
      id,
      createdAt: new Date()
    };
    this.chatSessions.set(insertSession.sessionId, session);
    this.chatMessages.set(insertSession.sessionId, []);
    return session;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(sessionId);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentMessageId++;
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
      metadata: insertMessage.metadata || null
    };
    
    const messages = this.chatMessages.get(insertMessage.sessionId) || [];
    messages.push(message);
    this.chatMessages.set(insertMessage.sessionId, messages);
    
    return message;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.chatMessages.get(sessionId) || [];
  }

  async getAllCertifications(): Promise<Certification[]> {
    return Array.from(this.certifications.values());
  }

  async searchCertifications(query: string): Promise<Certification[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.certifications.values()).filter(cert => 
      cert.name.toLowerCase().includes(searchTerm) ||
      cert.description.toLowerCase().includes(searchTerm) ||
      cert.category.toLowerCase().includes(searchTerm) ||
      cert.provider.toLowerCase().includes(searchTerm) ||
      cert.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async getCertificationsByCategory(category: string): Promise<Certification[]> {
    return Array.from(this.certifications.values()).filter(cert => 
      cert.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Method to add certifications (used during initialization)
  addCertification(cert: InsertCertification): Certification {
    const id = this.currentCertificationId++;
    const certification: Certification = { ...cert, id };
    this.certifications.set(id, certification);
    return certification;
  }
}

export const storage = new MemStorage();
