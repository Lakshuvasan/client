import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

interface ChatResponse {
  message: string;
  certifications?: any[];
  sessionId: string;
}

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  // Create session on mount
  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await apiRequest("POST", "/api/chat/session");
        const data = await response.json();
        setSessionId(data.sessionId);
      } catch (error) {
        console.error("Failed to create session:", error);
        toast({
          title: "Connection Error",
          description: "Failed to initialize chat session. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    createSession();
  }, [toast]);

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message }: { message: string }): Promise<ChatResponse> => {
      const response = await apiRequest("POST", "/api/chat/message", {
        message,
        sessionId,
      });
      return response.json();
    },
    onMutate: ({ message }) => {
      // Add user message immediately
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
    },
    onSuccess: (data) => {
      // Add bot response
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        content: data.message,
        timestamp: new Date(),
        metadata: {
          certifications: data.certifications,
        },
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Update session ID if it wasn't set
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
      }
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      setIsTyping(false);
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (message: string) => {
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate({ message: message.trim() });
    }
  };

  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const showWelcome = messages.length === 0 && !isTyping;

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <ChatHeader />
      
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {showWelcome && (
          <ChatWelcome onSuggestionClick={handleSuggestionClick} />
        )}
        
        {!showWelcome && (
          <ChatMessages 
            messages={messages} 
            isTyping={isTyping}
          />
        )}
      </main>

      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={sendMessageMutation.isPending}
        isTyping={isTyping}
      />
    </div>
  );
}
