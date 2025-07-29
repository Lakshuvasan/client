// client/src/lib/api.ts
import axios from 'axios';

// Create axios instance pointing to your FastAPI backend
export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Types to match your FastAPI backend
export interface User {
  id: string;
  email: string;
  name?: string;
  interests: string[];
}

export interface UserCreateData {
  email: string;
  password: string;
  name?: string;
  interests: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  file?: File;
}

// Auth Services
export const authService = {
  async register(userData: UserCreateData): Promise<AuthResponse> {
    const response = await api.post('/api/users/register', userData);
    
    // Store token if provided
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    
    // Store token
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Chat Services
export const chatService = {
  async sendMessage(chatRequest: ChatRequest): Promise<any> {
    if (chatRequest.file) {
      // Send file with message
      const formData = new FormData();
      formData.append('message', chatRequest.message);
      formData.append('file', chatRequest.file);

      const response = await api.post('/api/chat/session', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } else {
      // Send text message only - updated to match your backend
      const response = await api.post('/api/chat/session', {
        content: chatRequest.message,
         "timestamp": new Date().toISOString(),
      });
      
      return response.data;
    }
  },

  async getChatHistory(): Promise<ChatMessage[]> {
    const response = await api.get('/api/chat/history');
    return response.data;
  },

  async uploadPDF(file: File): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/chat/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};