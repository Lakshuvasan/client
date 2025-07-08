import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./services/openai";
import { insertChatSessionSchema, insertChatMessageSchema, chatResponseSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";
import "./data/certifications"; // Initialize certifications
import { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
  authenticateToken, 
  requireAdmin,
  optionalAuth,
  initializeDefaultAccounts,
  type AuthenticatedRequest 
} from "./auth";

const sendMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize default accounts
  await initializeDefaultAccounts();

  // Authentication routes
  app.post("/api/auth/register", registerUser);
  app.post("/api/auth/login", loginUser);
  app.get("/api/auth/user", authenticateToken, getCurrentUser);

  // Get all users (admin only)
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      // This would require extending storage to get all users
      res.json({ message: "Admin access working - user list endpoint" });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  // Create or get chat session (optional authentication)
  app.post("/api/chat/session", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const sessionId = nanoid();
      const userId = req.user?.id || null; // Optional user association
      const session = await storage.createChatSession({ sessionId, userId });
      res.json({ sessionId: session.sessionId });
    } catch (error) {
      console.error("Session creation error:", error);
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  // Send message and get AI response
  app.post("/api/chat/message", async (req, res) => {
    try {
      const { message, sessionId: providedSessionId } = sendMessageSchema.parse(req.body);
      
      // Create session if not provided
      let sessionId = providedSessionId;
      if (!sessionId) {
        sessionId = nanoid();
        await storage.createChatSession({ sessionId });
      }

      // Verify session exists
      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      // Save user message
      await storage.createChatMessage({
        sessionId,
        sender: "user",
        content: message,
        metadata: null,
      });

      // Get chat history for context
      const chatHistory = await storage.getChatMessages(sessionId);
      
      // Get all certifications for AI to reference
      const availableCertifications = await storage.getAllCertifications();

      // Generate AI response
      const aiResponse = await generateChatResponse(
        message, 
        availableCertifications,
        chatHistory.slice(-10) // Last 10 messages for context
      );

      // Get recommended certifications
      const recommendedCerts = aiResponse.recommendations.length > 0 
        ? availableCertifications.filter(cert => 
            aiResponse.recommendations.some(rec => rec.id === cert.id)
          ).map(cert => {
            const recommendation = aiResponse.recommendations.find(rec => rec.id === cert.id);
            return {
              ...cert,
              relevanceScore: recommendation?.relevanceScore || 0,
              reasoning: recommendation?.reasoning || ""
            };
          })
        : [];

      // Save bot response with metadata
      await storage.createChatMessage({
        sessionId,
        sender: "bot",
        content: aiResponse.message,
        metadata: {
          certifications: recommendedCerts,
          category: aiResponse.category,
        },
      });

      const response = {
        message: aiResponse.message,
        certifications: recommendedCerts,
        sessionId,
      };

      res.json(response);
    } catch (error) {
      console.error("Chat message error:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Get chat history
  app.get("/api/chat/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  // Get all certifications
  app.get("/api/certifications", async (req, res) => {
    try {
      const certifications = await storage.getAllCertifications();
      res.json(certifications);
    } catch (error) {
      console.error("Get certifications error:", error);
      res.status(500).json({ message: "Failed to get certifications" });
    }
  });

  // Search certifications
  app.get("/api/certifications/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const certifications = await storage.searchCertifications(q);
      res.json(certifications);
    } catch (error) {
      console.error("Search certifications error:", error);
      res.status(500).json({ message: "Failed to search certifications" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
