// client/src/hooks/useChat.ts
import { useState, useCallback } from "react";
import { chatService, type ChatRequest } from "@/lib/api";

interface Message {
  id: string;
  sender: "user" | "bot";
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
  const [sessionId, setSessionId] = useState<string | null>(null);

  const sendMessage = useCallback(async (messageText: string, file?: File) => {
    try {
      setError(null);

      const userMessage: Message = {
        id: Date.now() + "-user",
        sender: "user",
        content: messageText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const chatRequest: ChatRequest = { message: messageText, file };
      const response = await chatService.sendMessage(chatRequest);

      const botMessage: Message = {
        id: Date.now() + "-bot",
        sender: "bot",
        content: response.content,
        timestamp: new Date(response.timestamp),
        metadata: {},
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.response?.data?.detail || "Failed to send message");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "-error",
          sender: "bot",
          content: "I apologize, but I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setError(null);
      const response = await chatService.uploadPDF(file);
      return { success: true, message: response.message };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to upload file";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setSessionId(null);
  }, []);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    uploadFile,
    clearMessages,
  };
};
