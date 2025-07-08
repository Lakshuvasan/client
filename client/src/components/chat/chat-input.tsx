import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  isTyping: boolean;
}

export function ChatInput({ onSendMessage, disabled, isTyping }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const canSend = message.trim().length > 0 && !disabled && !isTyping;

  return (
    <footer className="bg-surface border-t border-slate-200 sticky bottom-0">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask me about any certification program..."
              rows={1}
              className="chat-input w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-slate-800 placeholder-slate-500 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              disabled={disabled}
            />
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="absolute right-2 bottom-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <i className="fas fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-secondary">
            CERTI-BOT can make mistakes. Please verify important certification information.
          </p>
        </div>
      </div>
    </footer>
  );
}
