// client/src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { chatService, type ChatRequest } from '@/lib/api';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  metadata?: {
    certifications?: any[];
    category?: string;
  };
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (messageText: string, file?: File) => {
    try {
      setError(null);
      
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now() + '-user',
        sender: 'user',
        content: messageText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      // Send to FastAPI backend
      const chatRequest: ChatRequest = {
        message: messageText,
        file: file,
      };

      const response = await chatService.sendMessage(chatRequest);
      
      // Add bot response
      const botMessage: Message = {
        id: Date.now() + '-bot',
        sender: 'bot',
        content: response.response || response.message,
        timestamp: new Date(),
        metadata: {
          certifications: response.certifications || [],
          category: response.category,
        },
      };

      setMessages(prev => [...prev, botMessage]);
      
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to send message';
      setError(errorMessage);
      
      // Add error message
      const errorBotMessage: Message = {
        id: Date.now() + '-error',
        sender: 'bot',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const loadChatHistory = useCallback(async () => {
    try {
      const history = await chatService.getChatHistory();
      
      // Convert API response to Message format
      const convertedMessages: Message[] = history.map(item => [
        {
          id: `${item.id}-user`,
          sender: 'user' as const,
          content: item.message,
          timestamp: new Date(item.timestamp),
        },
        {
          id: `${item.id}-bot`,
          sender: 'bot' as const,
          content: item.response,
          timestamp: new Date(item.timestamp),
        }
      ]).flat();
      
      setMessages(convertedMessages);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setError(null);
      const response = await chatService.uploadPDF(file);
      return { success: true, message: response.message };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to upload file';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    loadChatHistory,
    uploadFile,
    clearMessages,
  };
};