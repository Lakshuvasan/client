// client/src/pages/ChatPage.tsx
import { useEffect } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatWelcome } from '@/components/chat/chat-welcome';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';

export function ChatPage() {
  const { messages, isTyping, sendMessage, loadChatHistory } = useChat();
  const { isAuthenticated } = useAuth();

  // Load chat history when component mounts (if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      loadChatHistory();
    }
  }, [isAuthenticated, loadChatHistory]);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex flex-col">
      <ChatHeader />
      
      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {messages.length === 0 ? (
          <ChatWelcome onSuggestionClick={handleSuggestionClick} />
        ) : (
          <ChatMessages messages={messages} isTyping={isTyping} />
        )}
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          isTyping={isTyping}
        />
      </main>
    </div>
  );
}