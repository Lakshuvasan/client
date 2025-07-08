import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { registerUserSchema, loginUserSchema, type User } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Authentication middleware (required)
export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  try {
    const user = await storage.getUser(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
}

// Optional authentication middleware
export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    // No token provided, continue without user
    req.user = undefined;
    return next();
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    // Invalid token, continue without user
    req.user = undefined;
    return next();
  }

  try {
    const user = await storage.getUser(decoded.id);
    req.user = user || undefined;
    next();
  } catch (error) {
    console.error("Optional authentication error:", error);
    req.user = undefined;
    next();
  }
}

// Admin authentication middleware
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}

// Register user
export async function registerUser(req: Request, res: Response) {
  try {
    const validatedData = registerUserSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await storage.createUser({
      ...validatedData,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user);

    // Return user data (without password)
    const { password, ...userWithoutPassword } = user;
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Registration failed" });
  }
}

// Login user
export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = loginUserSchema.parse(req.body);

    // Find user
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Login failed" });
  }
}

// Get current user
export async function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { password, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
}

// Initialize default admin account
export async function initializeDefaultAccounts() {
  try {
    // Check if admin exists
    const existingAdmin = await storage.getUserByEmail("admin@certibot.com");
    if (!existingAdmin) {
      console.log("Creating default admin account...");
      const hashedPassword = await hashPassword("admin123");
      await storage.createUser({
        username: "admin",
        email: "admin@certibot.com",
        password: hashedPassword,
        role: "admin",
        firstName: "Admin",
        lastName: "User",
      });
      console.log("✓ Default admin account created: admin@certibot.com / admin123");
    }

    // Check if demo user exists
    const existingUser = await storage.getUserByEmail("user@certibot.com");
    if (!existingUser) {
      console.log("Creating default user account...");
      const hashedPassword = await hashPassword("user123");
      await storage.createUser({
        username: "user",
        email: "user@certibot.com",
        password: hashedPassword,
        role: "user",
        firstName: "Demo",
        lastName: "User",
      });
      console.log("✓ Default user account created: user@certibot.com / user123");
    }
  } catch (error) {
    console.error("Error initializing default accounts:", error);
  }
}